// ============================================================
//  dashboard1.js  —  FULL FIXED VERSION
//
//  Backend response shape (server.py wraps orchestrator output):
//  {
//    status: "success",
//    pipeline_output: {
//      status: "success",
//      total_time: N,
//      pipeline_log: { steps: [...] },
//      agent_outputs: {
//        agent1: [...records],
//        agent2: { agent2_output: { risks, risk_score, status, disease },
//                  input_used: {...} },
//        agent3: { agent, strategy_used, priority, budget, water,
//                  llm_reason, plan: { actions:[...], status, ... } }
//      },
//      final_output: <same as agent_outputs.agent3>
//    }
//  }
// ============================================================

const API_URL = "http://127.0.0.1:8000";

window.onload = function () {

    // ─── ELEMENT REFS ────────────────────────────────────────
    const runBtn          = document.getElementById("runPipelineBtn");
    const pipelineResult  = document.getElementById("pipelineResult");
    const pipelineStatus  = document.getElementById("pipelineStatus");
    const openChat        = document.getElementById("openChatbotBtn");
    const closeChat       = document.getElementById("chatbotClose");
    const chatPopup       = document.getElementById("chatbotPopup");
    const sendBtn         = document.getElementById("chatSend");
    const chatInput       = document.getElementById("chatInput");
    const chatBox         = document.getElementById("chatMessages");
    const soilSlider      = document.getElementById("soilSlider");
    const tempSlider      = document.getElementById("tempSlider");
    const humidSlider     = document.getElementById("humidSlider");
    const soilVal         = document.getElementById("soilVal");
    const tempVal         = document.getElementById("tempVal");
    const humidVal        = document.getElementById("humidVal");

    // ─── SLIDER FILL ─────────────────────────────────────────
    function fillSlider(slider) {
        const min = Number(slider.min) || 0;
        const max = Number(slider.max) || 100;
        const pct = ((Number(slider.value) - min) / (max - min)) * 100;
        slider.style.background =
            `linear-gradient(to right, var(--green-primary) 0%, var(--green-primary) ${pct}%, #ddd ${pct}%, #ddd 100%)`;
    }

    function syncSensor() {
        soilVal.textContent  = soilSlider.value  + "%";
        tempVal.textContent  = tempSlider.value  + "°C";
        humidVal.textContent = humidSlider.value + "%";
        fillSlider(soilSlider);
        fillSlider(tempSlider);
        fillSlider(humidSlider);
    }

    soilSlider.addEventListener("input",  syncSensor);
    tempSlider.addEventListener("input",  syncSensor);
    humidSlider.addEventListener("input", syncSensor);
    syncSensor(); // init on load

    // All other .green-slider elements (budget, water, alert, sensitivity, learning)
    document.querySelectorAll(".green-slider").forEach(s => {
        fillSlider(s);
        s.addEventListener("input", () => fillSlider(s));
    });

    // ─── STRATEGY BUTTONS ────────────────────────────────────
    document.querySelectorAll(".strategy-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            document.querySelectorAll(".strategy-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });

    // ─── CHATBOT (UNTOUCHED — working fine) ──────────────────
    openChat.addEventListener("click",  () => chatPopup.classList.remove("hidden"));
    closeChat.addEventListener("click", () => chatPopup.classList.add("hidden"));
    chatInput.addEventListener("keydown", e => { if (e.key === "Enter") sendBtn.click(); });

    sendBtn.addEventListener("click", async () => {
        const msg = chatInput.value.trim();
        if (!msg) return;
        appendChat("user", msg);
        chatInput.value = "";
        const tid = "typing-" + Date.now();
        chatBox.insertAdjacentHTML("beforeend",
            `<div class="chat-msg-row bot-row" id="${tid}">
                <div class="chat-avatar bot-av"></div>
                <div class="typing-bubble">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
             </div>`);
        chatBox.scrollTop = chatBox.scrollHeight;
        try {
            const res  = await fetch(API_URL + "/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ message: msg })
            });
            const data = await res.json();
            document.getElementById(tid)?.remove();
            appendChat("bot", data.reply || "No response");
        } catch {
            document.getElementById(tid)?.remove();
            appendChat("bot", "⚠️ Backend not reachable.");
        }
        chatBox.scrollTop = chatBox.scrollHeight;
    });

    function appendChat(role, text) {
        if (role === "user") {
            chatBox.insertAdjacentHTML("beforeend",
                `<div class="chat-msg-row user-row">
                    <div class="chat-bubble user-bubble">${text}</div>
                 </div>`);
        } else {
            chatBox.insertAdjacentHTML("beforeend",
                `<div class="chat-msg-row bot-row">
                    <div class="chat-avatar bot-av"></div>
                    <div class="chat-bubble bot-bubble">${text}</div>
                 </div>`);
        }
    }

    // ─── SPARKLINE CHART (Agent 4) ───────────────────────────
    (function drawSparkline() {
        const canvas = document.getElementById("monitorChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.width, H = canvas.height;
        const pts = [30,45,38,55,42,60,50,65,48,70,55,68];
        const mn = Math.min(...pts), mx = Math.max(...pts);
        const sy = v => H - 6 - ((v - mn) / (mx - mn)) * (H - 12);
        const sx = i => (i / (pts.length - 1)) * W;
        ctx.clearRect(0, 0, W, H);
        const g = ctx.createLinearGradient(0, 0, 0, H);
        g.addColorStop(0, "rgba(76,175,80,0.35)");
        g.addColorStop(1, "rgba(76,175,80,0)");
        ctx.beginPath();
        ctx.moveTo(sx(0), sy(pts[0]));
        pts.forEach((v, i) => { if (i > 0) ctx.lineTo(sx(i), sy(v)); });
        ctx.lineTo(sx(pts.length - 1), H); ctx.lineTo(0, H); ctx.closePath();
        ctx.fillStyle = g; ctx.fill();
        ctx.beginPath();
        ctx.moveTo(sx(0), sy(pts[0]));
        pts.forEach((v, i) => { if (i > 0) ctx.lineTo(sx(i), sy(v)); });
        ctx.strokeStyle = "#4caf50"; ctx.lineWidth = 2; ctx.stroke();
    })();

    // ─── HISTORICAL RISK CHART ───────────────────────────────
    (function drawHistChart() {
        const canvas = document.getElementById("histChart");
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const W = canvas.width, H = canvas.height;
        const predicted = [2.1,2.8,3.5,2.9,3.8,4.1,3.4,2.7,3.0,3.4];
        const actual    = [1.8,2.5,3.2,2.6,3.5,3.9,3.1,2.4,2.8,3.1];
        const labels    = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct"];
        const maxV = 5, pad = { l:30, r:10, t:10, b:22 };
        const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
        const sx = i => pad.l + i * (cW / (labels.length - 1));
        const sy = v => pad.t + cH - (v / maxV) * cH;
        ctx.clearRect(0, 0, W, H);
        ctx.strokeStyle = "#e8eee8"; ctx.lineWidth = 1;
        [1,2,3,4].forEach(g => {
            ctx.beginPath(); ctx.moveTo(pad.l, sy(g)); ctx.lineTo(W - pad.r, sy(g)); ctx.stroke();
        });
        function dl(pts, color) {
            ctx.beginPath(); ctx.moveTo(sx(0), sy(pts[0]));
            pts.forEach((v, i) => { if (i > 0) ctx.lineTo(sx(i), sy(v)); });
            ctx.strokeStyle = color; ctx.lineWidth = 2; ctx.stroke();
            pts.forEach((v, i) => {
                ctx.beginPath(); ctx.arc(sx(i), sy(v), 3, 0, Math.PI * 2);
                ctx.fillStyle = color; ctx.fill();
            });
        }
        dl(predicted, "#90caf9"); dl(actual, "#26a69a");
        ctx.fillStyle = "#aaa"; ctx.font = "9px 'IBM Plex Mono',monospace"; ctx.textAlign = "center";
        labels.forEach((l, i) => ctx.fillText(l, sx(i), H - 5));
    })();

    // ─── PIPELINE STEP HELPERS ────────────────────────────────
    const steps = [1,2,3,4,5].map(n => document.getElementById("step" + n));

    function resetSteps() {
        steps.forEach(s => s.classList.remove("active", "done"));
    }
    function activateStep(idx) {
        steps.forEach((s, i) => {
            s.classList.remove("active", "done");
            if (i < idx)  s.classList.add("done");
            if (i === idx) s.classList.add("active");
        });
    }
    function completeAllSteps() {
        steps.forEach(s => { s.classList.remove("active"); s.classList.add("done"); });
    }
    function setStatus(html, success = false) {
        pipelineStatus.innerHTML  = html;
        pipelineStatus.className = "pipeline-status-text" + (success ? " success" : "");
    }

    // ─── POPULATE RESULT PANEL ───────────────────────────────
    // Uses EXACT keys returned by orchestrator.py
    function showResult(serverResp, sentPayload) {
        const po     = serverResp.pipeline_output || {};   // server.py wraps here
        const ao     = po.agent_outputs           || {};   // agent1, agent2, agent3

        // agent2 structure: { agent2_output: { risks, risk_score, status, disease }, input_used }
        const a2wrap = ao.agent2 || {};
        const a2out  = a2wrap.agent2_output || a2wrap;

        // agent3 / final_output structure:
        // { agent, strategy_used, priority, budget, water, llm_reason,
        //   plan: { actions:[{type,cost_inr,water_liters,start,end,notes},...], status, ... } }
        const a3      = ao.agent3     || {};
        const final   = po.final_output || a3;

        // ── Soil Moisture ─────────────────────────────────────
        document.getElementById("res-soil").textContent =
            (sentPayload.agent1.soil_moisture ?? soilSlider.value) + "%";

        // ── Risk Score ────────────────────────────────────────
        const riskScore = a2out.risk_score ?? final.risk_score ?? "—";
        const riskStatus = a2out.status    || "";
        const el_risk    = document.getElementById("res-risk");
        if (el_risk) el_risk.textContent =
            "Score " + riskScore + (riskStatus ? " · " + riskStatus : "");

        // ── Recommended Action ────────────────────────────────
        const actions = final.plan?.actions || a3.plan?.actions || [];
        let actionText = "No plan returned";
        if (actions.length > 0) {
            const a0 = actions[0];
            if (typeof a0 === "object" && a0 !== null) {
                // type is e.g. "scouting", notes has details
                const name  = a0.name  || a0.type  || "Action";
                const notes = a0.notes || "";
                actionText = name.charAt(0).toUpperCase() + name.slice(1);
                if (notes) actionText += " — " + notes;
            } else {
                actionText = String(a0);
            }
        }
        const el_action = document.getElementById("res-action");
        if (el_action) el_action.textContent = actionText;

        // ── Memory / Budget from agent3 ───────────────────────
        const budget = final.budget || a3.budget || "—";
        const water  = final.water  || a3.water  || "—";
        const strat  = final.strategy_used || a3.strategy_used || "";
        const el_mem = document.getElementById("res-memory");
        if (el_mem) el_mem.textContent =
            "Budget ₹" + budget + " · Water " + water + "L" +
            (strat ? " · " + strat : "");

        pipelineResult.classList.add("visible");
    }

    // ─── RUN PIPELINE ─────────────────────────────────────────
    runBtn.addEventListener("click", async () => {

        // Already succeeded — act as navigate button
        if (runBtn.dataset.done === "1") {
            window.location.href = "dashboard2.html";
            return;
        }

        const sentPayload = {
            query: "farm analysis",
            agent1: {
                soil_moisture: Number(soilSlider.value),
                temperature:   Number(tempSlider.value),
                humidity:      Number(humidSlider.value)
            },
            agent2: {
                mode: document.getElementById("agent1-crop-select")?.value || "Rice"
            },
            agent3: {
                strategy: document.querySelector(".strategy-btn.active")
                              ?.textContent?.trim() || "Optimize Resources"
            }
        };

        // UI: start state
        runBtn.textContent = "Running…";
        runBtn.disabled    = true;
        runBtn.classList.add("running");
        runBtn.dataset.done = "0";
        pipelineResult.classList.remove("visible");
        resetSteps();

        const STEP_LABELS = [
            "Agent 1: Collecting sensor data…",
            "Agent 2: Running risk analysis…",
            "Agent 3: Generating decision plan…",
            "Agent 4: Monitoring sync…",
            "Agent 5: Memory calibration…"
        ];

        // The backend typically takes 100-180s (Ollama LLM calls).
        // We pace the 5-step animation over 80% of that time, so
        // steps don't rush ahead. Adjust STEP_INTERVAL_MS if your
        // machine is faster/slower.
        const STEP_INTERVAL_MS = 22000; // 22s per step → ~110s for 5 steps

        let stepIdx = 0;
        activateStep(0);
        setStatus(`<span class="pipeline-spinner"></span> ${STEP_LABELS[0]}`);

        const stepTimer = setInterval(() => {
            stepIdx++;
            if (stepIdx < steps.length) {
                activateStep(stepIdx);
                setStatus(`<span class="pipeline-spinner"></span> ${STEP_LABELS[stepIdx]}`);
            } else {
                clearInterval(stepTimer);
                setStatus(`<span class="pipeline-spinner"></span> Finalising output…`);
            }
        }, STEP_INTERVAL_MS);

        try {
            const res  = await fetch(API_URL + "/run-agent", {
                method:  "POST",
                headers: { "Content-Type": "application/json" },
                body:    JSON.stringify(sentPayload)
            });
            const data = await res.json();
            clearInterval(stepTimer);

            if (data.status === "success") {
                completeAllSteps();
                setStatus("✔ Pipeline complete — all 5 agents synced", true);

                // Save everything to localStorage so dashboard2 can read it
                localStorage.setItem("pipeline_result", JSON.stringify(data));
                localStorage.setItem("pipeline_inputs", JSON.stringify(sentPayload.agent1));

                // Show inline result panel
                showResult(data, sentPayload);

                runBtn.textContent  = "✔ View Report →";
                runBtn.disabled     = false;
                runBtn.dataset.done = "1";
                runBtn.classList.remove("running");
                runBtn.classList.add("success-btn");

            } else {
                resetSteps();
                setStatus("⚠ Error: " + (data.message || data.error || "Unknown error"));
                runBtn.textContent = "🚀 Run AI Pipeline";
                runBtn.disabled    = false;
                runBtn.classList.remove("running");
            }

        } catch (err) {
            clearInterval(stepTimer);
            resetSteps();
            setStatus("⚠ Cannot reach backend — is the server running on port 8000?");
            runBtn.textContent = "🚀 Run AI Pipeline";
            runBtn.disabled    = false;
            runBtn.classList.remove("running");
        }
    });
};
