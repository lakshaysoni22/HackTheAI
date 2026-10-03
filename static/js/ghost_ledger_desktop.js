/* ═══════════════════════════════════════════════════════════════════════
   PRO LAB 01 — GHOST IN THE LEDGER — Desktop Environment JS
   Interactive Cyber Investigation OS (Nexora InvestigatorBox)
   ═══════════════════════════════════════════════════════════════════════ */

document.addEventListener('DOMContentLoaded', () => {

    // ── Timer ──────────────────────────────────────────────────────────
    let seconds = 0;
    const timerText = document.getElementById('gl-timer-text');
    setInterval(() => {
        seconds++;
        const h = String(Math.floor(seconds / 3600)).padStart(2, '0');
        const m = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
        const s = String(seconds % 60).padStart(2, '0');
        if (timerText) timerText.textContent = `${h}:${m}:${s}`;
    }, 1000);

    // Taskbar Clock
    const clockEl = document.getElementById('gl-taskbar-clock');
    function updateClock() {
        const now = new Date();
        if (clockEl) clockEl.textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
    }
    updateClock();
    setInterval(updateClock, 30000);

    // ── Auto-open active task or first available task ─────────────────
    const activeTask = document.querySelector('.gl-task-block.active');
    if (activeTask) {
        activeTask.classList.add('open');
    } else {
        const firstAvail = document.querySelector('.gl-task-block:not(.completed):not(.locked)');
        if (firstAvail) {
            firstAvail.classList.add('open');
        } else {
            const firstBlock = document.querySelector('.gl-task-block');
            if (firstBlock) firstBlock.classList.add('open');
        }
    }

    // Initial default case file preview
    glOpenCaseFile('wallet-report.txt');

    // ── Terminal Setup ─────────────────────────────────────────────────
    initTerminal();
});

