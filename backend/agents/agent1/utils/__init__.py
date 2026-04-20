# utils/__init__.py
"""
Utils Package

Provides helper utilities used across the ingestion pipeline.

Modules:
- logger               : Centralized logging configuration
- ollama_integration   : Optional LLM-based validation using Ollama

Purpose:
- Keep reusable logic separate from core pipeline
- Ensure consistent logging and optional intelligence integration
"""

from .logger import get_logger
from .ollama_integration import OllamaValidator

__all__ = [
    "get_logger",
    "OllamaValidator",
]