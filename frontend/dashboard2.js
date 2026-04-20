const ARCHIVE_STORAGE_KEY = "pipeline_archive";
const PIPELINE_RESULT_KEY = "pipeline_result";
const PIPELINE_INPUTS_KEY = "pipeline_inputs";

function setText(el, val) {
    if (el && val !== undefined && val !== null) el.textContent = String(val);
}

function setHTML(el, html) {
    if (el && html !== undefined && html !== null) el.innerHTML = String(html);
}

function getStoredResult() {
    try {
        const raw = localStorage.getItem(PIPELINE_RESULT_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function getStoredInputs() {
    try {
        const raw = localStorage.getItem(PIPELINE_INPUTS_KEY);
        return raw ? JSON.parse(raw) : null;
    } catch {
        return null;
    }
}

function getArchiveEntries() {
    try {
        const raw = localStorage.getItem(ARCHIVE_STORAGE_KEY);
        return raw ? JSON.parse(raw) : [];
    } catch {
        return [];
    }
}

function setArchiveEntries(entries) {
    localStorage.setItem(ARCHIVE_STORAGE_KEY, JSON.stringify(entries));
}

function showToast(message) {
    const toast = document.getElementById("appToast");
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("visible");
    clearTimeout(showToast.timer);
    showToast.timer = setTimeout(() => toast.classList.remove("visible"), 2600);
}

function openModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.remove("hidden");
}

function closeModal(id) {
    const modal = document.getElementById(id);
    if (modal) modal.classList.add("hidden");
}

function drawRiskChart() {
    const canvas = document.getElementById("riskChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const water = [1.2, 1.5, 2.1, 1.8, 2.4, 2.0, 1.7, 1.9, 2.3, 2.8, 2.1, 1.6];
    const heat = [0.8, 1.0, 0.7, 1.3, 1.8, 2.2, 1.9, 1.4, 1.1, 1.5, 1.8, 2.0];
    const maxV = 3.5;
    const pad = { l: 8, r: 8, t: 6, b: 4 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const sx = i => pad.l + (i / (water.length - 1)) * cW;
    const sy = v => pad.t + cH - (v / maxV) * cH;

    ctx.clearRect(0, 0, W, H);

    function drawLine(points, color, fill) {
        ctx.beginPath();
        ctx.moveTo(sx(0), sy(points[0]));
        points.forEach((v, i) => {
            if (i > 0) ctx.lineTo(sx(i), sy(v));
        });
        ctx.lineTo(sx(points.length - 1), H);
        ctx.lineTo(sx(0), H);
        ctx.closePath();
        ctx.fillStyle = fill;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(sx(0), sy(points[0]));
        points.forEach((v, i) => {
            if (i > 0) ctx.lineTo(sx(i), sy(v));
        });
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
    }

    drawLine(water, "#1565c0", "rgba(21,101,192,0.10)");
    drawLine(heat, "#e53935", "rgba(229,57,53,0.08)");
}

function drawPerfChart() {
    const canvas = document.getElementById("perfChart");
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;
    const perf = [68, 72, 74, 76, 80, 85];
    const maxV = 100;
    const minV = 60;
    const pad = { l: 6, r: 6, t: 6, b: 6 };
    const cW = W - pad.l - pad.r;
    const cH = H - pad.t - pad.b;
    const sx = i => pad.l + (i / (perf.length - 1)) * cW;
    const sy = v => pad.t + cH - ((v - minV) / (maxV - minV)) * cH;

    ctx.clearRect(0, 0, W, H);

    const g = ctx.createLinearGradient(0, 0, 0, H);
    g.addColorStop(0, "rgba(45,106,45,0.25)");
    g.addColorStop(1, "rgba(45,106,45,0)");

    ctx.beginPath();
    ctx.moveTo(sx(0), sy(perf[0]));
    perf.forEach((v, i) => {
        if (i > 0) ctx.lineTo(sx(i), sy(v));
    });
    ctx.lineTo(sx(perf.length - 1), H);
    ctx.lineTo(sx(0), H);
    ctx.closePath();
    ctx.fillStyle = g;
    ctx.fill();

    ctx.beginPath();
    ctx.moveTo(sx(0), sy(perf[0]));
    perf.forEach((v, i) => {
        if (i > 0) ctx.lineTo(sx(i), sy(v));
    });
    ctx.strokeStyle = "#2d6a2d";
    ctx.lineWidth = 2.5;
    ctx.stroke();

    perf.forEach((v, i) => {
        const isLast = i === perf.length - 1;
        ctx.beginPath();
        ctx.arc(sx(i), sy(v), isLast ? 5 : 3, 0, Math.PI * 2);
        ctx.fillStyle = "#2d6a2d";
        ctx.fill();
        if (isLast) {
            ctx.beginPath();
            ctx.arc(sx(i), sy(v), 5, 0, Math.PI * 2);
            ctx.strokeStyle = "#fff";
            ctx.lineWidth = 2;
            ctx.stroke();
        }
    });
}

function updateDashboard(serverResp, inputs) {
    const po = serverResp?.pipeline_output || {};
    const ao = po.agent_outputs || {};
    const a2wrap = ao.agent2 || {};
    const a2out = a2wrap.agent2_output || a2wrap;
    const a3 = ao.agent3 || {};
    const final = po.final_output || a3;

    const soil = inputs?.soil_moisture ?? null;
    const temp = inputs?.temperature ?? null;
    const hum = inputs?.humidity ?? null;

    const envVals = document.querySelectorAll(".env-value");
    if (envVals[0] && soil !== null) envVals[0].textContent = soil + "%";
    if (envVals[1] && temp !== null) envVals[1].textContent = temp + "°C";
    if (envVals[2] && hum !== null) envVals[2].textContent = hum + "%";

    const riskScore = Number(a2out.risk_score ?? 2);
    const successPct = Math.max(0, Math.min(100, Math.round(100 - riskScore * 10)));
    const riskLabel = a2out.status || (riskScore > 5 ? "HIGH" : riskScore > 2 ? "ALERT" : "MILD");
    const budget = final.budget || a3.budget || "—";
    const water = final.water || a3.water || "—";
    const strategy = final.strategy_used || a3.strategy_used || "Balanced";
    const priority = final.priority || a3.priority || "balanced";
    const reason = final.llm_reason || a3.llm_reason || "";
    const planActions = final.plan?.actions || a3.plan?.actions || [];
    const totalTime = po.total_time;

    setText(document.querySelector(".kpi-value.green"), successPct + "%");
    setText(document.querySelector(".kpi-value.blue"), riskScore > 5 ? "HIGH" : riskScore > 2 ? "MODERATE" : "MILD");
    setText(document.querySelector(".status-value"), riskScore > 5 ? "CAUTION" : "OPTIMAL");

    const actionNames = document.querySelectorAll(".action-name");
    if (planActions.length > 0) {
        const firstAction = planActions[0];
        const name = typeof firstAction === "object" ? (firstAction.name || firstAction.type || "Scouting") : String(firstAction);
        const notes = typeof firstAction === "object" ? (firstAction.notes || "") : "";
        if (actionNames[0]) actionNames[0].textContent = name.charAt(0).toUpperCase() + name.slice(1);
        if (notes) setHTML(document.getElementById("action-meta-0"), "NOTES &nbsp; <strong>" + notes + "</strong>");
    }

    if (reason) {
        const reasonEl = document.querySelector(".reasoning-bar span:last-child");
        if (reasonEl) setHTML(reasonEl, "<strong>Agent 3 Reasoning:</strong> " + reason);
    }

    const reportMeta = document.querySelector(".report-meta");
    if (reportMeta && totalTime && !reportMeta.innerHTML.includes("Pipeline:")) {
        reportMeta.innerHTML += " &bull; Pipeline: " + totalTime + "s";
    }

    const futureDesc = document.querySelector(".future-rec-desc");
    if (futureDesc) {
        futureDesc.textContent = "Priority: " + priority + " • Budget: ₹" + budget + " • Water: " + water + "L";
    }

    const futureTitle = document.querySelector(".future-rec-title");
    if (futureTitle) {
        futureTitle.textContent = strategy;
    }

    document.body.dataset.riskLabel = riskLabel;
}

function createArchiveEntry(result, inputs) {
    const pipelineOutput = result?.pipeline_output || {};
    const agent3 = pipelineOutput.final_output || pipelineOutput.agent_outputs?.agent3 || {};
    const now = new Date();

    return {
        id: "archive-" + now.getTime(),
        savedAt: now.toISOString(),
        title: strategyTitle(agent3),
        summary: archiveSummary(result, inputs),
        result,
        inputs
    };
}

function strategyTitle(agent3) {
    return agent3?.strategy_used || "Landscape Orchestration Report";
}

function archiveSummary(result, inputs) {
    const po = result?.pipeline_output || {};
    const a2 = po.agent_outputs?.agent2?.agent2_output || {};
    const risk = a2.risk_score ?? "—";
    const soil = inputs?.soil_moisture ?? "—";
    return "Risk " + risk + " • Soil " + soil + "%";
}

function saveCurrentReportToArchive() {
    const result = getStoredResult();
    const inputs = getStoredInputs();

    if (!result) {
        showToast("No report is available to archive yet.");
        return;
    }

    const entries = getArchiveEntries();
    const entry = createArchiveEntry(result, inputs);
    entries.unshift(entry);
    setArchiveEntries(entries.slice(0, 20));
    renderArchiveList();
    showToast("Current report saved to archive.");
}

function renderArchiveList() {
    const list = document.getElementById("archiveList");
    if (!list) return;

    const entries = getArchiveEntries();
    if (!entries.length) {
        list.innerHTML = '<div class="empty-state">No archived reports yet. Save the current report to build your history.</div>';
        return;
    }

    list.innerHTML = entries.map(entry => `
        <article class="archive-item">
          <div class="archive-item-main">
            <div class="archive-item-title">${entry.title}</div>
            <div class="archive-item-meta">${new Date(entry.savedAt).toLocaleString()}</div>
            <div class="archive-item-summary">${entry.summary}</div>
          </div>
          <div class="archive-item-actions">
            <button class="btn-outline archive-open-btn" data-archive-open="${entry.id}">Open</button>
            <button class="btn-outline archive-delete-btn" data-archive-delete="${entry.id}">Delete</button>
          </div>
        </article>
    `).join("");

    list.querySelectorAll("[data-archive-open]").forEach(btn => {
        btn.addEventListener("click", () => {
            const entry = entries.find(item => item.id === btn.dataset.archiveOpen);
            if (!entry) return;
            localStorage.setItem(PIPELINE_RESULT_KEY, JSON.stringify(entry.result));
            localStorage.setItem(PIPELINE_INPUTS_KEY, JSON.stringify(entry.inputs || {}));
            updateDashboard(entry.result, entry.inputs || {});
            closeModal("archiveModal");
            showToast("Archived report loaded.");
        });
    });

    list.querySelectorAll("[data-archive-delete]").forEach(btn => {
        btn.addEventListener("click", () => {
            const nextEntries = entries.filter(item => item.id !== btn.dataset.archiveDelete);
            setArchiveEntries(nextEntries);
            renderArchiveList();
            showToast("Archived report removed.");
        });
    });
}

function renderAgentSummary(result, inputs) {
    const grid = document.getElementById("agentSummaryGrid");
    if (!grid) return;

    const po = result?.pipeline_output || {};
    const ao = po.agent_outputs || {};
    const agent1Records = Array.isArray(ao.agent1) ? ao.agent1.length : 0;
    const agent2 = ao.agent2?.agent2_output || {};
    const agent3 = ao.agent3 || {};
    const riskCount = Array.isArray(agent2.risks) ? agent2.risks.length : 0;

    const cards = [
        {
            name: "Agent 1",
            role: "Data Collection",
            status: agent1Records ? "Synced" : "Idle",
            detail: "Captured " + agent1Records + " records" + (inputs?.soil_moisture !== undefined ? " • Soil " + inputs.soil_moisture + "%" : "")
        },
        {
            name: "Agent 2",
            role: "Analysis",
            status: agent2.status || "Ready",
            detail: "Risks detected: " + riskCount + (agent2.disease ? " • Disease: " + agent2.disease : "")
        },
        {
            name: "Agent 3",
            role: "Decision",
            status: agent3.status || "Optimized",
            detail: "Strategy: " + (agent3.strategy_used || "Balanced")
        },
        {
            name: "Agent 4",
            role: "Monitoring",
            status: "Live",
            detail: "Performance trend and live thresholds are active."
        },
        {
            name: "Agent 5",
            role: "Memory",
            status: "Learning",
            detail: "Historical recommendations are ready for reuse."
        }
    ];

    grid.innerHTML = cards.map(card => `
        <article class="agent-summary-card">
          <div class="agent-summary-top">
            <div>
              <div class="agent-summary-name">${card.name}</div>
              <div class="agent-summary-role">${card.role}</div>
            </div>
            <span class="agent-summary-status">${card.status}</span>
          </div>
          <p class="agent-summary-detail">${card.detail}</p>
        </article>
    `).join("");
}

function setupSectionNavigation() {
    const navItems = Array.from(document.querySelectorAll("[data-section]"));
    const sections = navItems
        .map(item => ({
            item,
            section: document.getElementById(item.dataset.section)
        }))
        .filter(entry => entry.section);

    navItems.forEach(item => {
        item.addEventListener("click", event => {
            event.preventDefault();
            const section = document.getElementById(item.dataset.section);
            if (!section) return;
            section.scrollIntoView({ behavior: "smooth", block: "start" });
            navItems.forEach(nav => nav.classList.remove("active"));
            item.classList.add("active");
        });
    });

    const observer = new IntersectionObserver(entries => {
        const visible = entries
            .filter(entry => entry.isIntersecting)
            .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (!visible) return;
        const active = sections.find(entry => entry.section === visible.target);
        if (!active) return;
        navItems.forEach(nav => nav.classList.remove("active"));
        active.item.classList.add("active");
    }, { threshold: [0.35, 0.55, 0.75] });

    sections.forEach(entry => observer.observe(entry.section));
}

function setupModals() {
    document.querySelectorAll("[data-close-modal]").forEach(button => {
        button.addEventListener("click", () => closeModal(button.dataset.closeModal));
    });

    document.addEventListener("keydown", event => {
        if (event.key === "Escape") {
            document.querySelectorAll(".modal-shell").forEach(modal => modal.classList.add("hidden"));
        }
    });
}

function setupActions() {
    const storedResult = getStoredResult();
    const storedInputs = getStoredInputs();

    document.getElementById("agentsTab")?.addEventListener("click", event => {
        event.preventDefault();
        renderAgentSummary(storedResult, storedInputs);
        openModal("agentsModal");
    });

    document.getElementById("archiveTab")?.addEventListener("click", event => {
        event.preventDefault();
        renderArchiveList();
        openModal("archiveModal");
    });

    document.getElementById("helpCenterLink")?.addEventListener("click", event => {
        event.preventDefault();
        openModal("helpModal");
    });

    document.getElementById("newAnalysisBtn")?.addEventListener("click", () => {
        window.location.href = "index.html";
    });

    document.getElementById("logoutLink")?.addEventListener("click", event => {
        event.preventDefault();
        localStorage.removeItem(PIPELINE_RESULT_KEY);
        localStorage.removeItem(PIPELINE_INPUTS_KEY);
        showToast("Local session cleared. Redirecting to dashboard...");
        setTimeout(() => {
            window.location.href = "index.html";
        }, 700);
    });

    document.getElementById("saveArchiveBtn")?.addEventListener("click", saveCurrentReportToArchive);

    document.getElementById("exportJsonBtn")?.addEventListener("click", () => {
        const result = getStoredResult();
        if (!result) {
            showToast("No report data available to export.");
            return;
        }
        const blob = new Blob([JSON.stringify(result, null, 2)], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "verdant-report.json";
        a.click();
        URL.revokeObjectURL(url);
        showToast("JSON export started.");
    });

    document.getElementById("exportPdfBtn")?.addEventListener("click", () => {
        window.print();
    });

    document.getElementById("applyBtn")?.addEventListener("click", () => {
        const btn = document.getElementById("applyBtn");
        btn.textContent = "✔ Applied";
        btn.style.background = "#1b5e20";
        btn.disabled = true;
        showToast("Future strategy applied.");
    });

    document.getElementById("dismissBtn")?.addEventListener("click", () => {
        document.querySelector(".future-card")?.remove();
        showToast("Future strategy dismissed.");
    });
}

(function initTicker() {
    const el = document.getElementById("lastUpdated");
    if (!el) return;
    let secs = 0;
    setInterval(() => {
        secs++;
        el.textContent = secs < 60 ? secs + "s ago" : Math.floor(secs / 60) + "m " + (secs % 60) + "s ago";
    }, 1000);
})();

drawRiskChart();
drawPerfChart();
setupSectionNavigation();
setupModals();
setupActions();

const storedResult = getStoredResult();
const storedInputs = getStoredInputs();

if (storedResult) {
    updateDashboard(storedResult, storedInputs);
}

renderArchiveList();
renderAgentSummary(storedResult, storedInputs);
