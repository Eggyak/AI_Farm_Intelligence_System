# ==========================================
# AGENT 4 (INTELLIGENT MONITORING + LLM CORE)
# ==========================================

import ollama

# GLOBAL MEMORY
history = []
performance_log = []

# ==========================================
# 🧠 LLM MONITORING CORE
# ==========================================

def llm_monitoring_analysis(data, risks, plan, actions, context):

    try:
        response = ollama.chat(
            model="llama3",
            messages=[{
                "role": "user",
                "content": f"""
                You are an intelligent farm monitoring AI.

                SENSOR DATA:
                {data}

                RISKS:
                {risks}

                PLAN:
                {plan}

                ACTIONS:
                {actions}

                CONTEXT:
                {context}

                Provide:
                - system status (normal / alert)
                - key problems
                - suggestions
                - improvements
                - risk insights

                Keep it short and practical.
                """
            }]
        )

        return response["message"]["content"]

    except:
        return None


# ==========================================
# CORE MONITORING AGENT
# ==========================================

def monitoring_agent(data, risks, plan, actions):

    global history, performance_log

    # =============================
    # INPUT EXTRACTION
    # =============================

    soil = data["sensor_data"]["soil_moisture"]
    temp = data["sensor_data"]["temperature"]
    rain = data["weather"]["rain_forecast"]

    status = "normal"
    feedback = []
    updated_plan = plan.copy()
    escalation = False

    # =============================
    # 1️⃣ BASIC DETECTION (fallback)
    # =============================

    if "water_stress" in risks:
        feedback.append("Low soil moisture detected")
        status = "alert"

    if "heat_stress" in risks:
        feedback.append("High temperature detected")
        status = "alert"

    if not feedback:
        feedback.append("Conditions are within optimal range")

    # =============================
    # 2️⃣ TREND ANALYSIS
    # =============================

    trend = "no_data"

    if len(history) > 0:
        last = history[-1]

        if soil > last["soil"]:
            trend = "improving"
        elif soil < last["soil"]:
            trend = "worsening"
        else:
            trend = "stable"

    # =============================
    # 3️⃣ PERFORMANCE LOGIC
    # =============================

    if trend == "improving":
        performance = "success"

    elif trend == "worsening":

        if rain:
            performance = "environmental"
            feedback.append("Rain affecting soil moisture")

        elif temp > 38:
            performance = "environmental"
            feedback.append("Heat impacting soil moisture")

        else:
            performance = "failure"

    else:
        performance = "stable"

    performance_log.append(performance)

    # =============================
    # 4️⃣ SMART PLAN UPDATE
    # =============================

    if performance == "failure":
        updated_plan.append("Increase irrigation duration")
        feedback.append("Plan ineffective → increasing irrigation")

    elif performance == "environmental":
        updated_plan.append("Adjust irrigation timing")
        feedback.append("Adjusting for environmental impact")

    elif performance == "success":
        feedback.append("Plan working well")

    # =============================
    # 5️⃣ ESCALATION LOGIC
    # =============================

    recent_failures = [p for p in performance_log[-3:] if p == "failure"]

    if len(recent_failures) >= 2:
        escalation = True
        feedback.append("Escalate to expert")

    # =============================
    # 🧠 6️⃣ LLM INTELLIGENCE (MAIN)
    # =============================

    context = {
        "trend": trend,
        "performance": performance,
        "history_length": len(history)
    }

    llm_insight = llm_monitoring_analysis(
        data=data,
        risks=risks,
        plan=plan,
        actions=actions,
        context=context
    )

    # =============================
    # 7️⃣ MEMORY UPDATE
    # =============================

    history.append({
        "soil": soil,
        "temperature": temp,
        "trend": trend,
        "performance": performance
    })

    # =============================
    # 8️⃣ FINAL RESPONSE
    # =============================

    return {
        "status": status,
        "feedback": feedback,
        "trend": trend,
        "performance": performance,
        "updated_plan": updated_plan,
        "escalation": escalation,
        "llm_insight": llm_insight or "No AI insight available"
    }