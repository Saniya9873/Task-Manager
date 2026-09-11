from urllib.parse import quote_plus
from fastapi import FastAPI, HTTPException, status
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
from motor.motor_asyncio import AsyncIOMotorClient
from bson import ObjectId
from typing import Optional, Literal
from datetime import datetime
import os

app = FastAPI(title="Task Manager API", version="1.0.0")

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

username = os.getenv("MONGO_USER", "saniya")
password = quote_plus(os.getenv("MONGO_PASS", "Saniya9873"))

MONGO_URI = os.getenv(
    "MONGO_URI",
    f"mongodb+srv://{username}:{password}@cluster0.ycbkb6b.mongodb.net/?appName=Cluster0"
)

client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client.task_db

@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("[SUCCESS] MongoDB Connection Successful!")
    except Exception as e:
        print(f"[ERROR] MongoDB Connection Failed: {e}")

class TaskCreateSchema(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = ""
    priority: Literal["low", "medium", "high"] = "medium"
    completed: bool = False

def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task.get("title", ""),
        "description": task.get("description", ""),
        "priority": task.get("priority", "medium"),
        "completed": bool(task.get("completed", False)),
        "created_at": task.get("created_at", "")
    }

@app.get("/")
async def root():
    return {"message": "Task Manager API is running", "docs": "/docs"}

@app.get("/tasks")
async def get_tasks():
    tasks = []
    # Sort tasks descending by creation / _id
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

@app.post("/tasks", status_code=status.HTTP_201_CREATED)
async def create_task(task: TaskCreateSchema):
    task_dict = task.dict()
    task_dict["created_at"] = datetime.utcnow().isoformat()
    new_task = await db.tasks.insert_one(task_dict)
    created_task = await db.tasks.find_one({"_id": new_task.inserted_id})
    return task_helper(created_task)

@app.put("/tasks/{task_id}")
async def toggle_task(task_id: str):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")
        
    task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    if not task:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    
    updated_status = not task.get("completed", False)
    await db.tasks.update_one({"_id": ObjectId(task_id)}, {"$set": {"completed": updated_status}})
    
    updated_task = await db.tasks.find_one({"_id": ObjectId(task_id)})
    return {
        "message": "Status updated",
        "task": task_helper(updated_task)
    }

@app.delete("/tasks/{task_id}")
async def delete_task(task_id: str):
    if not ObjectId.is_valid(task_id):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid task ID format")

    result = await db.tasks.delete_one({"_id": ObjectId(task_id)})
    if result.deleted_count == 0:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Task not found")
    return {"message": "Task deleted successfully", "id": task_id}