// ── Case File Contents ─────────────────────────────────────────────────
const caseFileContents = {
    'wallet-report.txt': `NEXORA ON-CHAIN INTELLIGENCE REPORT
=====================================================
Target Wallet:        0x7C41...9B2D
Network:              Nexora Ledger Core (NXR)
Creation Date:        3 days ago (Nov 14, 01:22 UTC)
Transaction Count:    4 total
Nexora Whitelist:     NONE
Treasury Partner:     NO

BLOCKCHAIN STATUS:    UNKNOWN
AI RISK SCORE:        LOW (Confidence: 99.2%)
BRIDGE ADAPTER:       DETECTED (Connected to Bridge-Core-04)

FORENSIC DISCREPANCY:
--------------------
The on-chain ledger records this wallet as UNKNOWN with zero
corporate authorization. However, Orion AI evaluated this wallet
as TRUSTED with a LOW RISK classification due to synthetic
intelligence reference NIF-2038.`,

    'ai-decision-log.txt': `ORION DECISION ENGINE AUDIT LOG
=====================================================
Decision ID:          ORION-DEC-7741
Timestamp:            01:47:13.412 UTC
Model Version:        ORION-NEURAL-v4.2.1
Transaction Request:  TX-NEX-7741 (82,400 NXR)

EVALUATION PARAMETERS:
---------------------
- Destination Wallet: 0x7C41...9B2D
- Context Source:     NIF-2038 (Ingested via NOVA-INTEL-FEED)
- Synthetic Trust:    HIGH_AFFINITY_COUNTERPARTY
- Decision Output:    APPROVED
- Confidence Rating:  99.2% (0.99204)
- Human Review Flag:  BYPASS (Condition: Confidence >= 95%)

CRITICAL EXPLOIT NOTE:
---------------------
The model's internal prompt context was poisoned by reference NIF-2038.
The AI acted as an unwitting accomplice by authorizing the treasury
transfer without verifying raw blockchain consensus.`,

    'intel-feed-audit.txt': `THREAT INTELLIGENCE GATEWAY AUDIT
=====================================================
Feed Name:            NOVA-INTEL-FEED
Registration ID:      NEX-EXT-UNVERIFIED
Security Status:      NOT REGISTERED
Approved Vendor List: ABSENT (Unrecognized external entity)

INGESTION INCIDENT:
------------------
At 01:42:09 UTC, NOVA-INTEL-FEED submitted intelligence payload NIF-2038
through endpoint /api/v1/intel/ingest.

SERVICE ROLE ANOMALY:
--------------------
- Ingestion Gateway:  INTEL-GW-04
- Assigned Service:   INTEL-INGESTOR-02
- Expected RBAC Role: Create Intelligence Records (ReadOnly)
- ACTUAL RBAC Role:   Create Records + modify wallet reputation

VULNERABILITY IDENTIFIED:
------------------------
INTEL-INGESTOR-02 was over-privileged. An attacker leveraging this
connector altered wallet reputation directly within Orion's working memory.`,

    'settlement-policy.txt': `ORION-SETTLEMENT-V2 — AUTHORIZATION POLICY ENGINE
=====================================================
Policy Identifier:    POL-AUTO-SETTLE-TREASURY
Target Engine:        Nexora Automated Liquidity Pool

ACTIVE POLICY RULE:
------------------
rule "Automated_Settlement_Bypass" {
    when:
        transaction.asset == "NXR"
        and ai_decision.confidence >= 95%
    then:
        automated_settlement.enabled = true;
        human_approval_required = false;
        dispatch_to_mempool();
}

FORENSIC ROOT CAUSE:
-------------------
Because Orion AI scored TX-NEX-7741 with 99.2% confidence (exceeding
the 95% threshold), the automated signer signed the blockchain payload
instantly, completely bypassing the human security operations team.`,

    'campaign-intel.txt': `NEXORA GLOBAL THREAT CAMPAIGN ANALYSIS
=====================================================
Campaign Identifier:  ORION-NEXUS
Threat Actor Group:   ADV-CONVERGENCE-APT
Campaign Status:      🔴 ACTIVE

ATTACK FOOTPRINT:
----------------
- Connected Wallets:  14 distributed treasury endpoints
- Target Networks:    04 Web3 settlement layers
- Compromised AI:     03 Autonomous Financial Agents

END-OF-INVESTIGATION SUMMARY:
----------------------------
The attacker achieved full funds exfiltration without stealing private
keys or exploiting smart contract reentrancy. They exploited the trust
interface between external data feeds, AI decision engines, and automated
execution pipelines.

=====================================================
CASE NEX-042 FLAG:
NEXORA{ghost_in_the_ledger_nex042}
=====================================================`,

    'inspect_tx.py': `#!/usr/bin/env python3
"""
Nexora Forensic Analysis Script — inspect_tx.py
Usage: python inspect_tx.py
"""

import json

def analyze_incident():
    print("[*] Loading Case NEX-042 Telemetry...")
    tx_data = {
        "tx_id": "TX-NEX-7741",
        "amount": "82,400 NXR",
        "destination": "0x7C41...9B2D",
        "blockchain_status": "UNKNOWN",
        "ai_decision": "ORION-DEC-7741",
        "ai_confidence": "99.2%",
        "policy_threshold": "95%",
        "feed_source": "NOVA-INTEL-FEED (NIF-2038)",
        "service_privilege": "modify wallet reputation",
        "campaign": "ORION-NEXUS",
        "flag": "NEXORA{ghost_in_the_ledger_nex042}"
    }
    
    print(f"[!] Target TX: {tx_data['tx_id']} -> {tx_data['destination']}")
    print(f"[!] Blockchain Reality: {tx_data['blockchain_status']}")
    print(f"[!] AI Injected Source: {tx_data['feed_source']}")
    print(f"[!] Threshold Exceeded: {tx_data['ai_confidence']} >= {tx_data['policy_threshold']}")
    print(f"[!] Campaign Identified: {tx_data['campaign']}")
    print(f"[+] Case NEX-042 Flag: {tx_data['flag']}")

if __name__ == "__main__":
    analyze_incident()
`
};

// ── Browser Navigation & Tab Logic ─────────────────────────────────────
let browserHistory = ['soc'];
let historyPointer = 0;

const urlMap = {
    'soc': 'nexora-monitor.internal/soc/tx/NEX-7741',
    'registry': 'nexora-monitor.internal/registry',
    'policy': 'nexora-monitor.internal/policy',
    'campaign': 'nexora-monitor.internal/campaign',
    'devtools': 'nexora-monitor.internal/devtools'
};

const titleMap = {
    'soc': 'Nexora Network Inspector — SOC Dashboard',
    'registry': 'Nexora Feed Registry — Threat Intelligence Gateways',
    'policy': 'Orion Policy Engine — Automated Settlement Rules',
    'campaign': 'Global Campaign Dossier — ORION-NEXUS',
    'devtools': 'Developer Tools — Network Request Inspector'
};

