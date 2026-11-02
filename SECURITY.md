# Security Policy

## Reporting a vulnerability

Please do not file public issues for suspected vulnerabilities. Use GitHub's **Report a vulnerability** feature on this repository to send a private report. Include the affected route or package, impact, and steps to reproduce. Do not include real user data or live credentials.

## Dependency and release standards

- Keep dependencies declared and lockfile-pinned; review automated updates before merging.
- Prefer maintained packages with permissive licenses and a clear security response process.
- Do not commit `.env` files, access tokens, private keys, or production data. Use GitHub/Vercel secret stores for deployment credentials.
- CI validates registry generation, type safety, component contracts, production builds, and browser smoke behavior before changes are accepted.
- Treat component source, static assets, and generated registry payloads as untrusted inputs during review; validate asset paths and avoid evaluating downloaded code.
