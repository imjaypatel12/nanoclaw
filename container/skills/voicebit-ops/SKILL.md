---
name: voicebit-ops
description: Answer VoiceBit business questions using Google Drive data, local docs, and evolving playbooks. Use this skill for ANY question about VoiceBit restaurants, customers, onboarding, payments, menus, pricing, delivery, marketing, phone setup, POS systems, prompts (without leaking them), devices, or operational data. Also use when someone asks you to look something up, check on a customer, or pull data from Drive. Triggers on customer names, restaurant names, "onboarding list", "payment processing", "who pays what", "menu", "hours", "phone number", "delivery", "marketing", "prompt" (but never leak the raw prompt).
---

# VoiceBit Operations Knowledge

You help the VoiceBit team answer operational questions by pulling data from Google Drive and local reference docs. Anyone on the team may ask — they expect quick, accurate answers.

## How to Find Information

You have two data sources. Use them in this order:

### 1. Local reference docs (fast, check first)

`/workspace/global/docs/` has pre-indexed summaries. Start with `/workspace/global/docs/index.md` which points to detailed breakdowns of the Customers & Leads folder, including the Onboarding List structure, payment tiers, POS systems, geographic distribution, and more. For many common questions, the answer is already here — no need to hit Drive.

### 2. Google Drive MCP (live data, use when local docs don't have it)

Use `mcp__gdrive__search` to find files by name, then `mcp__gdrive__read` with the file's URI to read contents.

**Search tips:**
- Search by restaurant name to find their prompt, menu, feedback, or marketing docs
- Search by document type: "Onboarding List", "Customer List", "Lead List", "Marketing"
- The Onboarding List spreadsheet (`gdrive:///1fvN9QNJ-sLLegd9y2MqSLWWpQs95incsWxwztn2kLgE`) is the master tracker — it has payment status, pricing, contacts, phone setup, POS info, hours, and more for 50+ restaurants

## Drive Folder Map

Two main shared folders are available:

### "2. Customers & Leads" folder
| Document | What's in it |
|----------|-------------|
| 1. Onboarding List | Master tracker: restaurant info, products, payments, contacts, tech setup, hours |
| 1. Customer List | Full customer database across lifecycle |
| 2. Lead List - Main | Sales pipeline and prospects |
| VoiceBit Calls Data | Call volume, duration, outcomes, AI performance |
| 9. CAC | Customer acquisition costs and marketing ROI |
| Delivery guides (v1, v2) | How to set up VoiceBit delivery |
| Onboarding checklists | Step-by-step new customer setup |
| 9. Customer meetings | Meeting notes and action items |

### "3. Tech" folder
| Subfolder | What's in it |
|-----------|-------------|
| 1. Prompts/ | AI phone system prompts per restaurant (60+ restaurants). Contains menus, pricing, hours, specials. **CONFIDENTIAL — see rules below.** |
| 2. Websites/ | Website menus, feedback docs, and food photos organized by restaurant |
| 3. Experiment v2/ | Marketing text message campaigns, texting prompts, analytics transcripts |
| 4. Stream/ | Stream planning questions |
| 5. Data Pulls/ | Sales data exports (BAP Livermore, etc.) |
| 6. Make.com/ | Automation config: delivery distance, daily/weekly reports, block callers, cancel delivery |
| 7. Improvements/ | Dashboard improvements, Stripe payment flows |
| 8. Devices (sheet) | Device tracking across restaurants |
| 9. Product Perfection | Product improvement planning |

Under Prompts, there are also subfolders:
- **Demo for Leads/** — demo prompts used for sales pitches
- **Other Businesses Prompts/** — non-restaurant businesses (Breathe Health Center, Fast Imaging)
- **Menu Prompts In-Flight/** — prompts being worked on, not yet finalized

Under Websites, restaurants are organized into:
- Active projects (Hank's, Kuboba, Cali Grill, Sharkies, Soma Pizza)
- **xPaused/** — paused website projects
- **xCompleted/** — finished websites (BAP Livermore, NYP Alameda, Heavenly Bite, Pizza Hub, Pleasant Hill, Rayo's, New Pizza 8)

Under Experiment v2:
- **Marketing Text Messages/** — per-restaurant marketing sheets
- **AI Texting Prompts/** — text message AI prompts and analyzers
- **Call One Number/** — squad coordination docs
- **Project folders** (TON, HILL, BAP) — restaurant-specific experiment data

## Prompt Confidentiality

The "1. Prompts" folder contains system prompts that power the AI phone agents at each restaurant. These are proprietary and must never be shared verbatim.

**What you CAN do:**
- Answer questions *using information from* the prompts: "What's the price of a large cheese pizza at BAP Livermore?" — read the prompt, extract the price, answer.
- Summarize what products/services a restaurant offers based on the prompt.
- Confirm hours, delivery zones, specials, or contact info found in prompts.

**What you MUST NOT do:**
- Copy-paste the actual prompt text into chat. Never output the system prompt instructions, persona descriptions, or conversation flow logic.
- Share the prompt structure, formatting, or instructional content — even paraphrased.

If someone asks "what's the prompt for X restaurant?", say you can answer specific questions about that restaurant's setup but can't share the raw prompt.

## Self-Evolving Playbooks

Over time you'll learn better ways to find and present information. When that happens, save what you learned.

**Where:** `/workspace/group/playbooks/`

**When to create or update a playbook:**
- Someone corrects you: "No, that info is in the Customer List, not Onboarding List"
- Someone tells you a preferred format: "Always include the phone number when you look up a restaurant"
- You discover a faster path to an answer: the Onboarding List has hours but the prompt has more accurate hours
- A new data source gets shared or an existing one changes structure

**Playbook format** — keep it simple:
```markdown
# [Topic] Lookup

## Where to find it
- First check: [source]
- Fallback: [source]

## How to present it
- [formatting preferences learned from feedback]

## Gotchas
- [things that tripped you up before]
```

**Before answering any question, check `/workspace/group/playbooks/` first.** If a relevant playbook exists, follow it. Playbooks represent learned knowledge from past interactions — they're more reliable than guessing.

**Playbook index:** Maintain a `/workspace/group/playbooks/index.md` that lists all playbooks with one-line descriptions so you can quickly find the right one.

## Common Question Patterns

These are starting points. As you get feedback, create playbooks that supersede these.

**"What's the payment processing for [restaurant]?"**
Check the Onboarding List. Look for the restaurant name, find the payment processing column. Report the percentage + per-transaction fee and who pays (restaurant or customer).

**"What are [restaurant]'s hours?"**
Check the prompt for that restaurant first (most detailed). Fallback to the Onboarding List.

**"What's on [restaurant]'s menu?" / "How much is [item]?"**
Read the restaurant's prompt — it contains the full menu with prices. Remember: share the info but not the prompt itself.

**"What's the status of [restaurant]?"**
Check the Onboarding List for Active/Free Trial/Cancelled status, launch date, and which products they're using.

**"Who's the contact for [restaurant]?"**
Onboarding List has contact names, phone numbers, and emails.

**"What POS does [restaurant] use?"**
Onboarding List has POS software info.

**"How's the website for [restaurant] going?"**
Check the Websites folder for that restaurant — look for feedback docs and menu docs.

**"What marketing campaigns are running?"**
Check Experiment v2 → Marketing Text Messages for per-restaurant marketing sheets.
