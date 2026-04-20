# ==========================================
# AGENT 3 (TRUE AGENTIC AI - FULL LLM CONTROL)
# ==========================================

import sys
import os
from datetime import datetime, timedelta

sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from planner.agent import (
    ConstraintOptimizationAgent,
    RiskSignal,
    WeatherWindow,
    FieldConstraints
)

from executor.agents.executor_agent import executor_agent
from monitoring.feedback_agent import monitoring_agent
from memory_agent import learn_from_run


# ==========================================
# 🧠 LLM DECISION ENGINE (CORE UPGRADE)
# ==========================================

def llm_decision_engine(agent2_output):

    try:
        import ollama

        response = ollama.chat(
            model="llama3",
            messages=[{
                "role": "user",
                "content": f"""
                You are an intelligent farm decision AI.

                Input Data:
                {agent2_output}

                Decide:
                1. Best strategy (optimize, low_cost, high_yield, risk_avoid)
                2. Budget (number)
                3. Water usage (number)
                4. Priority (cost / yield / risk / balanced)

                Return JSON only like:
                {{
                  "strategy": "...",
                  "budget": ...,
                  "water": ...,
                  "priority": "...",
                  "reason": "..."
                }}
                """
            }]
        )

        import json

        output = response["message"]["content"]

        # 🔥 Clean LLM output
        start = output.find("{")
        end = output.rfind("}") + 1
        parsed = json.loads(output[start:end])

        return parsed

    except Exception as e:
        print("LLM failed → fallback:", e)

        return {
            "strategy": "optimize",
            "budget": 10000,
            "water": 10000,
            "priority": "balanced",
            "reason": "fallback"
        }


# ==========================================
# CORE SYSTEM
# ==========================================

def run_system(agent2_output):

    print("\n🚀 AGENT 3 (TRUE AI) STARTED\n")

    agent_data = agent2_output.get("agent2_output", {})
    input_used = agent2_output.get("input_used", {})

    risk_score = agent_data.get("risk_score", 0)

    # =============================
    # RISKS
    # =============================

    risks = [
        RiskSignal(
            risk_type=r[0],
            severity=1.0 if r[1] == "HIGH" else 0.5,
            affected_field_id="field_1",
            confidence=0.9
        )
        for r in agent_data.get("risks", [])
    ]

    if not risks:
        risks = [RiskSignal("low_risk", 0.1, "field_1", 0.8)]

    # =============================
    # SENSOR DATA
    # =============================

    sensor_data = {
        "soil_moisture": input_used.get("soil_moisture", 50),
        "temperature": input_used.get("temperature", 30),
        "air_temp": input_used.get("temperature", 30),
        "humidity": input_used.get("humidity", 60),
        "nitrogen": 40,
        "phosphorus": 30,
        "potassium": 35,
        "soil_ph": 6.5
    }

    # =============================
    # 🧠 FULL LLM DECISION
    # =============================

    decision = llm_decision_engine(agent2_output)

    strategy = decision["strategy"]
    budget = decision["budget"]
    water = decision["water"]
    priority = decision["priority"]
    reason = decision["reason"]

    print("🧠 LLM Decision:", decision)

    # =============================
    # WEATHER + CONSTRAINTS
    # =============================

    weather_windows = [
        WeatherWindow(
            field_id="field_1",
            start_time=datetime.utcnow(),
            end_time=datetime.utcnow() + timedelta(hours=6),
            wind_speed_kmh=10,
            rain_probability=0.2,
            temperature_c=sensor_data["temperature"],
            is_spray_safe=True,
            is_irrigation_needed=True
        )
    ]

    constraints = FieldConstraints(
        field_id="field_1",
        total_budget_inr=budget,
        max_water_liters=water,
        crop_stage="vegetative",
        area_hectares=1.0
    )

    # =============================
    # PLANNER
    # =============================

    planner = ConstraintOptimizationAgent()
    plan = planner.run(risks, weather_windows, constraints)
    plan_dict = plan.to_dict()

    # =============================
    # EXECUTOR
    # =============================

    actions = [a["type"] for a in plan_dict["actions"]]
    execution_result = executor_agent(actions, sensor_data)

    # =============================
    # MONITORING
    # =============================

    feedback = monitoring_agent(
        data={
            "sensor_data": sensor_data,
            "weather": {"rain_forecast": 0.2}
        },
        risks=[r.risk_type for r in risks],
        plan=plan_dict,
        actions=execution_result
    )

    # =============================
    # 🧠 MEMORY LEARNING
    # =============================

    learning = learn_from_run({
        "strategy": strategy,
        "budget": budget,
        "water": water,
        "risk_score": risk_score,
        "plan": plan_dict,
        "actions": execution_result
    })

    # =============================
    # FINAL OUTPUT
    # =============================

    return {
        "agent": "DecisionAgent",
        "strategy_used": strategy,
        "priority": priority,
        "budget": budget,
        "water": water,
        "llm_reason": reason,
        "risk_score": risk_score,
        "plan": plan_dict,
        "actions_executed": execution_result,
        "monitoring_feedback": feedback,
        "learning": learning,
        "status": "OPTIMIZED"
    }


# ==========================================
# ENTRY
# ==========================================

def main(agent2_output):
    return run_system(agent2_output)