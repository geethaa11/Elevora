from contextlib import asynccontextmanager
from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from app.database.db import init_db
from app.routers import ai, mentors, auth, hackathons, teaming

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables and seed demo mentors on startup
    init_db()
    yield

app = FastAPI(
    title="Elevora API",
    version="1.0.0",
    description="Elevora API Backend - Developer 2 AI & Mentors Services",
    lifespan=lifespan
)

@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    if isinstance(exc.detail, dict) and "error" in exc.detail:
        return JSONResponse(status_code=exc.status_code, content=exc.detail)
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": "invalid_input" if exc.status_code == 400 else "unauthorized" if exc.status_code == 401 else "not_found" if exc.status_code == 404 else "internal_error",
            "message": str(exc.detail),
            "details": {}
        }
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    errors = exc.errors()
    if errors:
        first_err = errors[0]
        loc = first_err.get("loc", [])
        field_name = str(loc[-1]) if loc else "unknown"
        err_type = first_err.get("type", "")
        
        if "missing" in err_type or err_type.startswith("value_error"):
            return JSONResponse(
                status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                content={
                    "error": "missing_field",
                    "message": f"Field '{field_name}' is required",
                    "details": {"field": field_name}
                }
            )

    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
        content={
            "error": "invalid_input",
            "message": "Malformed request body or validation failed",
            "details": {"errors": str(errors)}
        }
    )

# Include Routers
app.include_router(auth.router)
app.include_router(ai.router)
app.include_router(mentors.router)
app.include_router(hackathons.router)
app.include_router(teaming.router)

@app.get("/")
def read_root():
    return {"message": "Elevora API Backend Dev 2 Services Running"}
