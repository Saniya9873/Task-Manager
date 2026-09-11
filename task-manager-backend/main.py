from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import client
from app.controllers.task_controller import router as task_router

# instance of fastapi
app = FastAPI(title="Task Manager API", version="1.0.0")

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Startup event for db
@app.on_event("startup")
async def startup_db_client():
    try:
        await client.admin.command('ping')
        print("[SUCCESS] MongoDB Connection Successful!")
    except Exception as e:
        print(f"[ERROR] MongoDB Connection Failed: {e}")

# Include Controllers/Routers
app.include_router(task_router)

@app.get("/")
async def root():
    return {"message": "Task Manager API is running", "docs": "/docs"}