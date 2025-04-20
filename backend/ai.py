import together
from dotenv import load_dotenv
from typing import Literal
load_dotenv()
client = together.Together()

messages = [
    {
        "role": "system",
        "content": "you are a log analysing bot, thats crazy good at its work. your goal is to summarise very very descriptively, going the depths of everything the events of the logfile and also point out what part of the log file corresponds to what part in the summary, in the parts array. Make both the summary and tooltips as descriptive as possible. Explain individual  errors in the tooltips and the big picture in the summary, no need to mention line numbers in summary, just in the parts array. The indices are character indices not line indices.",
    },]
#     {
#         "role": "user",
#         "content": "2025-04-20 10:15:30 INFO Starting application\n2025-04-20 10:15:31 INFO Database connection established\n2025-04-20 10:16:45 WARNING High memory usage detected\n2025-04-20 10:17:12 ERROR NullPointerException in UserService.java:125\n2025-04-20 10:17:13 ERROR Failed to process user request\n2025-04-20 10:18:01 INFO Request processed successfully\n2025-04-20 10:19:30 WARNING Slow database query detected\n2025-04-20 10:20:15 CRITICAL System overload detected\n2025-04-20 10:20:16 ERROR DatabaseConnectionException: Connection timeout\n2025-04-20 10:20:17 ERROR Failed to process payment\n2025-04-20 10:21:00 INFO System recovered\n2025-04-20 10:22:30 DEBUG Cleaning up resources\n2025-04-20 11:15:30 INFO Normal operation resumed\n2025-04-20 11:16:45 ERROR FileNotFoundException: Config file missing\n2025-04-20 11:17:12 WARNING Configuration using defaults\n2025-04-20 11:18:01 ERROR OutOfMemoryError in ProcessingService.java:89\n2025-04-20 11:19:30 CRITICAL Memory allocation failed\n2025-04-20 11:20:15 ERROR System shutdown initiated\n2025-04-20 11:20:16 INFO Emergency protocols activated\n2025-04-20 11:21:00 INFO System restart initiated\n",
#     },
#     {
#         "role": "assistant",
#         "content": '{\n  "summary": "The application started normally, established a database connection, and began processing requests. However, it encountered a series of issues including high memory usage, NullPointerException, slow database queries, system overload, and connection timeouts, leading to critical system failures and eventual shutdown. The system attempted to recover, but ultimately faced further errors including FileNotFoundException and OutOfMemoryError, culminating in a system restart.",\n  "parts": [\n    {\n      "summary_start_index": 0,\n      "summary_end_index": 50,\n      "log_start_index": 0,\n      "log_end_index": 44,\n      "tooltip": "The application started normally and established a database connection (INFO Starting application, INFO Database connection established)"\n    },\n    {\n      "summary_start_index": 50,\n      "summary_end_index": 150,\n      "log_start_index": 45,\n      "log_end_index": 244,\n      "tooltip": "The system experienced high memory usage (WARNING High memory usage detected), followed by a NullPointerException in UserService.java:125 (ERROR NullPointerException in UserService.java:125), and subsequently failed to process a user request (ERROR Failed to process user request)"\n    },\n    {\n      "summary_start_index": 150,\n      "summary_end_index": 200,\n      "log_start_index": 245,\n      "log_end_index": 344,\n      "tooltip": "Despite the previous errors, the system managed to process a request successfully (INFO Request processed successfully), but soon detected a slow database query (WARNING Slow database query detected)"\n    },\n    {\n      "summary_start_index": 200,\n      "summary_end_index": 300,\n      "log_start_index": 345,\n      "log_end_index": 544,\n      "tooltip": "The system faced a critical overload (CRITICAL System overload detected), resulting in a DatabaseConnectionException: Connection timeout (ERROR DatabaseConnectionException: Connection timeout) and failure to process a payment (ERROR Failed to process payment)"\n    },\n    {\n      "summary_start_index": 300,\n      "summary_end_index": 350,\n      "log_start_index": 545,\n      "log_end_index": 644,\n      "tooltip": "The system recovered (INFO System recovered), cleaned up resources (DEBUG Cleaning up resources), and resumed normal operation (INFO Normal operation resumed)"\n    },\n    {\n      "summary_start_index": 350,\n      "summary_end_index": 450,\n      "log_start_index": 645,\n      "log_end_index": 844,\n      "tooltip": "However, it encountered a FileNotFoundException due to a missing config file (ERROR FileNotFoundException: Config file missing), and subsequently used default configurations (WARNING Configuration using defaults)"\n    },\n    {\n      "summary_start_index": 450,\n      "summary_end_index": 550,\n      "log_start_index": 845,\n      "log_end_index": 1044,\n      "tooltip": "The system faced another critical failure with an OutOfMemoryError in ProcessingService.java:89 (ERROR OutOfMemoryError in ProcessingService.java:89), leading to a critical memory allocation failure (CRITICAL Memory allocation failed) and eventual system shutdown (ERROR System shutdown initiated)"\n    },\n    {\n      "summary_start_index": 550,\n      "summary_end_index": 600,\n      "log_start_index": 1045,\n      "log_end_index": 1244,\n      "tooltip": "Emergency protocols were activated (INFO Emergency protocols activated), and a system restart was initiated (INFO System restart initiated)"\n    }\n  ]\n}',
#     },
#     {"role": "user", "content": ""},
# ]

from typing import Union

def reply(msg: str, type: Union[Literal["user_message"], Literal["file_text"]]) -> str:
    messages.append({"role": "user", "content": msg, "type": type})
    response = client.chat.completions.create(
    model="meta-llama/Llama-4-Maverick-17B-128E-Instruct-FP8",
    messages=messages,
    response_format={
        "type": "json_object",
        "schema": {
            "type": "object",
            "properties": {
                "summary": {
                    "type": "string",
                    "required": ["summary"],
                    "additionalProperties": False,
                },
                "parts": {
                    "type": "array",
                    "items": {
                        "type": "object",
                        "properties": {
                            "summary_start_index": {"type": "number"},
                            "summary_end_index": {"type": "number"},
                            "log_start_index": {"type": "number"},
                            "log_end_index": {"type": "number"},
                            "tooltip": {"type": "string"},
                            "type_of_error": {"type": "string"},
                            "start_time": {"type": "string"},
                            "end_time": {"type": "string"},
                        },
                        "required": [
                            "summary_start_index",
                            "summary_end_index",
                            "log_start_index",
                            "log_end_index",
                            "tooltip",
                        ],
                        "additionalProperties": False,
                    },
                    "required": ["parts"],
                    "additionalProperties": False,
                },
            },
            "required": ["summary", "parts"],
            "additionalProperties": False,
        },
    },
)
    return response.choices[0].message.content
