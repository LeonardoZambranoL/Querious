from fastapi import APIRouter, HTTPException
from server.helpers.utils import timestamp_to_custom_format
from server.query import log_qa_dict

router = APIRouter()


@router.post("", tags=["query"])
def summary(logId: str, prompt: str, lineFrom: int, lineTo: int, timeFrom: int, timeTo: int):
    """
        Direct endpoint to the summarization functionality. Returns a summary of the log files. Only log lines existing
        within the given time window and line range are considered
    """
    if timeTo < timeFrom:
        raise HTTPException(status_code=400, detail=f"timeTo can not be greater than timeFrom!")
    if lineTo < lineFrom:
        raise HTTPException(status_code=400, detail=f"lineTo can not be greater than lineFrom!")
    if not prompt:
        raise HTTPException(status_code=400, detail=f"Empty prompt!")

    timeFrom = timestamp_to_custom_format(timeFrom)
    timeTo = timestamp_to_custom_format(timeTo)
    try:
        log_qa = log_qa_dict.get(logId)
    except:
        raise HTTPException(status_code=500, detail=f"Something went wrong! Please check that the Id of the "
                                                    f"log exists and you have access to it.")

    try:
        result = log_qa.generate_dynamic_summary(prompt,
                                                 start_id=lineFrom - 1,
                                                 end_id=lineTo - 1,
                                                 start_date=timeFrom,
                                                 end_date=timeTo)
    except:
        raise HTTPException(status_code=500, detail=f"Something went terribly wrong!")
    return result
