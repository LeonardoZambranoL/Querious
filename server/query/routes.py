from fastapi import APIRouter, HTTPException
from starlette import status
from server.helpers.uuid_utils import is_valid_uuid
from server.query import log_qa_dict
from server.query.log_search import routes as search
from server.query.summarization import routes as summarize
from server.query.question_answering import routes as qa

# Main router for querying
router = APIRouter()

# Add routes to the endpoints
router.include_router(summarize.router, prefix="/summary")
router.include_router(qa.router, prefix="/qa")
router.include_router(search.router, prefix="/search")


@router.post("/get_logs_by_line_number", tags=["query"])
def get_logs_by_line_number(logId: str, line_number: int, neighbor_range: int = 0):
    """
    Endpoint that provides the logline situated on the line_number.
    It will return all lines in the interval [line_number - neighbor_range, line_number + neighbor_range]
    """
    if not is_valid_uuid(logId):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="The id provided is not valid",
        )
    log_qa = log_qa_dict.get(logId)
    line_number -= 1  # Compensate for offset
    neighbor_range = max(neighbor_range, 0)
    result = []
    for i in range(line_number - neighbor_range, line_number + neighbor_range + 1):
        try:
            result.append(log_qa.get_log_line_by_id(i))
        except:
            pass
    return result
