# AWS Well-Architected Framework Interactive Showcase & Defense Platform

> **Engineered & Presented by: Devarsh Patel & Aman Kumar**  
> *AWS Certified Solutions Architect Defense & Executive Modernization Blueprint*

---

## 🌟 Executive Overview

An enterprise-grade, Apple-standard interactive presentation and real-time cloud architecture simulation platform. Built from the ground up to contrast fragile, un-tiered **Single Point of Failure (SPOF) Anti-Patterns** against resilient, cost-optimized **AWS Well-Architected Architectures** across **15 mission-critical enterprise domains** and all **6 Pillars**:

1. **Operational Excellence**
2. **Security**
3. **Reliability**
4. **Performance Efficiency**
5. **Cost Optimization (FinOps)**
6. **Sustainability**

---

## ⚡ Core Interactive Features

### 1. Side-by-Side Architectural Topologies
* Real-time comparative topologies for all 15 domains.
* Interactive component inspection modals with deep-dive technical specs, security policies, cost profiles, and IaC snippets (Terraform HCL).
* Dynamic animated data packet flight streams demonstrating latency deltas.

### 2. Live Traffic Load Sandbox & Disaster Attack Vectors
* **Traffic Load Slider**: Dynamically simulate concurrency from **500 to 100,000+ users/sec** with instant presets:
  * `Normal (1k)`: Nominal baseline.
  * `Flash Sale (25k)`: High traffic surge.
  * `Black Friday (100k)`: Extreme peak load.
* **4 One-Click Disaster Injection Vectors**:
  * 🔴 **AZ-a Power Failure**: Hardware outage in us-east-1a.
  * 🔴 **Ransomware Wiper Attack**: Malicious deletion vs. S3 Object Lock (WORM).
  * 🔴 **500k SYN Flood DDoS**: Connection exhaustion vs. AWS WAF & CloudFront Edge absorption.
  * 🟡 **FinOps Bill Shock**: On-demand waste vs. Graviton3 ARM Savings Plans.
* **Visual Physical Consequences**: Fragile server violently shakes (`@keyframes spof-shake`), CPU climbs to **99% (OVERHEATED 🔥)**, latency spikes to **4,800 ms (504 Gateway Timeout)**, while the Well-Architected cluster dynamically auto-scales Graviton3 container workers (`+AUTO-SCALED`) across Multi-AZ subnets!

### 3. Grounded AI Solutions Architect & Copilot (`Hotkey: A`)
* Grounded in authoritative **AWS Well-Architected Whitepapers** across the 6 Pillars.
* **Domain-Aware Prompt Starters**: Dynamic suggestions tailored to the active module.
* **Token Streaming Lifecycle**: Real-time typing with stop, copy, and clear controls.
* **Verified Citations**: Traceable whitepaper section quotes and reference IDs (`REL-09`, `COST-06`, `SEC-01`, `PERF-01`).
* **Two-Phase Human Confirmation Safeguard**: Proposes simulated agent remediations with blast radius, cost impact, and requires human sign-off before modifying the live topology.
* **Prompt Injection Defenses**: Intercepts adversarial overrides and enforces least privilege boundaries.

### 4. Enterprise AI Governance & Launch-Readiness Inspector (`Hotkey: G`)
* 12-section compliance audit covering:
  1. AI Taxonomy (Assisted vs Powered vs Personalized vs Agent)
  2. Product-First Value Proposition & Metric Baselines
  3. Non-Negotiable Website Foundations (WCAG 2.2 AA)
  4. Task-Driven Feature Matrix
  5. UI Interaction Lifecycle & Two-Phase Confirmations
  6. Technical Architecture & RAG Pipeline
  7. Privacy, Security & Injection Mitigations
  8. Failure Modes & Practical Fixes
  9. Testing, Red-Teaming & Evaluation
  10. Telemetry & Analytics
  11. Practical Delivery Sequence
  12. **Interactive 12-Gate Launch-Readiness Checklist** (Real-time 100% Launch Score calculation).

