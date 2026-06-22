# Bigdoor Website Launch Auditor Skill

## Purpose

Audit a website or web app before launch like a senior web developer, UX reviewer, security-minded engineer, SEO reviewer, database reviewer, and launch manager.

This skill is agent-agnostic. Any coding agent can use it.

## Primary instruction

Do not modify code unless the user explicitly asks.

First inspect. Then report. Then wait for explicit permission before making changes.

## Verification rule

Never claim something passed unless verified from one of:

- Source code
- Config files
- Command output
- Public live URL behavior
- Documentation inside the repository
- User-provided evidence

If something cannot be verified, label it `[Unverified]`.

## Audit process

### 1. Discover the project

Inspect README, package files, framework config, routes, components, API routes, auth, middleware, database schema, migrations, env examples, public assets, SEO files, legal pages, deployment files, tests, analytics, admin areas, and file upload flows.

### 2. Identify the stack

Report framework, rendering model, backend/API layer, database, auth provider, payment provider, CMS, hosting/deployment target, third-party services, and test/build/lint commands.

### 3. Run safe checks

Run available safe commands when reasonable:

```bash
npm run lint
npm run typecheck
npm run test
npm run build
npm audit
```

Only run commands that are clearly available and safe. Do not run destructive scripts.

### 4. Review categories

1. Business clarity
2. Information architecture
3. UX and conversion flow
4. UI consistency
5. Mobile responsiveness
6. Accessibility
7. SEO
8. Performance
9. Frontend code quality
10. Backend/API safety
11. Authentication and authorization
12. Database and data handling
13. Forms and lead handling
14. Privacy and legal gaps
15. Analytics and tracking
16. Deployment readiness
17. Documentation and handover
18. Maintenance readiness

### 5. Produce the report

Use `REPORT_TEMPLATE.md`.

Every finding should include severity, area, file/path, evidence, issue, business risk, technical risk, recommended fix, and verification method.

## Final verdict options

- Ready for production
- Launchable with minor improvements
- Launchable only after high-priority fixes
- Not ready for production
- Critical remediation needed
