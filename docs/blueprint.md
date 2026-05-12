# **App Name**: CTM Hub

## Core Features:

- Intelligent Multi-Role Onboarding: Streamlined user registration via Google Auth with mandatory profile enrichment and automated role assignment, integrated with Firestore and Firebase Storage.
- Dynamic Unified Dashboard: A single-route adaptive dashboard displaying conditional widgets and KPI cards tailored specifically to Employee, Manager, HR, and Owner permissions.
- Stealth Employee Directory: Full staff directory featuring custom filtering logic to entirely exclude 'Dev' role users from lists and statistical headcounts for high-level security.
- Tiered Leave Approval Workflow: A formalized request and multi-step validation system (Employee request -> Manager Approval -> HR Validation) for streamlined vacation management.
- Hybrid Weekly Scheduler: A smart 5-day availability calendar for employees to select office presence, featuring an automated reset every Monday morning for weekly tracking.
- Tunisian Payroll Processing: Comprehensive engine for generating French-Tunisian paystubs, calculating Gross Salary, CNSS deductions (9.18%), and specific IRPP tax bracket requirements.
- AI Ticket & Voucher Tool: Generative AI tool designed to analyze employee attendance and automatically propose optimized monthly meal/transport voucher allocations.

## Style Guidelines:

- Primary color: Deep Emerald (#065f46), conveying trust and vitality in a corporate context. Designed for high contrast against a light background.
- Background color: Mint Frost (#ecfdf5), providing a crisp and airy professional workspace aligned with high-end SaaS trends.
- Accent: Vivid Emerald (#10b981), specifically chosen for actionable elements, CTAs, and dashboard status highlights.
- Headline font: 'Space Grotesk' (sans-serif) for a modern, tech-forward aesthetic. Body text: 'Inter' (sans-serif) for neutral, objective legibility of complex payroll data.
- Thin-stroke, minimal line icons that reinforce the agency-style elegance and maintain clarity in high-density data tables.
- Strict modular grid system utilizing white space to segment roles and statistics clearly, with specialized semantic HTML5 structures for SEO.
- Buttery-smooth conditional widget loading and lateral slide transitions for role-based view switching to minimize user cognitive load.