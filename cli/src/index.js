#!/usr/bin/env node
import fs from "fs";
import path from "path";
import process from "process";

const cwd = process.cwd();

const templateFiles = {
  "WEBSITE_LAUNCH_AUDITOR.md": `# Bigdoor Website Launch Auditor Skill

Do not modify code unless explicitly asked.

Audit this website/web app for launch readiness across business clarity, UI, UX, accessibility, SEO, performance, security, backend/API safety, database handling, privacy/legal gaps, analytics, deployment, documentation, and maintainability.

Never claim a check passed unless verified from code, config, command output, live URL behavior, repo documentation, or user-provided evidence.

Mark anything unverifiable as [Unverified].

Produce the final report using REPORT_TEMPLATE.md.
`,
  "REPORT_TEMPLATE.md": `# Website Launch Audit Report

## Executive Summary

**Project:**  
**Audit date:**  
**Final readiness score:** __/100  
**Final verdict:**  

## Verification Basis

### Checked

- [ ] Source code
- [ ] Config files
- [ ] Package scripts
- [ ] Build output
- [ ] Test output
- [ ] Live URL
- [ ] Database schema
- [ ] Legal pages
- [ ] SEO files
- [ ] Accessibility basics

### Not checked / Unverified

## Critical Blockers

| Severity | Area | File/Path | Issue | Evidence | Recommended Fix |
|---|---|---|---|---|---|

## High Priority Issues

| Severity | Area | File/Path | Issue | Evidence | Recommended Fix |
|---|---|---|---|---|---|

## Medium Priority Issues

| Severity | Area | File/Path | Issue | Evidence | Recommended Fix |
|---|---|---|---|---|---|

## Low Priority Improvements

| Severity | Area | File/Path | Issue | Evidence | Recommended Fix |
|---|---|---|---|---|---|

## Recommended Fix Order

1.
2.
3.

## Commands Run

| Command | Result | Notes |
|---|---|---|

## Final Launch Decision
`,
  "SEVERITY_RUBRIC.md": `# Severity Rubric

Critical: Must fix before launch.
High: Should fix before launch.
Medium: Should fix soon.
Low: Improvement opportunity.
Unverified: Cannot confirm from available evidence.
`
};

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function writeFileIfMissing(filePath, content) {
  if (!fs.existsSync(filePath)) {
    ensureDir(path.dirname(filePath));
    fs.writeFileSync(filePath, content, "utf8");
    return true;
  }
  return false;
}

function walk(dir, maxDepth = 3, depth = 0) {
  if (depth > maxDepth || !fs.existsSync(dir)) return [];
  const ignored = new Set(["node_modules", ".git", ".next", "dist", "build", ".turbo", "coverage"]);
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  let results = [];
  for (const entry of entries) {
    if (ignored.has(entry.name)) continue;
    const full = path.join(dir, entry.name);
    const rel = path.relative(cwd, full);
    results.push(rel);
    if (entry.isDirectory()) results = results.concat(walk(full, maxDepth, depth + 1));
  }
  return results;
}

function init() {
  const base = path.join(cwd, ".website-launch-auditor");
  ensureDir(path.join(base, "checklists"));
  const created = [];
  for (const [name, content] of Object.entries(templateFiles)) {
    if (writeFileIfMissing(path.join(base, name), content)) created.push(path.join(".website-launch-auditor", name));
  }
  const checklist = `# Master Checklist

- Business clarity
- UX and conversion
- UI consistency
- Mobile responsiveness
- Accessibility
- SEO
- Performance
- Security
- Backend/API safety
- Database/data handling
- Privacy/legal gaps
- Analytics/tracking
- Deployment readiness
- Documentation/handover
`;
  if (writeFileIfMissing(path.join(base, "checklists", "master-checklist.md"), checklist)) {
    created.push(".website-launch-auditor/checklists/master-checklist.md");
  }
  console.log("Bigdoor Website Launch Auditor initialized.");
  console.log(created.length ? `Created:\n- ${created.join("\n- ")}` : "No files created; files already exist.");
}

function exportAgent(agent = "generic") {
  const adapters = {
    generic: [".website-launch-auditor/agent-prompt.md", `Use the Bigdoor Website Launch Auditor Skill. Do not modify code. Generate a full launch-readiness report.`],
    codex: ["AGENTS.md", `# Bigdoor Website Launch Auditor\n\nWhen asked to audit this project, follow .website-launch-auditor/WEBSITE_LAUNCH_AUDITOR.md. Do not modify code unless explicitly asked.`],
    cursor: [".cursor/rules/bigdoor-website-launch-auditor.mdc", `---\ndescription: Bigdoor Website Launch Auditor Skill\nglobs:\n  - "**/*"\nalwaysApply: false\n---\n\nFollow .website-launch-auditor/WEBSITE_LAUNCH_AUDITOR.md.`],
    "claude-code": [".claude/commands/website-launch-auditor.md", `Use .website-launch-auditor/WEBSITE_LAUNCH_AUDITOR.md and generate a complete audit report. Do not modify code.`],
    windsurf: [".windsurf/rules/bigdoor-website-launch-auditor.md", `Use .website-launch-auditor/WEBSITE_LAUNCH_AUDITOR.md and generate a complete audit report. Do not modify code.`],
    cline: [".clinerules/bigdoor-website-launch-auditor.md", `Use .website-launch-auditor/WEBSITE_LAUNCH_AUDITOR.md and generate a complete audit report. Do not modify code.`],
    aider: ["CONVENTIONS.md", `# Bigdoor Website Launch Auditor\n\nWhen asked to audit, read .website-launch-auditor/WEBSITE_LAUNCH_AUDITOR.md first. Do not modify code unless explicitly asked.`]
  };
  if (!adapters[agent]) {
    console.error(`Unknown agent: ${agent}`);
    console.error(`Supported: ${Object.keys(adapters).join(", ")}`);
    process.exit(1);
  }
  const [target, content] = adapters[agent];
  const full = path.join(cwd, target);
  writeFileIfMissing(full, content);
  console.log(`Exported ${agent} adapter to ${target}`);
}

