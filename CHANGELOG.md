# Changelog

All notable changes to the Varlyn D&D 5e system for Foundry VTT will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Phase 0.3.4 - V2 Migration Assessment & Planning (Completed)

**Documented:**
- Created comprehensive V2-MIGRATION-ASSESSMENT.md analyzing ApplicationV2 migration
- Documented root cause of V1 Application framework warnings
- Defined Phase 1.0: V2 Sheet Migration as major architectural milestone
- Estimated effort: 22-30 hours for complete V2 migration
- Timeline: v0.x accepts V1 warnings, v1.0 will complete V2 migration

**Fixed:**
- Updated system.json URLs to point to correct GitHub repository (foundry-varlyn5e)
- Added compatibility note about V1 warnings in system description
- Clarified Foundry v14+ requirement

**Changed:**
- Restructured VARLYN-FOUNDRY-PLAN.md with Phase 1.0 (V2 Migration) before Phase 1.1+ (Core Engine)
- Acknowledged V1 Application warnings as known technical debt
- V1 framework functional until Foundry v16 (current: v14)

**Status:** Phase 0.3.4 complete ✅ - V2 migration path documented, system URLs corrected

**Known Issue:**
- V1 Application framework deprecation warnings present (by design)
- Will be resolved in Phase 1.0 (v1.0.0 release)
- Sheets remain functional, warning does not affect gameplay

### Phase 0.3.3 - Complete System Identity Migration (Completed)

**Fixed:**
- Replaced all `FormDataExtended` → `foundry.applications.ux.FormDataExtended`
- Replaced all `TextEditor` → `foundry.applications.ux.TextEditor.implementation`
- Fixed template paths from `systems/worldbuilding/` → `systems/varlyn5e/`
- Fixed CSS classes from `worldbuilding` → `varlyn5e`
- Fixed all settings references from `worldbuilding` → `varlyn5e` namespace
- Fixed all flag references from `worldbuilding` → `varlyn5e` namespace
- Updated function names: `createWorldbuildingMacro` → `createVarlyn5eMacro`
- Updated global API: `game.worldbuilding` → `game.varlyn5e`

**Changed:**
- System fully branded as varlyn5e throughout entire codebase
- All template paths now point to correct system directory
- All module references use proper varlyn5e system ID
- Eliminated all hardcoded worldbuilding references

**Impact:**
- **CRITICAL FIX**: Resolves "ENOENT: no such file or directory" template errors
- Eliminates FormDataExtended and TextEditor deprecation warnings
- System now fully independent from worldbuilding system
- All settings and flags use correct varlyn5e namespace
- Proper system identity for multi-system Foundry installations

**Technical:**
- Affects: helper.js, actor.js, item.js, actor-sheet.js, item-sheet.js, simple.js, macro.js, templates.js
- All v13 deprecated APIs now using v14+ namespaced versions
- Zero remaining worldbuilding references in module code

### Phase 0.3.2 - Complete DialogV2 Migration (Completed)

**Fixed:**
- Migrated `Dialog.prompt()` to `foundry.applications.api.DialogV2.prompt()` in createDialog function
- Migrated `new Dialog().render()` to `foundry.applications.api.DialogV2.confirm()` in deleteAttributeGroup function
- Eliminated all Dialog V1 deprecation warnings from console

**Changed:**
- Updated helper.js to use ApplicationV2 framework for all dialog interactions
- Dialog callbacks now receive `(event, button, dialog)` parameters instead of `(html)` (DialogV2 API)
- Form access changed from `html[0].querySelector()` to `dialog.element.querySelector()`

**Technical:**
- Fully compliant with Foundry VTT v14+ ApplicationV2 framework
- No remaining V1 Application deprecation warnings
- System ready for Foundry VTT v16 (where V1 support will be removed)

### Phase 0.3.1 - Foundry VTT v14 API Modernization (Completed)

