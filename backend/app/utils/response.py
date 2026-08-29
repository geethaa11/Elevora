from fastapi.responses import JSONResponse
from fastapi import HTTPException, Request
from fastapi.exceptions import RequestValidationError

def send_success(data: dict = None, status_code: int = 200) -> JSONResponse:
    """Format and return a success JSON response envelope."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": True,
            "data": data if data is not None else {}
        }
    )

def send_error(code: str, message: str, status_code: int = 400) -> JSONResponse:
    """Format and return an error JSON response envelope."""
    return JSONResponse(
        status_code=status_code,
        content={
            "success": False,
            "error": {
                "code": code,
                "message": message
            }
        }
    )

async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    """Global exception handler for standard FastAPI HTTPExceptions."""
    code = "HTTP_ERROR"
    message = str(exc.detail)
    
    # Map status codes to meaningful contract error codes
    if exc.status_code == 404:
        code = "NOT_FOUND"
    elif exc.status_code == 401:
        code = "UNAUTHORIZED"
    elif exc.status_code == 403:
        code = "FORBIDDEN"
    elif exc.status_code >= 500:
        code = "INTERNAL_SERVER_ERROR"
        
    return send_error(code=code, message=message, status_code=exc.status_code)

async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    """Global exception handler for Pydantic/FastAPI request validation errors."""
    errors = exc.errors()
    message = "Request validation failed."
    
    if errors:
        # Extract a clean, readable error from the first failing parameter
        first_err = errors[0]
        loc = [str(item) for item in first_err.get("loc", []) if item != "body"]
        field_path = ".".join(loc) if loc else "request"
        err_msg = first_err.get("msg", "invalid input")
        message = f"Field '{field_path}' validation failed: {err_msg}"
        
    return send_error(code="VALIDATION_ERROR", message=message, status_code=422)
