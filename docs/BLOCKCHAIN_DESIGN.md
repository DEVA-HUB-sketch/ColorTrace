# ColorTrace Blockchain Design

## 1. Purpose

ColorTrace uses blockchain as an additional integrity and provenance layer for field-test evidence.

Blockchain is not used as a cryptocurrency feature.

The primary evidence system remains:

- PostgreSQL
- SHA-256
- digital signatures
- previous-record hash chains
- object storage

Blockchain provides an additional externally verifiable anchoring mechanism.

---

# 2. Architecture

The blockchain is backend-managed.

The architecture is:

```text
Mobile Application
        |
        | HTTPS
        v
Shared NestJS Backend
        |
        v
Blockchain Service
        |
        v
Blockchain Network