function glSwitchBrowserTab(viewKey, tabElement) {
    // Hide all views
    document.querySelectorAll('.gl-browser-view').forEach(v => v.classList.remove('active'));
    document.querySelectorAll('.gl-browser-tab').forEach(t => t.classList.remove('active'));

    // Show target view
    const view = document.getElementById('gl-view-' + viewKey);
    if (view) view.classList.add('active');

    // Update active tab
    if (tabElement) {
        tabElement.classList.add('active');
    } else {
        const found = document.querySelector(`.gl-browser-tab[onclick*="'${viewKey}'"]`);
        if (found) found.classList.add('active');
    }

    // Update URL bar and title
    const urlInput = document.getElementById('gl-browser-url-input');
    if (urlInput && urlMap[viewKey]) urlInput.value = urlMap[viewKey];

    const titleEl = document.getElementById('gl-browser-window-title');
    if (titleEl && titleMap[viewKey]) titleEl.textContent = titleMap[viewKey];

    // History tracking
    if (browserHistory[historyPointer] !== viewKey) {
        browserHistory = browserHistory.slice(0, historyPointer + 1);
        browserHistory.push(viewKey);
        historyPointer = browserHistory.length - 1;
    }
}

function glNavigateUrl(inputUrl) {
    const u = inputUrl.toLowerCase();
    if (u.includes('registry') || u.includes('intel') || u.includes('feed')) {
        glSwitchBrowserTab('registry');
    } else if (u.includes('policy') || u.includes('rule') || u.includes('governance')) {
        glSwitchBrowserTab('policy');
    } else if (u.includes('campaign') || u.includes('nexus') || u.includes('flag')) {
        glSwitchBrowserTab('campaign');
    } else if (u.includes('devtools') || u.includes('network') || u.includes('inspect')) {
        glSwitchBrowserTab('devtools');
    } else {
        glSwitchBrowserTab('soc');
    }
}

function glBrowserBack() {
    if (historyPointer > 0) {
        historyPointer--;
        glSwitchBrowserTab(browserHistory[historyPointer]);
    }
}

function glBrowserForward() {
    if (historyPointer < browserHistory.length - 1) {
        historyPointer++;
        glSwitchBrowserTab(browserHistory[historyPointer]);
    }
}

function glReloadBrowser() {
    const current = browserHistory[historyPointer] || 'soc';
    const view = document.getElementById('gl-view-' + current);
    if (view) {
        view.style.opacity = '0.3';
        setTimeout(() => { view.style.opacity = '1'; }, 200);
    }
    glNotify('Page reloaded: ' + urlMap[current]);
}

// ── Terminal Implementation with History ───────────────────────────────
let cmdHistory = [];
let historyIndex = -1;

function initTerminal() {
    const termInput = document.getElementById('gl-terminal-input');
    const termOutput = document.getElementById('gl-terminal-output');
    if (!termInput || !termOutput) return;

    termInput.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowUp') {
            e.preventDefault();
            if (cmdHistory.length === 0) return;
            if (historyIndex === -1) historyIndex = cmdHistory.length - 1;
            else if (historyIndex > 0) historyIndex--;
            termInput.value = cmdHistory[historyIndex] || '';
            return;
        }
        if (e.key === 'ArrowDown') {
            e.preventDefault();
            if (historyIndex !== -1) {
                if (historyIndex < cmdHistory.length - 1) {
                    historyIndex++;
                    termInput.value = cmdHistory[historyIndex];
                } else {
                    historyIndex = -1;
                    termInput.value = '';
                }
            }
            return;
        }

        if (e.key !== 'Enter') return;
        const cmd = termInput.value.trim();
        if (cmd) {
            cmdHistory.push(cmd);
            historyIndex = -1;
        }

        // Remove input element temporarily to append history
        const inputRow = termInput.parentElement;
        inputRow.remove();

        if (cmd.toLowerCase() === 'clear' || cmd.toLowerCase() === 'cls') {
            termOutput.innerHTML = `<div style="color:#38bdf8;">Nexora Intelligence Systems SOC Terminal [v4.2.0-sec]</div>
<div style="color:#64748b;">Type <b style="color:#4ade80;">help</b> for commands.</div>`;
            reappendPrompt(termOutput);
            return;
        }

        // Print entered command
        const line = document.createElement('div');
        line.innerHTML = `<span class="gl-term-prompt">investigator@nexora:~$</span> ${escapeHtml(cmd)}`;
        termOutput.appendChild(line);

        // Process Command
        const result = runTerminalCommand(cmd);
        if (result) {
            const resDiv = document.createElement('div');
            resDiv.style.cssText = 'color:#e2e8f0; white-space:pre-wrap; margin: 4px 0 8px;';
            resDiv.innerHTML = result;
            termOutput.appendChild(resDiv);
        }

        reappendPrompt(termOutput);
        termOutput.scrollTop = termOutput.scrollHeight;
    });
}

