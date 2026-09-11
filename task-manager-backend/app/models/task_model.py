from pydantic import BaseModel, Field
from typing import Optional, Literal

# validate input 
class TaskCreateSchema(BaseModel):
    title: str = Field(..., min_length=1, max_length=200)
    description: Optional[str] = ""
    priority: Literal["low", "medium", "high"] = "medium"
    completed: bool = False

# returns dictionary in output
def task_helper(task) -> dict:
    return {
        "id": str(task["_id"]),
        "title": task.get("title", ""),
        "description": task.get("description", ""),
        "priority": task.get("priority", "medium"),
        "completed": bool(task.get("completed", False)),
        "created_at": task.get("created_at", "")
    }