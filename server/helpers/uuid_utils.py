import uuid


def is_valid_uuid(uuid_str):
    try:
        # Try to create a UUID object from the input string
        uuid_obj = uuid.UUID(uuid_str)
    except ValueError:
        # If ValueError is raised, the input is not a valid UUID
        return False

    # Check if the UUID is a valid UUID (version 1, 3, 4, or 5)
    return str(uuid_obj) == uuid_str