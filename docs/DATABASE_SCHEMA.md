# ColorTrace Database Schema

## 1. Purpose

This document defines the shared PostgreSQL database structure for ColorTrace.

The database is accessed only by the shared NestJS backend.

Mobile and desktop applications must never connect directly to PostgreSQL.

---

## 2. Database Technology

Database:

PostgreSQL

ORM:

Prisma

The Prisma schema is located at:

```text
backend/prisma/schema.prisma