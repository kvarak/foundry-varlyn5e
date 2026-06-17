# Changelog

All notable changes to the Varlyn D&D 5e system for Foundry VTT will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

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