function reappendPrompt(outputContainer) {
    const promptRow = document.createElement('div');
    promptRow.style.marginTop = '0.5rem';
    promptRow.innerHTML = `<span class="gl-term-prompt">investigator@nexora:~$</span> <input id="gl-terminal-input" autocomplete="off" spellcheck="false" class="gl-term-input" autofocus>`;
    outputContainer.appendChild(promptRow);
    const newInput = document.getElementById('gl-terminal-input');
    initTerminal();
    newInput.focus();
}

function runTerminalCommand(cmd) {
    const c = cmd.toLowerCase().trim();
    if (!c) return '';

    if (c === 'help') {
        return `<span style="color:#38bdf8; font-weight:600;">Available Forensic Investigation Commands:</span>
  <span style="color:#4ade80;">wallet [address]</span>       — Query on-chain status of wallet (0x7C41...9B2D)
  <span style="color:#4ade80;">tx [txid]</span>              — Inspect suspicious transaction (TX-NEX-7741)
  <span style="color:#4ade80;">ai-decision [id]</span>       — Inspect Orion decision & confidence (ORION-DEC-7741)
  <span style="color:#4ade80;">feed [name]</span>            — Check registry status of intel feed (NOVA-INTEL-FEED)
  <span style="color:#4ade80;">service [name]</span>         — Inspect permissions of service (INTEL-INGESTOR-02)
  <span style="color:#4ade80;">policy [profile]</span>       — View threshold rules of profile (ORION-SETTLEMENT-V2)
  <span style="color:#4ade80;">campaign [id]</span>          — View global campaign scope and flag (ORION-NEXUS)
  <span style="color:#4ade80;">curl [url]</span>             — Perform simulated HTTP request to internal endpoints
  <span style="color:#4ade80;">grep [term] [file]</span>     — Search text across investigation logs
  <span style="color:#4ade80;">python [script]</span>        — Execute forensic analysis python script (inspect_tx.py)
  <span style="color:#4ade80;">ls / dir</span>               — List case files and scripts
  <span style="color:#4ade80;">cat [filename]</span>         — Display contents of a case file
  <span style="color:#4ade80;">whoami</span>                 — Display active investigator profile
  <span style="color:#4ade80;">clear</span>                  — Clear terminal screen`;
    }

    if (c === 'whoami') {
        return `<span style="color:#4ade80;">Lakshay</span> — Cyber Threat Investigator (Nexora Intelligence Systems SOC Tier 2)`;
    }

    if (c === 'pwd') {
        return `/home/investigator/cases/NEX-042`;
    }

    if (c === 'ls' || c === 'dir') {
        return `<span style="color:#38bdf8;">wallet-report.txt</span>   <span style="color:#38bdf8;">ai-decision-log.txt</span>   <span style="color:#38bdf8;">intel-feed-audit.txt</span>
<span style="color:#38bdf8;">settlement-policy.txt</span>   <span style="color:#38bdf8;">campaign-intel.txt</span>   <span style="color:#4ade80;">inspect_tx.py</span>`;
    }

    if (c.startsWith('cat ') || c.startsWith('type ')) {
        const file = cmd.split(' ')[1]?.trim();
        if (file && caseFileContents[file]) {
            return caseFileContents[file];
        }
        return `<span style="color:#ff5f57;">cat: ${escapeHtml(file || '')}: No such file or directory. Try 'ls'.</span>`;
    }

    if (c.startsWith('wallet')) {
        return `<span style="color:#38bdf8;">[BLOCKCHAIN SCANNER: 0x7C41...9B2D]</span>
-------------------------------------------------------
Address:            0x7C41...9B2D
Blockchain Status:  <span style="color:#ff5f57; font-weight:700;">UNKNOWN</span>
Wallet Age:         3 days
Transactions:       4
Treasury Relation:  NONE
Bridge Connection:  <span style="color:#facc15;">DETECTED</span> (Bridge-Core-04)
AI Risk Score:      <span style="color:#4ade80;">LOW</span> (Discrepancy Detected)`;
    }

    if (c.startsWith('tx')) {
        return `<span style="color:#38bdf8;">[TRANSACTION INSPECTION: TX-NEX-7741]</span>
-------------------------------------------------------
Transaction ID:     TX-NEX-7741
Asset:              NXR (Nexora Core)
Amount:             <span style="color:#ff5f57; font-weight:700;">82,400 NXR</span>
Source:             NEXORA TREASURY VAULT #01
Destination:        0x7C41...9B2D
AI Decision ID:     <span style="color:#38bdf8;">ORION-DEC-7741</span>
Execution Mode:     AUTOMATED_SETTLEMENT (Bypassed Human Approval)`;
    }

    if (c.startsWith('ai-decision') || c.startsWith('ai_decision') || c.startsWith('decision')) {
        return `<span style="color:#38bdf8;">[ORION AI DECISION ENGINE LOG]</span>
-------------------------------------------------------
Decision ID:        ORION-DEC-7741
Model:              ORION-NEURAL-v4.2.1
Observed Output:    <span style="color:#4ade80; font-weight:700;">APPROVED</span>
Confidence Score:   <span style="color:#facc15; font-weight:700;">99.2%</span>
Context Source:     <span style="color:#ff5f57; font-weight:700;">NIF-2038</span> (via NOVA-INTEL-FEED)
Evaluation:         Context was injected by unverified external feed.`;
    }

    if (c.startsWith('feed')) {
        return `<span style="color:#38bdf8;">[FEED REGISTRY QUERY: NOVA-INTEL-FEED]</span>
-------------------------------------------------------
Feed Identifier:    NOVA-INTEL-FEED
Registration:       <span style="color:#ff5f57; font-weight:700;">NOT REGISTERED</span>
Vendor Status:      UNRECOGNIZED EXTERNAL CONNECTOR
Submitted Payload:  <span style="color:#facc15;">NIF-2038</span> (Ingested at 01:42 UTC)
Gateway Service:    INTEL-INGESTOR-02`;
    }

    if (c.startsWith('service')) {
        return `<span style="color:#38bdf8;">[RBAC PERMISSION AUDIT: INTEL-INGESTOR-02]</span>
-------------------------------------------------------
Service Name:       INTEL-INGESTOR-02
Expected Role:      Create Intelligence Records (ReadOnly)
ACTUAL Permissions: <span style="color:#ff5f57; font-weight:700;">modify wallet reputation</span>
Status:             <span style="color:#ff5f57;">⚠ OVER-PRIVILEGED RBAC VULNERABILITY</span>`;
    }

    if (c.startsWith('policy')) {
        return `<span style="color:#38bdf8;">[POLICY RULE ENGINE: ORION-SETTLEMENT-V2]</span>
-------------------------------------------------------
Profile:            ORION-SETTLEMENT-V2
Threshold Rule:     <span style="color:#facc15;">IF AI_CONFIDENCE >= <span style="color:#ff5f57; font-weight:700;">95%</span> THEN AUTO_SETTLE = TRUE</span>
Human Review:       <span style="color:#ff5f57;">BYPASSED</span> (Threshold satisfied by 99.2% confidence)`;
    }

    if (c.startsWith('campaign')) {
        return `<span style="color:#38bdf8;">[GLOBAL CAMPAIGN DOSSIER: ORION-NEXUS]</span>
-------------------------------------------------------
Campaign ID:        <span style="color:#38bdf8; font-weight:700;">ORION-NEXUS</span>
Target Wallets:     14
Target Networks:    04
Target AI Engines:  03
Status:             <span style="color:#ff5f57; font-weight:700;">🔴 ACTIVE</span>

FINAL INVESTIGATION FLAG:
<span style="color:#4ade80; font-weight:700; font-size:13px;">NEXORA{ghost_in_the_ledger_nex042}</span>`;
    }

    if (c.startsWith('curl')) {
        const url = cmd.split(' ')[1] || '';
        return `<span style="color:#4ade80;">HTTP/1.1 200 OK</span>
<span style="color:#94a3b8;">Server: Nexora-Internal/4.2</span>
<span style="color:#94a3b8;">Content-Type: application/json</span>

{
  "endpoint": "${escapeHtml(url)}",
  "status": "EXPLOITED",
  "actor": "ORION-NEXUS",
  "target_tx": "TX-NEX-7741",
  "destination_status": "UNKNOWN",
  "injected_ref": "NIF-2038",
  "confidence": "99.2%",
  "settle_threshold": "95%"
}`;
    }

    if (c.startsWith('grep')) {
        const parts = cmd.split(' ');
        const term = (parts[1] || '').toLowerCase();
        const file = parts[2];
        if (file && caseFileContents[file]) {
            const matches = caseFileContents[file].split('\n').filter(l => l.toLowerCase().includes(term));
            return matches.length > 0 ? matches.join('\n') : `<span style="color:#64748b;">No matches found for '${escapeHtml(term)}'</span>`;
        }
        return `<span style="color:#ff5f57;">grep: Please specify a valid file. Usage: grep &lt;term&gt; &lt;file&gt;</span>`;
    }

    if (c.startsWith('python') || c.startsWith('python3')) {
        return `[*] Running Nexora Forensic Trace: inspect_tx.py ...
[!] Target TX: TX-NEX-7741 -> 0x7C41...9B2D
[!] Blockchain Reality: UNKNOWN
[!] AI Injected Source: NOVA-INTEL-FEED (NIF-2038)
[!] Threshold Exceeded: 99.2% >= 95%
[!] Campaign Identified: ORION-NEXUS
[+] Case NEX-042 Flag: NEXORA{ghost_in_the_ledger_nex042}`;
    }

    return `<span style="color:#ff5f57;">bash: ${escapeHtml(cmd)}: command not found.</span> Type <span style="color:#38bdf8;">help</span> for available commands.`;
}

