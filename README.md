# Bigdoor Website Launch Auditor Skill

A free, open-source, agent-agnostic website launch-readiness audit framework by BigDoor AI Labs.

It helps developers, agencies, founders, and coding agents run a structured website audit before shipping. It covers UI, UX, architecture, accessibility, SEO, performance, security, backend/API safety, database handling, privacy/legal gaps, analytics, deployment readiness, and maintainability.

It is not tied to one coding agent. Use it with Codex, Cursor, Claude Code, Windsurf, Cline, Aider, Continue, or any coding agent that can read project instructions.

## What this is

A senior website launch checklist converted into:

- A reusable markdown skill
- Agent-specific instruction adapters
- A CLI initializer
- Project and live URL check helpers
- A structured audit report template
- A severity and scoring rubric

## What this is not

This tool does not guarantee legal compliance, security certification, accessibility certification, or production readiness. It produces an audit based on available code, configuration, command output, and public website behavior.

Use professional review for legal, security, privacy, healthcare, financial, or regulated websites.

## Install

After npm publishing:

```bash
npm install -g @bigdoor-ai/website-launch-auditor
```

Until then, install from GitHub after the repo is live:

```bash
npm install -g github:BigDoor-ai/bigdoor-website-launch-auditor-skill
```

Then run:

```bash
bd-audit --help
```

## Quick start

Inside any website project:

```bash
bd-audit init
bd-audit export-agent generic
bd-audit check-project
bd-audit audit
```

Then use your coding agent:

```txt
Use the Bigdoor Website Launch Auditor Skill in this repository.

Do not modify code.

Inspect the project, read the audit checklist, review the codebase, run available checks, and generate a complete launch-readiness report using the report template.

Mark anything you cannot verify as [Unverified].
Give file paths, severity, exact issue, business risk, technical risk, and recommended fix order.
```

## CLI commands

```bash
bd-audit init
bd-audit export-agent generic
bd-audit export-agent codex
bd-audit export-agent cursor
bd-audit export-agent claude-code
bd-audit export-agent windsurf
bd-audit export-agent cline
bd-audit export-agent aider
bd-audit check-project
bd-audit check-url https://example.com
bd-audit audit
bd-audit doctor
```

## Agent adapters

| Agent | Output |
|---|---|
| Generic | `.website-launch-auditor/agent-prompt.md` |
| Codex | `AGENTS.md` and `.agents/skills/website-launch-auditor/SKILL.md` |
| Cursor | `.cursor/rules/bigdoor-website-launch-auditor.mdc` |
| Claude Code | `.claude/commands/website-launch-auditor.md` |
| Windsurf | `.windsurf/rules/bigdoor-website-launch-auditor.md` |
| Cline | `.clinerules/bigdoor-website-launch-auditor.md` |
| Aider | `CONVENTIONS.md` |

## Audit categories

- Business clarity
- Information architecture
- UX and conversion flow
- UI consistency
- Mobile responsiveness
- Accessibility
- SEO
- Performance
- Frontend code quality
- Backend/API safety
- Authentication and authorization
- Database and data handling
- Forms and lead capture
- Privacy and legal gaps
- Analytics and tracking
- Deployment readiness
- Documentation and handover
- Maintenance readiness

## Scoring

| Score | Meaning |
|---:|---|
| 90-100 | Production ready |
| 80-89 | Launchable with minor improvements |
| 70-79 | Launchable only after high-priority fixes |
| 50-69 | Not ready for production |
| Below 50 | Critical remediation needed |

## Severity model

| Severity | Meaning |
|---|---|
| Critical | Must fix before launch |
| High | Should fix before launch |
| Medium | Should fix soon |
| Low | Improvement opportunity |
| Unverified | Cannot confirm from available code, config, command output, or public URL |

## Non-negotiable audit rules

- Never claim something passed unless verified.
- Mark unverifiable items as `[Unverified]`.
- Do not modify code unless explicitly asked.
- Separate codebase findings from live URL findings.
- Separate legal/compliance gaps from legal conclusions.
- Always include file paths where available.
- Always include recommended fix order.
- Always include a final launch readiness score.
- Always include what was checked and what was not checked.

## License

MIT License. Free for personal, commercial, agency, and open-source use.

## Maintainer

BigDoor AI Labs Pte. Ltd
