# ColorTrace System Architecture

## 1. Project

ColorTrace is a digital companion for field drug testing.

The system works alongside existing colorimetric field-test kits. It uses a smartphone camera, a printed reference colour card, computer vision, colour correction, machine learning refinement, and cryptographic integrity mechanisms.

The system produces a presumptive field-test result:

- Positive
- Negative
- Inconclusive

The result is not a replacement for laboratory confirmation.

---

## 2. High-Level Architecture

ColorTrace consists of four major application areas:

1. Mobile Application
2. Shared Backend
3. Desktop/Supervisor Application
4. Supporting Processing and Integrity Components

Architecture:

Mobile Application
        |
        | HTTPS REST API
        v
+-----------------------------+
|       Shared Backend        |
|          NestJS             |
+-----------------------------+
        |
        +-------------------+
        |                   |
        v                   v
   PostgreSQL          Object Storage
                         MinIO/S3
        |
        v
 Blockchain Integrity Layer

Desktop/Electron Application
        |
        | HTTPS REST API
        v
     Shared Backend

---

## 3. Important Architecture Rule

There is ONE shared NestJS backend.

The project must NOT create separate backend servers for mobile and desktop.

Both the mobile application and desktop application communicate with the same backend API.

Girija owns mobile-facing backend modules.

Deva Dharshini owns backend core, records, integrity, blockchain, storage, and administrative modules.

Both developers work inside the same `backend/` project.

---

## 4. Repository Structure

```text
ColorTrace/
│
├── mobile/
├── backend/
├── desktop/
├── color-engine/
├── computer-vision/
├── data/
├── docs/
│
├── README.md
├── .gitignore
└── docker-compose.yml