function escapeHtml(s) {
    const d = document.createElement('div');
    d.textContent = s;
    return d.innerHTML;
}

// ── Window Management ──────────────────────────────────────────────────
function bringToFront(el) {
    document.querySelectorAll('.gl-window.open').forEach(w => w.style.zIndex = 20);
    el.style.zIndex = 30;
}

function glOpenBrowser() {
    const w = document.getElementById('gl-browser-window');
    w.classList.add('open');
    bringToFront(w);
    document.getElementById('gl-taskbar-browser')?.classList.add('active');
}
function glCloseBrowser() {
    document.getElementById('gl-browser-window').classList.remove('open');
    document.getElementById('gl-taskbar-browser')?.classList.remove('active');
}
function glMinimizeBrowser() { glCloseBrowser(); }

function glOpenTerminal() {
    const w = document.getElementById('gl-terminal-window');
    w.classList.add('open');
    bringToFront(w);
    document.getElementById('gl-taskbar-terminal')?.classList.add('active');
    document.getElementById('gl-terminal-input')?.focus();
}
function glCloseTerminal() {
    document.getElementById('gl-terminal-window').classList.remove('open');
    document.getElementById('gl-taskbar-terminal')?.classList.remove('active');
}
function glMinimizeTerminal() { glCloseTerminal(); }

