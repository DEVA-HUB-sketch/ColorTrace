# ColorTrace Development Rules

## 1. Purpose

This document defines the development rules for the ColorTrace team.

All team members must follow these rules to keep the four development areas compatible with the shared ColorTrace architecture.

---

# 2. Project Architecture Rule

ColorTrace consists of:

```text
Mobile Application
       |
       v
ONE Shared NestJS Backend
       |
       +---- PostgreSQL
       |
       +---- Object Storage
       |
       +---- Blockchain
       |
       v
Desktop/Electron Application