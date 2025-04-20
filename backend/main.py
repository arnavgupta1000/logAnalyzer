from fastapi import FastAPI
from routers.log_router import router as log_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
app.include_router(log_router, prefix="/api")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)
