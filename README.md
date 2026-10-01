# Nepali Voice AI Writer

A full-stack AI web application that converts Nepali speech into editable and exportable digital documents.

## Core Flow

Voice
→ Nepali Transcript
→ Safe Cleanup
→ Manual Edit
→ Save
→ DOCX / PDF

## Product Modes

### 1. Exact Dictation
Transcribes the user's speech without rewriting the content.

### 2. Clean Nepali
Improves spelling, grammar, punctuation, and formatting while preserving facts.

### 3. AI Document
Uses user-provided facts to create structured documents such as applications, letters, notices, and drafts.

## Tech Stack

- Next.js App Router
- JavaScript
- Tailwind CSS
- PostgreSQL
- Prisma
- Google Speech-to-Text / OpenAI transcription
- OpenAI text AI

## Core Product Rule

The user's speech/transcript is the source of truth.

The system must never silently invent or change factual information.

## Current Development Phase

Phase 0 — Planning and Setup