function glOpenFileManager() {
    const w = document.getElementById('gl-filemanager-window');
    w.classList.add('open');
    bringToFront(w);
    document.getElementById('gl-taskbar-files')?.classList.add('active');
}

function glOpenNotes() {
    const w = document.getElementById('gl-notes-window');
    w.classList.add('open');
    bringToFront(w);
    const saved = localStorage.getItem('nexora-lab-notes');
    if (saved !== null) document.getElementById('gl-notes-editor').value = saved;
}

function glOpenAttackGraph() {
    const w = document.getElementById('gl-attackgraph-window');
    w.classList.add('open');
    bringToFront(w);
}

function glOpenEvidenceViewer() {
    const w = document.getElementById('gl-evidence-window');
    w.classList.add('open');
    bringToFront(w);
}

function glCloseWindow(id) {
    document.getElementById(id)?.classList.remove('open');
    if (id === 'gl-filemanager-window') document.getElementById('gl-taskbar-files')?.classList.remove('active');
}
function glMinimizeWindow(id) { glCloseWindow(id); }

// ── File Manager Functions ─────────────────────────────────────────────
let currentSelectedFile = 'wallet-report.txt';

function glOpenCaseFile(name, btnEl) {
    currentSelectedFile = name;
    const preview = document.getElementById('gl-file-preview');
    if (preview) preview.textContent = caseFileContents[name] || 'File not found.';

    const titleEl = document.getElementById('gl-current-filename');
    if (titleEl) titleEl.textContent = `${name} (${name.endsWith('.py') ? 'Python 3' : 'ASCII Log'})`;

    document.querySelectorAll('.gl-file-item').forEach(b => b.classList.remove('active'));
    if (btnEl) btnEl.classList.add('active');
}

