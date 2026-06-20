from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.api.routes.retention import router as retention_router
from backend.api.routes.risk import router as risk_router
from backend.api.routes.recommendations import router as recommendations_router

app = FastAPI(
    title="Knowledge Tracker API",
    description="REST API for knowledge retention decay calculations and revision recommendations.",
    version="1.0.0"
)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allows all origins in development. Can be restricted to localhost:5173 in production.
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes under the /api prefix
app.include_router(retention_router, prefix="/api", tags=["Retention"])
app.include_router(risk_router, prefix="/api", tags=["Risk"])
app.include_router(recommendations_router, prefix="/api", tags=["Recommendations"])

@app.get("/api/health", tags=["System"])
def health_check():
    """
    Health check endpoint to verify backend service state.
    """
    return {"status": "ok"}
