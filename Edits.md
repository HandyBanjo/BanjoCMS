# BanjoCMS MVP - AI Execution Directives

**Context for AI:** You are resolving critical bugs and feature gaps for a custom CMS built with Next.js and Supabase. Execute the following tasks strictly according to the acceptance criteria. Do not introduce new dependencies unless absolutely necessary. Prioritize performance, data safety, and Next.js best practices (e.g., proper SSR vs. Client Component boundaries).

## P0: Critical Blockers

### 1. Rich Text Editor Crash (Client-Side Exception)
* [cite_start]**Affected Routes:** `/admin/blog/new`, `/admin/press/new`, `/admin/resources/new`, `/admin/updates/new`, and all corresponding edit routes[cite: 5, 26, 15, 20].
* [cite_start]**Current Behavior:** The application crashes immediately upon load with: "Application error: a client-side exception has occurred."[cite: 7, 119].
* **AI Task:** 1. Audit the rich text editor component for Next.js SSR/hydration mismatches. 
    2. [cite_start]Ensure the editor component is dynamically imported with `{ ssr: false }` or properly wrapped with `'use client'` if it relies on browser APIs like `window` or `document`[cite: 104].
    3. [cite_start]Add a loading state skeleton while the editor initializes[cite: 124].
    4. [cite_start]Implement an Error Boundary to catch component-level crashes and display a fallback UI with a retry mechanism instead of a total page crash[cite: 122, 125].

### 2. Social Feed Image Preview Failure
* [cite_start]**Affected Route:** `/admin/feed/new`[cite: 39, 42].
* [cite_start]**Current Behavior:** Pasting a valid image URL into the "Image URL" field shows a "broken file" icon instead of rendering the preview[cite: 40].
* **AI Task:** Fix the `onBlur` or `onChange` logic for the image URL input. [cite_start]Validate the URL structure and implement an `onError` fallback on the `<img />` tag to display a placeholder image if the link is broken[cite: 106].

---

## P1: Core Features & Data Safety

### 3. Implement Soft Delete (Trash System)
* [cite_start]**Affected Modules:** All content lists (Blog, Press, Resources, etc.)[cite: 170].
* [cite_start]**Current Behavior:** Clicking delete causes permanent, irreversible data loss without confirmation[cite: 170, 201].
* **AI Task:**
    1. **Supabase:** Add a `deleted_at` timestamp column to the relevant tables. Update read queries to filter `deleted_at IS NULL`.
    2. [cite_start]**UI:** Change the primary "Delete" button to perform a soft delete (update `deleted_at`)[cite: 210, 211].
    3. [cite_start]**UI:** Add a confirmation modal before triggering the soft delete: "Are you sure you want to delete this article? This action can be undone from Trash."[cite: 214].
    4. [cite_start]**Feature:** Create a "Trash" or "Archived" view where users can restore items or "Delete Permanently"[cite: 212, 216]. 

### 4. Read-Only Content Views
* [cite_start]**Affected Modules:** Blog and Press list views[cite: 132].
* [cite_start]**Current Behavior:** No independent view/preview option exists; users can only edit or delete[cite: 134, 162, 163]. [cite_start]Titles render as plain text[cite: 161].
* **AI Task:**
    1. [cite_start]Wrap the item titles in Next.js `<Link>` components routing to a read-only preview page[cite: 166].
    2. [cite_start]Add a "View" or "Preview" icon in the Actions column next to Edit and Delete[cite: 167].

### 5. Setup Cron jobs that keeps the database active. 
---

## P2: Media Optimization & Guardrails

### 5. Supabase Media Upload Optimization
* [cite_start]**Affected Modules:** Media Feed / General Uploads[cite: 34].
* [cite_start]**Current Data:** 2MB takes ~5s, 6MB takes ~12.8s, 15MB takes ~14s, and 50MB crashes the application[cite: 233].
* **AI Task:**
    1. [cite_start]**Client-Side:** Implement an image compression library (like `browser-image-compression`) before pushing to Supabase to reduce latency[cite: 105].
    2. **Validation:** Implement a strict 5MB client-side file size limit. [cite_start]If a user selects a file > 5MB, block the upload and display a toast error[cite: 240, 242].

---

## P3: UI / Copy Fixes

### 6. Typo Correction
* [cite_start]**Affected Route:** `/admin/settings`[cite: 69, 73].
* [cite_start]**Current Behavior:** The section header reads "Generai Site Information"[cite: 70, 85].
* [cite_start]**AI Task:** Update the text to "General Site Information"[cite: 71].
