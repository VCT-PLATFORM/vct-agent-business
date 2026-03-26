# SOP-404: Code Review — Quy trình Review Code

> **Actor**: Tech Lead + Developers | **Trigger**: Mỗi Pull Request

## Rules
1. **Every PR must be reviewed** by at least 1 engineer before merge
2. **PR size**: <400 lines preferred. >800 lines → Split
3. **Review time SLA**: <4 hours business hours
4. **Self-review first**: Author reviews their own PR before requesting

## Review Checklist
```
// turbo
├── Correctness:
│   ├── Logic correct? Edge cases handled?
│   ├── Error handling appropriate?
│   └── Matches acceptance criteria in ticket?
├── Readability:
│   ├── Meaningful variable/function names?
│   ├── Comments explain WHY (not WHAT)?
│   └── Consistent with codebase patterns?
├── Simplicity:
│   ├── Could this be simpler?
│   ├── Any unnecessary abstraction?
│   └── DRY without over-DRY?
├── Testing:
│   ├── Unit tests for new logic?
│   ├── Edge cases tested?
│   └── CI passing?
├── Security:
│   ├── SQL injection? XSS?
│   ├── Auth/Authorization checks?
│   ├── Sensitive data exposure?
│   └── Input validation?
├── Performance:
│   ├── N+1 queries?
│   ├── Unnecessary re-renders?
│   ├── Large payload/response?
│   └── Missing pagination/limits?
```

## Feedback Etiquette
```
├── Be kind: Critique code, not the person
├── Be specific: "Line 42: this could be simplified using X" (not "bad code")
├── Ask questions: "What's the reason for this approach?" (not "why did you do this?")
├── Suggest alternatives: "Consider using X because [reason]"
├── Prefix: [nit] for nitpicks, [must] for required changes
└── Approve with comments: OK if only [nit] items remain
```
