from ai import reply
import json

def generate_summary_parts(log_text: str) -> dict:
    try:
        response_json = reply(log_text, "file_text")
        return json.loads(response_json)
    except Exception:
        return {
            "summary": "Could not generate summary due to an internal error.",
            "parts": [],
        }