function checkProject() {
  const paths = walk(cwd, 3);
  const exists = (p) => fs.existsSync(path.join(cwd, p));
  const checks = [
    ["package.json", exists("package.json")],
    ["README.md", exists("README.md")],
    [".env.example", exists(".env.example")],
    ["robots.txt", exists("public/robots.txt") || exists("robots.txt")],
    ["sitemap", exists("public/sitemap.xml") || exists("sitemap.xml") || paths.some(p => p.toLowerCase().includes("sitemap"))],
    ["privacy policy", paths.some(p => p.toLowerCase().includes("privacy"))],
    ["terms", paths.some(p => p.toLowerCase().includes("terms"))],
    ["tests", paths.some(p => p.includes("test") || p.includes("spec"))]
  ];

  let report = `# Bigdoor Website Launch Auditor: Project Check\n\nGenerated: ${new Date().toISOString()}\n\n`;
  report += `## Checks\n\n| Check | Status |\n|---|---|\n`;
  for (const [name, ok] of checks) report += `| ${name} | ${ok ? "Found" : "[Unverified] Not found"} |\n`;
  report += `\n## Important Files Seen\n\n${paths.slice(0, 200).map(p => `- ${p}`).join("\n")}\n`;
  fs.writeFileSync(path.join(cwd, "website-launch-audit-project-check.md"), report);
  fs.writeFileSync(path.join(cwd, "website-launch-audit-project-check.json"), JSON.stringify({ generatedAt: new Date().toISOString(), checks: Object.fromEntries(checks), files: paths }, null, 2));
  console.log("Wrote website-launch-audit-project-check.md and .json");
}

async function checkUrl(url) {
  if (!url) {
    console.error("Usage: bd-audit check-url https://example.com");
    process.exit(1);
  }
  let report = `# Bigdoor Website Launch Auditor: URL Check\n\nURL: ${url}\nGenerated: ${new Date().toISOString()}\n\n`;
  try {
    const res = await fetch(url, { redirect: "follow" });
    const text = await res.text();
    report += `## HTTP\n\n- Status: ${res.status}\n- Final URL: ${res.url}\n\n`;
    report += `## Headers\n\n`;
    for (const h of ["strict-transport-security", "content-security-policy", "x-frame-options", "x-content-type-options", "referrer-policy", "permissions-policy"]) {
      report += `- ${h}: ${res.headers.get(h) || "[Unverified] Not present"}\n`;
    }
    report += `\n## Basic SEO Signals\n\n`;
    report += `- Title: ${/<title[^>]*>(.*?)<\/title>/is.test(text) ? "Found" : "[Unverified] Not found"}\n`;
    report += `- Meta description: ${/<meta[^>]+name=["']description["'][^>]*>/is.test(text) ? "Found" : "[Unverified] Not found"}\n`;
    report += `- Canonical: ${/<link[^>]+rel=["']canonical["'][^>]*>/is.test(text) ? "Found" : "[Unverified] Not found"}\n`;
    report += `- Open Graph: ${/<meta[^>]+property=["']og:/is.test(text) ? "Found" : "[Unverified] Not found"}\n`;
  } catch (err) {
    report += `## Error\n\n${err.message}\n`;
  }
  fs.writeFileSync(path.join(cwd, "website-launch-audit-url-check.md"), report);
  console.log("Wrote website-launch-audit-url-check.md");
}

function audit() {
  const template = templateFiles["REPORT_TEMPLATE.md"].replace("**Audit date:**  ", `**Audit date:** ${new Date().toISOString()}  `);
  fs.writeFileSync(path.join(cwd, "BIGDOOR_WEBSITE_LAUNCH_AUDIT_REPORT.md"), template);
  console.log("Wrote BIGDOOR_WEBSITE_LAUNCH_AUDIT_REPORT.md");
}

function doctor() {
  console.log("Bigdoor Website Launch Auditor");
  console.log(`Node: ${process.version}`);
  console.log(`CWD: ${cwd}`);
  console.log("Status: OK");
}

function help() {
  console.log(`Bigdoor Website Launch Auditor Skill

Usage:
  bd-audit init
  bd-audit export-agent <generic|codex|cursor|claude-code|windsurf|cline|aider>
  bd-audit check-project
  bd-audit check-url <url>
  bd-audit audit
  bd-audit doctor
`);
}

const [cmd, arg] = process.argv.slice(2);
switch (cmd) {
  case "init": init(); break;
  case "export-agent": exportAgent(arg || "generic"); break;
  case "check-project": checkProject(); break;
  case "check-url": await checkUrl(arg); break;
  case "audit": audit(); break;
  case "doctor": doctor(); break;
  case "--help":
  case "-h":
  case undefined: help(); break;
  default:
    console.error(`Unknown command: ${cmd}`);
    help();
    process.exit(1);
}