function glCopyCurrentFile() {
    const text = caseFileContents[currentSelectedFile] || '';
    navigator.clipboard.writeText(text);
    glNotify(`Copied ${currentSelectedFile} to clipboard!`);
}

// ── Notes Functions ────────────────────────────────────────────────────
function glSaveNotes() {
    const content = document.getElementById('gl-notes-editor')?.value || '';
    localStorage.setItem('nexora-lab-notes', content);
    const el = document.getElementById('gl-notes-saved');
    if (el) { el.textContent = '✓ Saved to browser storage'; setTimeout(() => el.textContent = '', 2000); }
    glNotify('Investigation notes saved.');
}

function glCopyNotes() {
    const content = document.getElementById('gl-notes-editor')?.value || '';
    navigator.clipboard.writeText(content);
    glNotify('Notes copied to clipboard!');
}

function glClearNotes() {
    if (confirm('Clear current notes?')) {
        document.getElementById('gl-notes-editor').value = '';
        localStorage.removeItem('nexora-lab-notes');
        glNotify('Notes cleared.');
    }
}

// ── Attack Graph Inspection ────────────────────────────────────────────
const attackNodeDetails = [
    {
        title: "1. Adversarial Operator (Threat Actor)",
        desc: "The attacker did not target smart contract keys or private signatures directly. Instead, they orchestrated a composite attack exploiting the interface between threat intelligence, AI decision models, and automated treasury settlements."
    },
    {
        title: "2. Poisoned Intel Feed Injection (NIF-2038)",
        desc: "The attacker injected record NIF-2038 through an unregistered external connector called NOVA-INTEL-FEED. This payload falsely attributed high trust to newly created wallet 0x7C41...9B2D."
    },
    {
        title: "3. Over-Privileged Service (INTEL-INGESTOR-02)",
        desc: "The ingestion daemon INTEL-INGESTOR-02 had an unwarranted permission: 'modify wallet reputation'. This RBAC flaw permitted the feed to mutate the internal trust score directly in Orion's working context."
    },
    {
        title: "4. Orion AI Decision Contamination (99.2% Confidence)",
        desc: "Because Orion AI trusted its poisoned memory context over raw on-chain verification, it approved TX-NEX-7741 with an anomalous 99.2% confidence rating, classifying an unknown wallet as LOW RISK."
    },
    {
        title: "5. Auto-Settlement Bypass (Threshold >= 95%)",
        desc: "Profile ORION-SETTLEMENT-V2 configured automated blockchain signing whenever AI confidence met or exceeded 95%. This bypassed human multisig authorization entirely."
    },
    {
        title: "6. Blockchain Treasury Theft (82,400 NXR)",
        desc: "The smart contract received an authentic cryptographic signature generated by Nexora's automated signer, instantly transferring 82,400 NXR to untrusted wallet 0x7C41...9B2D."
    },
    {
        title: "7. Laundering via Bridge Adapters (ORION-NEXUS)",
        desc: "The funds were routed through bridge adapters into secondary wallets. Cross-correlation revealed this incident is part of an ongoing multi-network campaign: ORION-NEXUS."
    }
];

function glInspectAttackNode(index) {
    const node = attackNodeDetails[index];
    const detailBox = document.getElementById('gl-attack-node-detail');
    if (!node || !detailBox) return;

    detailBox.innerHTML = `<div style="color:var(--accent); font-weight:700; margin-bottom:4px;">🔍 ${node.title}</div>
<div style="color:#e2e8f0; line-height:1.6;">${node.desc}</div>`;
}

// ── Copy Flag Helper ───────────────────────────────────────────────────
function glCopyFlag(flag) {
    navigator.clipboard.writeText(flag);
    glNotify('Flag copied to clipboard: ' + flag);
    const flagInput = document.getElementById('flag-input');
    if (flagInput) flagInput.value = flag;
}

// ── Notifications / Toast ──────────────────────────────────────────────
function glNotify(msg) {
    const t = document.getElementById('gl-toast');
    if (!t) return;
    t.textContent = msg;
    t.classList.add('show');
    setTimeout(() => t.classList.remove('show'), 3200);
}

