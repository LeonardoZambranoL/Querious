from fastapi import APIRouter, HTTPException
from server.helpers.utils import generate_timestamp
from server.query import log_qa_dict

# file in charge of summarization of logfiles

router = APIRouter()


@router.post("", tags=["query"])
def qa(query: str, logId: str, top_n_lines: int = 1):
    """
    Direct endpoint to the question answering functionality. Returns an answer to the given question (query),
    returns the top_n_lines that were used by our algorithms to generate the answer as well.
    """
    top_n_lines = max(top_n_lines, 1)
    log_qa = log_qa_dict.get(logId)
    try:
        answer, ids = log_qa.generate_llm_answer(query, top_n_lines)
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Something went terribly wrong!")
    logs = []
    for i in ids:
        try:
            logs.append({"lineId": i, "content": log_qa.get_log_line_by_id(i)})
        except:
            pass
    result = {
        "answer": answer,
        "timestamp": generate_timestamp(),
        "logs": logs,
    }
    return result
