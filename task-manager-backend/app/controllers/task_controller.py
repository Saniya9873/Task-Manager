from fastapi import APIRouter, HTTPException, status
from app.models.task_model import TaskCreateSchema
from app.services.task_service import TaskService

router = APIRouter(prefix="/tasks", tags=["Tasks"])

# main route
@router.get("")
async def get_tasks():
    return await TaskService.fetch_all_tasks()

# calls func from task_service
@router.post("", status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreateSchema):
    return await TaskService.create_new_task(task)

# runs when error occurs
@router.put("/{task_id}")
async def toggle_task(task_id: str):
    res = await TaskService.toggle_task_status(task_id)
    if res.get("error") == "invalid_id":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")
    if res.get("error") == "not_found":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    return {
        "message": "Status updated",
        "task": res["task"]
    }

# calls delete method from task_service
@router.delete("/{task_id}")
async def delete_task(task_id: str):
    res = await TaskService.remove_task(task_id)
    if res == "invalid_id":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")
    if res == "not_found":
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
        
    return {"message": "Task deleted successfully", "id": task_id}