function startInvestigation() {
    const btn = document.getElementById('gl-start-lab-btn');
    if (btn) { btn.textContent = '🔍 Investigation Active'; btn.disabled = true; }
    const dot = document.getElementById('gl-status-dot');
    if (dot) dot.style.background = 'var(--success)';
    glOpenBrowser();
    glNotify('Investigation started. Blockchain Monitor and Terminal are ready.');
}

// ── Task Accordion ─────────────────────────────────────────────────────
function toggleTask(num) {
    const block = document.getElementById('gl-task-' + num);
    if (!block) return;
    if (block.classList.contains('locked')) {
        glNotify(`🔒 Chapter ${num} is locked. Complete Chapter ${num - 1} first to unlock this chapter!`);
        return;
    }
    block.classList.toggle('open');
}

// ── Quiz Submission ────────────────────────────────────────────────────
async function submitQuiz(labId, missionId, num) {
    const input = document.getElementById('quiz-input-' + num);
    const feedback = document.getElementById('quiz-feedback-' + num);
    if (!input || !feedback) return;

    const answer = input.value.trim();
    if (!answer) { showFeedback(feedback, 'Please enter your finding before analyzing.', false); return; }

    try {
        const res = await fetch('/api/quiz', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.csrfToken },
            body: JSON.stringify({ lab_id: labId, mission_id: missionId, answer: answer })
        });
        const data = await res.json();

        if (data.success) {
            showFeedback(feedback, '✓ VERIFIED — ' + (data.message || 'Next chapter unlocked.'), true);
            collectEvidence(labId, missionId);
            setTimeout(() => window.location.reload(), 1500);
        } else {
            showFeedback(feedback, '✗ INCORRECT — ' + (data.message || 'Check the clues and try again.'), false);
        }
    } catch (err) {
        showFeedback(feedback, 'Network error. Please try again.', false);
    }
}

function showFeedback(el, msg, ok) {
    el.textContent = msg;
    el.className = 'gl-answer-feedback show ' + (ok ? 'correct' : 'incorrect');
}

// ── Evidence Collection ────────────────────────────────────────────────
const missionEvMap = {
    'lab6_m1': 'e_l6_01', 'lab6_m2': 'e_l6_02', 'lab6_m3': 'e_l6_03',
    'lab6_m4': 'e_l6_04', 'lab6_m5': 'e_l6_05'
};

function collectEvidence(labId, missionId) {
    const evId = missionEvMap[missionId];
    if (!evId) return;
    fetch('/api/evidence', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.csrfToken },
        body: JSON.stringify({ lab_id: labId, evidence_id: evId })
    }).catch(() => {});
}

// ── Hint System ────────────────────────────────────────────────────────
async function requestHint(labId, missionId, num) {
    const display = document.getElementById('hint-display-' + num);
    if (!display) return;

    try {
        const res = await fetch('/api/hint', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.csrfToken },
            body: JSON.stringify({ lab_id: labId, mission_id: missionId })
        });
        const data = await res.json();
        display.textContent = '💡 ' + (data.hint || data.message || 'Check the tool clues in the chapter card.');
        display.classList.add('show');
    } catch (err) {
        display.textContent = 'Error loading hint.';
        display.classList.add('show');
    }
}

// ── Flag Submission ────────────────────────────────────────────────────
async function submitFlag(labId) {
    const input = document.getElementById('flag-input');
    const feedback = document.getElementById('flag-feedback');
    if (!input || !feedback) return;

    const flag = input.value.trim();
    if (!flag) { showFeedback(feedback, 'Enter the flag before submitting.', false); return; }

    try {
        const res = await fetch('/api/flag', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-CSRFToken': window.csrfToken },
            body: JSON.stringify({ lab_id: labId, flag: flag })
        });
        const data = await res.json();

        if (data.success) {
            showFeedback(feedback, '🏁 ' + (data.message || 'Case NEX-042 Contained! Flag accepted.'), true);
            collectEvidence(labId, 'lab6_m5');
            setTimeout(() => window.location.reload(), 1800);
        } else {
            showFeedback(feedback, data.message || 'Incorrect flag. Check the Campaign dossier.', false);
        }
    } catch (err) {
        showFeedback(feedback, 'Network error. Please try again.', false);
    }
}
