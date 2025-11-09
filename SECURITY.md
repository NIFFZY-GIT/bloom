# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |

## Reporting a Vulnerability

If you discover a security vulnerability within Bloom Travel, please send an email to contactus@zevarone.com. All security vulnerabilities will be promptly addressed.

Please include:
- Description of the vulnerability
- Steps to reproduce
- Potential impact
- Suggested fix (if any)

## Security Measures

### Authentication
- Passwords hashed with bcrypt (10 rounds)
- JWT tokens for session management
- NextAuth.js for secure authentication
- Google OAuth support

### Database
- Parameterized queries (SQL injection protection)
- Connection pooling with timeout
- Encrypted connections in production

### API Security
- CORS configuration
- Request validation
- Rate limiting (recommended for production)
- Secure headers (X-Frame-Options, CSP, etc.)

### Data Protection
- Environment variables for secrets
- No hardcoded credentials
- Secure password reset flow
- Email verification codes (10-minute expiration)

### Best Practices
- Regular dependency updates
- Security headers enabled
- HTTPS enforcement in production
- Input validation and sanitization
- Error messages don't expose sensitive info

## Deployment Security

### Required
- [ ] HTTPS/SSL enabled
- [ ] Environment variables secured
- [ ] Database uses strong passwords
- [ ] Secrets are 32+ characters
- [ ] No `.env` files committed to Git

### Recommended
- [ ] Enable rate limiting
- [ ] Configure WAF (Web Application Firewall)
- [ ] Set up monitoring and alerts
- [ ] Regular security audits
- [ ] Implement 2FA for admin accounts

## Contact

For security concerns: contactus@zevarone.com
