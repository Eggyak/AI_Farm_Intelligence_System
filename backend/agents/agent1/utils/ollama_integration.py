# utils/ollama_integration.py

import json
import requests
from typing import Dict, Any, Optional


class OllamaValidator:
    """
    Uses Ollama (local LLM) to perform intelligent validation on field data.

    Features:
    - Detect anomalies
    - Validate consistency
    - Provide structured feedback
    """

    def __init__(self, model: str = "llama3", base_url: str = "http://localhost:11434"):
        self.model = model
        self.base_url = base_url

    # -----------------------------------
    # INTERNAL: CALL OLLAMA API
    # -----------------------------------
    def _query_ollama(self, prompt: str) -> Optional[str]:
        """
        Sends prompt to Ollama and returns response text.
        """

        try:
            response = requests.post(
                f"{self.base_url}/api/generate",
                json={
                    "model": self.model,
                    "prompt": prompt,
                    "stream": False,
                },
                timeout=10,
            )

            if response.status_code == 200:
                return response.json().get("response", "")
            else:
                return None

        except Exception:
            return None

    # -----------------------------------
    # VALIDATE FIELD DATA
    # -----------------------------------
    def validate(self, record: Dict[str, Any]) -> Dict[str, Any]:
        """
        Validates a single standardized record using LLM.

        Returns:
            dict:
            {
                "is_valid": bool,
                "issues": [...],
                "suggestions": [...]
            }
        """

        prompt = f"""
You are an agricultural data validation assistant.

Analyze the following field data and detect:
- anomalies
- inconsistencies
- missing critical values

Return ONLY valid JSON in this format:
{{
  "is_valid": true/false,
  "issues": ["..."],
  "suggestions": ["..."]
}}

DATA:
{json.dumps(record, indent=2)}
"""

        response_text = self._query_ollama(prompt)

        if not response_text:
            return {
                "is_valid": True,
                "issues": ["LLM validation skipped"],
                "suggestions": [],
            }

        # محاولة parse JSON safely
        try:
            result = json.loads(response_text)
            return result

        except json.JSONDecodeError:
            return {
                "is_valid": True,
                "issues": ["Invalid LLM response format"],
                "suggestions": [],
            }