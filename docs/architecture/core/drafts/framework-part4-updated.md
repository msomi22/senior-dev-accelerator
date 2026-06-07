# Part 4 - Production Readiness

## Accessibility

WCAG 2.1 AA

Requirements:
- Contrast >= 4.5:1
- Large text >= 3:1
- Touch target >= 44x44 px
- Keyboard navigation 100%
- Screen reader support
- Reduced motion support
- Captions for videos
- Transcript support

## Compliance

Supported:
- GDPR
- COPPA
- FERPA
- LGPD
- PIPL

Requirements:
- parental consent
- export data
- delete account
- audit logs

## Performance Budgets

- Initial JS < 300KB gzip
- TTI < 2.5s on 4G
- TTI < 5s on 3G
- Lesson load < 1.5s
- Exam load < 1s

## Testing

Coverage:
- Engine >= 85%
- UI >= 70%

Required:
- unit tests
- integration tests
- E2E tests
- accessibility tests
- visual regression

## Infrastructure

Availability:
- 99.9% uptime

Recovery:
- RPO <= 15 min
- RTO <= 1 hour

## Security

- RBAC
- MFA
- TLS 1.3
- AES-256
- audit logs
