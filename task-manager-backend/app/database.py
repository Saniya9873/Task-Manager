import os
from urllib.parse import quote_plus
from motor.motor_asyncio import AsyncIOMotorClient

# for setting connection
username = os.getenv("MONGO_USER", "saniya")
password = quote_plus(os.getenv("MONGO_PASS", "Saniya9873"))

MONGO_URI = os.getenv(
    "MONGO_URI",
    f"mongodb+srv://{username}:{password}@cluster0.ycbkb6b.mongodb.net/?appName=Cluster0"
)

# accessing database
client = AsyncIOMotorClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client.task_db