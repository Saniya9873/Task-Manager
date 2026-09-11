from datetime import datetime
from bson import ObjectId
from app.database import db
from app.models.task_model import task_helper, TaskCreateSchema


class TaskService:
    # fetch all tasks in descending order and maintain count
    @staticmethod
    async def fetch_all_tasks():
        tasks = []
        async for task in db.tasks.find().sort("_id", -1):
            tasks.append(task_helper(task))
        
        total = len(tasks)
        completed = sum(1 for t in tasks if t["completed"])
        left = total - completed
        
        return {
            "tasks": tasks,
            "counts": {
                "total": total,
                "completed": completed,
                "left": left
            }
        }
    # creates new task
    @staticmethod
    async def create_new_task(task: TaskCreateSchema):
        task_dict = task.dict()
        task_dict["created_at"] = datetime.utcnow().isoformat()
        new_task = await db.tasks.insert_one(task_dict)
        created_task = await db.tasks.find_one({"_id": new_task.inserted_id})
        return task_helper(created_task)

    # status updation
    @staticmethod
    async def toggle_task_status(task_id: str):
        if not ObjectId.is_valid(task_id):
            return {"error": "invalid_id"}
            
        task = await db.tasks.find_one({"_id": ObjectId(task_id)})
        if not task:
            return {"error": "not_found"}
        
        updated_status = not task.get("completed", False)
        await db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": {"completed": updated_status}})
        
        updated_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
        return {"task": task_helper(updated_task)}

    # for deleting task
    @staticmethod
    async def remove_task(task_id: str):
        if not ObjectId.is_valid(task_id):
            return "invalid_id"

        result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
        if result.deleted_count == 0:
            return "not_found"
        return "success"