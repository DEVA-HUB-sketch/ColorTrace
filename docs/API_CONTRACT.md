# ColorTrace API Contract

## 1. Purpose

This document defines the communication contract between the ColorTrace clients and the ONE shared NestJS backend.

Clients:

- Mobile Application
- Desktop/Electron Application

Backend:

- NestJS

Infrastructure:

- PostgreSQL
- MinIO/S3-compatible object storage
- Blockchain integrity layer

All clients must follow this API contract.

---

# 2. Base URL

Development:

```text
http://localhost:3000/api