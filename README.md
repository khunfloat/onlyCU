# OnlyCU — Keep It Chula. Keep It Anonymous.

**Stateless | Anonymous | Auditable**

OnlyCU is a privacy-first authentication gateway for Chulalongkorn University students.  
It verifies `@student.chula.ac.th` emails via **Google OpenID Connect** and issues **short-lived cryptographic tokens** with no personal identifiers.

No databases. No tracking. Just cryptographic receipts.

## ✨ Features

- **Anonymous by design**  
  Tokens only include `iat` (issued at) and `exp` (expiry).  
  No email, subject, or user identifier.

- **Chula-only gate**  
  Authentication is restricted to verified `@student.chula.ac.th` emails.

- **Stateless & simple**  
  No databases, no sessions. Tokens are HMAC-signed and expire quickly.

- **Open source & auditable**  
  All code is public and verifiable. Transparency by default.

## 📜 License

MIT — free to use, fork, and audit.
