from fastapi import HTTPException
from starlette import status
from .dummy import log_db


class DBHelper:
    """
        class in charge of helping with the interaction to the log database
    """
    def __init__(self):
        pass

    def get_log_list(self, organization):
        if organization not in log_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The organization you are trying to access was not found.",
            )
        logs = log_db.get(organization)
        log_infos_list = [log_infos for _, log_infos in logs.items()]
        return log_infos_list

    def get_log(self, organization, log_uuid):
        if organization not in log_db:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The organization you are trying to access was not found.",
            )
        logs = log_db.get(organization)
        if log_uuid not in logs:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail="The logfiles you are trying to access were not found.",
            )
        log = logs.get(log_uuid)
        return log
