# Architecture - Varlyn D&D 5e System

**System:** `varlyn5e`
**Foundry VTT:** v12+ (v14 verified, v14 maximum)
**Version:** 0.1.0

---

## Overview

The Varlyn D&D 5e system is a clean-build Foundry VTT game system implementing the Varlyn homebrew rules for D&D 5e. It is derived from the [Simple World-Building](https://gitlab.com/foundrynet/worldbuilding) system and progressively extended to implement Varlyn-specific mechanics.

**Design Principles:**

1. **Varlyn-first:** Only implement mechanics that Varlyn rules need — no SRD baggage
2. **Modern APIs:** Use Foundry v14+ namespaced APIs throughout
3. **Separation of concerns:** Data model, templates, and logic kept distinct
4. **Maintainability:** Clear code with consistent conventions

---

## System Entry Point

```
system.json          ← Foundry manifest (id, title, scripts, styles, packs)
module/simple.js     ← Main entry point (Hooks.once("init"), Hooks.once("ready"))
```

**Initialization flow:**

```
Foundry loads system.json
  → Registers CSS (styles/simple.css)
  → Loads module/simple.js
      → Hooks.once("init") fires
          → CONFIG.Actor.documentClass = SimpleActor
          → CONFIG.Item.documentClass = SimpleItem
          → Actors.unregisterSheet("core", ActorSheet)
          → Actors.registerSheet("varlyn5e", SimpleActorSheet)
          → Items.unregisterSheet("core", ItemSheet)
          → Items.registerSheet("varlyn5e", SimpleItemSheet)
          → game.settings.register("varlyn5e", ...)
          → Templates pre-loaded
      → Hooks.once("ready") fires
          → game.varlyn5e API exposed
          → Hotbar macros configured
```

---

## Module Structure

```
module/
├── simple.js          # Entry point: init hooks, sheet registration, settings
├── actor.js           # SimpleActor extends Actor
├── item.js            # SimpleItem extends Item
├── actor-sheet.js     # SimpleActorSheet extends ActorSheet (V1, Phase 1.0 will migrate)
├── item-sheet.js      # SimpleItemSheet extends ItemSheet  (V1, Phase 1.0 will migrate)
├── helper.js          # EntitySheetHelper: generic attribute/group management
├── templates.js       # Pre-loads all Handlebars templates
├── macro.js           # createVarlyn5eMacro: hotbar drag-drop
└── token.js           # SimpleToken extends TokenDocument
```

---

## Application Framework

> ⚠️ **Known Technical Debt:** Sheets currently use V1 Application framework.
> Migration to ApplicationV2 is planned for Phase 1.0 (v1.0.0).

### Current (V1) — v0.x

```
SimpleActorSheet
  extends ActorSheet
  extends DocumentSheet
  extends FormApplication
  extends Application  ← V1 framework
```

### Planned (V2) — v1.0.0

```
SimpleActorSheet
  extends foundry.applications.api.DocumentSheetV2  ← ApplicationV2
```

**See:** `V2-MIGRATION-ASSESSMENT.md` for full migration analysis.

### V1 → V2 Key Differences

| Concept          | V1 (current)              | V2 (planned)                            |
| ---------------- | ------------------------- | --------------------------------------- |
| Data preparation | `getData()`               | `_prepareContext()`                     |
| Event binding    | `activateListeners(html)` | `_onRender()`, `_attachPartListeners()` |
| Form submission  | `_updateObject()`         | `_onSubmit()`, `_processFormData()`     |
| DOM selection    | jQuery `html.find()`      | Native `this.element.querySelector()`   |
| Template parts   | Single template           | Multi-part templates                    |

---

## Data Model

### Actor Data

Actors use Foundry's flexible `system` object populated from `template.json`:

```json
{
  "system": {
    "biography": "",
    "attributes": {
      "customAttr": {
        "label": "Attribute Name",
        "dtype": "String|Number|Boolean|Formula",
        "value": ""
      }
    },
    "groups": {
      "groupName": {
        "label": "Group Label"
      }
    }
  }
}
```

**Current state:** Generic world-building attributes (inherited from base system)
**Planned (Phase 1.1+):** Varlyn-specific schema with abilities, skills, folk, class

### Item Data

Items follow the same flexible pattern:

```json
{
  "system": {
    "description": "",
    "attributes": { ... },
    "groups": { ... }
  }
}
```

**See:** [docs/DATA-MODEL.md](DATA-MODEL.md) for planned Varlyn data schemas.

---

## EntitySheetHelper

`helper.js` provides the core generic attribute system inherited from Simple World-Building. Key methods:

| Method                                       | Purpose                                         |
| -------------------------------------------- | ----------------------------------------------- |
| `getAttributeData(data)`                     | Flatten attribute structure for sheet rendering |
| `onSubmit(event, actor, formData)`           | Process attribute changes on form submit        |
| `onClickAttributeControl(actor, event)`      | Handle add/delete attribute buttons             |
| `onClickAttributeGroupControl(actor, event)` | Handle add/delete group buttons                 |
| `onClickRoll(actor, event)`                  | Handle clickable roll formulas                  |

This helper will be refactored during Phase 1.1+ as Varlyn-specific data model replaces the generic attribute system.

---

## Template System

Templates are Handlebars (`.html`) files pre-loaded at init:

```
templates/
├── actor-sheet.html            # Full actor character sheet
├── item-sheet.html             # Full item sheet
└── parts/
    ├── sheet-attributes.html   # Attribute table (reused by both sheets)
    └── sheet-groups.html       # Attribute group table
```

**Template path format:** `systems/varlyn5e/templates/...`

---

## Build System

```
Gulp + LESS
  src:  styles/simple.less
  out:  styles/simple.css + styles/simple.css.map
```

**Gulp tasks:**

- `compileLESS` — Compile LESS to CSS with source maps
- `watchUpdates` — Watch LESS files and recompile on change
- `css` (alias) — Run `compileLESS` once
- `watch` (alias) — Run `compileLESS` then `watchUpdates`
- `default` — Run `compileLESS` then `watchUpdates` (same as watch)

---

## Settings

Registered settings (`game.settings.register("varlyn5e", key, ...)`):

| Key              | Type    | Default | Description                        |
| ---------------- | ------- | ------- | ---------------------------------- |
| `macroShorthand` | Boolean | true    | Enable `@attr` shorthand in macros |

---

## Localization

All user-facing strings go through `lang/en.json`:

```javascript
// ✅ Use localization
game.i18n.localize("varlyn5e.AttributeCreate");

// ❌ Avoid hardcoded strings
("Create Attribute");
```

---

## CI/CD Pipeline

```
.github/workflows/
├── dev-release.yml   # Auto-release on push to main/dev
├── release.yml       # Stable release on tag release-*
└── pr-checks.yml     # Lint + build check on PRs
```

**Node.js version:** v22 (matching local dev requirement)

---

## Phase Roadmap Summary

| Phase       | Focus                                               | Status      |
| ----------- | --------------------------------------------------- | ----------- |
| 0.1         | System identity (varlyn5e)                          | ✅ Complete |
| 0.2         | Build system (Gulp, ESLint, Prettier, Husky)        | ✅ Complete |
| 0.3         | CI/CD pipeline (GitHub Actions)                     | ✅ Complete |
| 0.3.1-0.3.3 | API modernization + identity migration              | ✅ Complete |
| 0.3.4       | V2 migration assessment                             | ✅ Complete |
| 0.4         | Development environment                             | ✅ Complete |
| 0.5         | Documentation structure                             | ✅ Complete |
| 1.0         | ApplicationV2 sheet migration                       | ⏳ Planned  |
| 1.1         | Core game engine (abilities, skills, folk, classes) | ⏳ Planned  |
| 2           | Combat & equipment                                  | ⏳ Planned  |
| 3           | Character sheet & UI                                | ⏳ Planned  |
| 4           | Compendiums & content                               | ⏳ Planned  |
| 5-7         | Advanced features, polish, community                | ⏳ Planned  |

**Full plan:** [VARLYN-FOUNDRY-PLAN.md](../.github/VARLYN-FOUNDRY-PLAN.md)