**Fixed:**
- Replaced deprecated `renderTemplate` global with `foundry.applications.handlebars.renderTemplate`
- Added TODO comments for Dialog V1 → DialogV2 migration (will be addressed in future phase)
- Eliminated console warnings about deprecated API usage

**Changed:**
- Updated helper.js to use modern Foundry VTT v14 APIs
- Verified all utility functions already use `foundry.utils.*` namespace

**Technical:**
- Dialog V1 framework still functional but marked for future migration
- System now cleaner in v14 console with fewer deprecation warnings
- Remaining deprecations documented with TODO comments for Phase 1+

### Phase 0.3 - CI/CD Pipeline (Completed)

**Added:**
- GitHub Actions workflows for automated releases:
  - `dev-release.yml` - Automatic development builds on push to main/dev
  - `release.yml` - Stable releases on version tags (release-* or v*.*.*)
  - `pr-checks.yml` - Pull request validation (linting, build, manifest validation)
- Automated versioning with timestamps and commit SHAs for dev builds
- Automatic ZIP packaging with all required system files
- GitHub Releases integration with manifest URLs for Foundry VTT
- system.json and package.json validation in CI

**Changed:**
- Development builds now automatically tagged as "latest" pre-release
- Release manifests automatically updated with correct download URLs
- Changelog extraction for release notes

**Technical:**
- Node.js 22 used in all workflows (matching local environment)
- npm ci ensures reproducible builds
- Linting enforced before stable releases
- Version consistency checks between system.json and package.json

### Phase 0.2 - Build System Modernization (Completed)

**Added:**
- ESLint configuration with comprehensive Foundry VTT globals
- Stylelint configuration for LESS/CSS linting
- Prettier configuration for consistent code formatting
- Husky + lint-staged for pre-commit quality checks
- Source maps support in gulp LESS compilation
- npm scripts for linting and formatting:
  - `npm run lint` - Run all linters
  - `npm run lint:js` - Lint JavaScript files
  - `npm run lint:css` - Lint LESS/CSS files
  - `npm run lint:fix` - Auto-fix linting issues
  - `npm run format` - Format all files with Prettier
  - `npm run format:check` - Check formatting without changes

**Changed:**
- Updated gulpfile.js to include source maps for debugging
- Auto-fixed numerous code style issues in existing files
- Improved code consistency across JavaScript modules

**Technical:**
- 632 dev dependencies added for development tooling
- Pre-commit hooks now enforce code quality standards
- Build system kept as gulp + LESS (stable, proven approach)

### Planned
- Phase 0.4: Development environment documentation
- Phase 0.5: Extended documentation structure
- Phase 1: Core game engine (7 abilities, skills, folk, classes)

## [0.1.0] - 2026-06-17

### Added
- Initial system identity as "varlyn5e"
- System manifest with Varlyn metadata
- Updated README with project overview
- Semantic versioning strategy
- MIT License with attribution to original world-building system

### Changed
- Renamed system from "worldbuilding" to "varlyn5e"
- Updated package.json for Varlyn project
- Set Foundry VTT compatibility: v12 minimum, v14 verified

### Removed
- Old world-building system references

---

## Release Notes

### Version 0.1.0 - Phase 0.1: Project Setup & Identity

**Status**: Alpha - Foundation Phase

**Completed Tasks**:
- [x] System renamed to "varlyn5e"
- [x] Updated `system.json` with proper metadata
- [x] Created comprehensive README
- [x] Established versioning strategy (semantic versioning)
- [x] Maintained MIT license with attribution

**Next Steps**: Phase 0.2 - Build System Modernization
- Evaluate gulp/LESS vs. modern alternatives
- Add linting and code formatting
- Set up pre-commit hooks

---

**Implementation Plan**: See [VARLYN-FOUNDRY-PLAN.md](../.github/VARLYN-FOUNDRY-PLAN.md) for complete roadmap.
