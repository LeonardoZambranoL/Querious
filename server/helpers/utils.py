import time
from datetime import datetime


def generate_timestamp():
    # Generate timestamp in unix format
    current_timestamp = time.time()
    current_timestamp_long = int(current_timestamp)
    return current_timestamp_long


def timestamp_to_custom_format(timestamp):
    # Convert unix timestamp to format used in the log files
    timestamp /= 1000
    dt_object = datetime.fromtimestamp(timestamp)

    # Formatting the date and time in the desired format
    formatted_date_time = dt_object.strftime("%b %d %H:%M:%S")

    return formatted_date_time