### 5. Specialized Deep-Dive Labs
* **Packet Flight Latency Simulator (`Hotkey: L`)**: Interactive packet flight benchmark.
* **Client Workload Solutions (`Hotkey: W`)**: Real-world e-commerce, SaaS, and healthcare case studies with cost-cutting blueprints.
* **Subtopic Deep-Dive Labs (`Hotkey: T`)**: RDS Proxy, EBS gp3 IOPS, Aurora Quorum, and S3 Lifecycle simulators.
* **Theoretical Foundations Compendium (`Hotkey: K`)**: Academic citations including CAP Theorem, PACELC, Gall's Law, and Amdahl's Law.
* **Executive Review & ROI Calculator**: Comprehensive HRI audit scoring and multi-year savings forecasting.
* **Keynote Presentation Deck (`Hotkey: P`)**: Full-screen presenter deck with teleprompter, speaker notes (`Hotkey: S`), and grid navigator (`Hotkey: G`).

---

## ⌨️ Presentation Keyboard Shortcuts

| Shortcut | Action |
|---|---|
| <kbd>→</kbd> / <kbd>←</kbd> | Navigate Next / Previous Module (1 to 15) |
| <kbd>P</kbd> | Launch Fullscreen Keynote Presentation Deck |
| <kbd>A</kbd> | Open Grounded AWS AI Architect Copilot |
| <kbd>G</kbd> | Open 12-Pillar AI Governance & Launch-Readiness Inspector |
| <kbd>L</kbd> | Open Packet Latency & Flight Benchmark Simulator |
| <kbd>W</kbd> | Open Client Workload Solutions Explorer |
| <kbd>T</kbd> | Open Subtopic Deep-Dive Labs |
| <kbd>K</kbd> | Open Theoretical Foundations Compendium |
| <kbd>S</kbd> | Toggle Speaker Script & Defense Prompter |
| <kbd>C</kbd> | Trigger Multi-AZ Chaos Outage |
| <kbd>R</kbd> | Reset Chaos Outage to Nominal State |
| <kbd>Esc</kbd> | Dismiss any open modal or return to Studio view |

---

## 🚀 Running Locally

```bash
# 1. Install dependencies
npm install

# 2. Start development server
npm run dev
```

Visit **`http://localhost:5173/`** in your browser.

---

## 🌐 Deploying to GitHub Pages (0-Error Setup)

This repository is pre-configured with a **GitHub Actions automated workflow** (`.github/workflows/deploy.yml`) and relative asset paths (`base: './'`), guaranteeing 100% error-free deployment.

### Step-by-Step Instructions:

1. **Push this repository to GitHub**:
   ```bash
   git add .
   git commit -m "feat: AWS Well-Architected Framework presentation platform with AI Copilot & Governance"
   git remote add origin https://github.com/<your-username>/<your-repo-name>.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages in your repository settings**:
   * Navigate to your repo on GitHub: **Settings** ➔ **Pages** (under "Code and automation").
   * Under **Build and deployment** ➔ **Source**, select **GitHub Actions**.

3. **Automatic Deployment**:
   * The included `.github/workflows/deploy.yml` workflow will automatically trigger, build the production bundle, and publish your site.
   * Your site will be live at:
     ```
     https://<your-username>.github.io/<your-repo-name>/
     ```

---

## 🛠️ Technology Stack

* **Framework**: React 19 + TypeScript
* **Build Tool**: Vite 8 (Ultra-fast HMR and bundle compilation)
* **Styling**: Vanilla CSS with custom Apple-grade OLED design system and glassmorphism tokens
* **Icons**: Official Amazon Web Services SVG icon library + Lucide React
* **Audio**: Native Web Audio API procedural sound synthesizer (Click, Alert, Chime)
* **Automated QA**: Puppeteer end-to-end verification test suite

---

## 👥 Authors & Presenters

* **Devarsh Patel**
* **Aman Kumar**
