# Contributing to Varlyn D&D 5e System

Thank you for your interest in contributing to the Varlyn D&D 5e Foundry VTT system! This guide covers everything you need to know to contribute effectively.

## Getting Started

### Prerequisites

- Foundry VTT v12+ installed locally (v14 recommended)
- Node.js v22.x and npm v10+
- Git
- VS Code (recommended)

### Setup

1. Fork the repository on GitHub
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR_USERNAME/foundry-varlyn5e.git
   cd foundry-varlyn5e
   ```
3. Install dependencies:
   ```bash
   npm install
   ```
4. Symlink to Foundry VTT (see [DEVELOPMENT.md](DEVELOPMENT.md#symlink-to-foundry))
5. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Workflow

See [DEVELOPMENT.md](DEVELOPMENT.md) for full local setup instructions.

**Quick reference:**

```bash
npm run css        # Compile LESS to CSS
npm run watch      # Watch mode (auto-compile on save)
npm run lint       # Run all linters
npm run format     # Format code with Prettier
```

## Code Standards

### JavaScript

- **Style:** Follow the project's ESLint configuration (`.eslintrc.json`)
- **Modules:** Use ES module syntax (`import`/`export`)
- **Naming:** camelCase for variables/functions, PascalCase for classes
- **APIs:** Use Foundry v14+ namespaced APIs (e.g. `foundry.utils.*`, not global shorthands)
- **No jQuery:** Use modern DOM APIs in new code

**Examples:**

```javascript
// ✅ Good - namespaced API
const data = foundry.utils.duplicate(original);
const tmpl = await foundry.applications.handlebars.renderTemplate(path, data);

// ❌ Avoid - deprecated globals
const data = duplicate(original);
const tmpl = await renderTemplate(path, data);
```

### LESS / CSS

- **Style:** Follow the project's Stylelint configuration
- **Variables:** Use CSS custom properties for theme values
- **Selectors:** Scope to `.varlyn5e` system root to avoid conflicts
- **Organization:** Group by component, use comments for sections

**Example:**

```less
.varlyn5e {
  // Character sheet root scope
  .sheet-header {
    // Header styles
  }
}
```

### Handlebars Templates

- Use Handlebars helpers from Foundry's API
- Keep logic minimal in templates — move complexity to `getData()`
- Use semantic HTML with ARIA attributes for accessibility

### Commit Messages

Use [Conventional Commits](https://www.conventionalcommits.org/) format:

```
feat: Add hierarchical skill tree UI
fix: Correct skill point calculation for multiclass
docs: Update DEVELOPMENT.md with build process
style: Format CSS for character sheet
refactor: Simplify folk data model
test: Add unit tests for weapon groups
chore: Update dependencies
```

**Scopes (optional):**

```
feat(skills): Add skill tree purchase validation
fix(actor-sheet): Fix attribute deletion on nested objects
docs(api): Document EntitySheetHelper methods
```

## Branch Strategy

```
main        ← stable releases only
dev         ← active development
feature/*   ← new features (branch from dev)
bugfix/*    ← bug fixes (branch from dev)
release/*   ← release candidates (branch from dev)
```

**Always branch from `dev`**, not `main`:

```bash
git checkout dev
git pull origin dev
git checkout -b feature/my-feature
```

## Pull Request Process

1. **Ensure your branch is up to date:**

   ```bash
   git rebase origin/dev
   ```

2. **Run quality checks:**

   ```bash
   npm run lint
   npm run format:check
   npm run css
   ```

3. **Test manually in Foundry VTT:**
   - Actor creation and editing
   - Item creation and editing
   - No console errors
   - Styles applied correctly

4. **Submit PR to `dev` branch** (not `main`)

5. **PR description should include:**
   - What change was made and why
   - How to test the change
   - Screenshots for UI changes
   - Breaking changes noted

6. **Automated CI checks must pass:**
   - ESLint
   - Stylelint
   - Build verification

## Areas for Contribution

### Good First Issues

- Localization improvements (`lang/en.json`)
- Documentation fixes and improvements
- Bug fixes with clear reproduction steps
- CSS polish and accessibility improvements

### Larger Contributions

- Folk/class data in compendiums (`packs/_source/`)
- New UI features (check the roadmap in [VARLYN-FOUNDRY-PLAN.md](../.github/VARLYN-FOUNDRY-PLAN.md))
- Test coverage improvements
- Build system enhancements

### Content Contributions

**Adding Folk:**

- Source of truth: `dnd/docs/_Folk/*.md` at [dnd.rigo.nu](https://dnd.rigo.nu)
- Follow existing patterns in `packs/_source/varlyn-folk/`
- Include all subtypes and class modifications

**Adding Classes:**

- Source of truth: `dnd/docs/_Classes/*.md` at [dnd.rigo.nu](https://dnd.rigo.nu)
- Follow existing patterns in `packs/_source/varlyn-classes/`
- Include archetypes and progression table

## Project Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for detailed architecture documentation.

**Quick summary:**

- `module/` — JavaScript source (actor, item, sheets, helper)
- `styles/` — LESS source → compiled CSS
- `templates/` — Handlebars HTML templates
- `lang/` — Localization strings
- `packs/` — Compendium source data

## Reporting Issues

- **Bugs:** Use the [GitHub issue tracker](https://github.com/kvarak/foundry-varlyn5e/issues)
- **Security:** Contact maintainer privately before public disclosure
- **Questions:** Use [GitHub Discussions](https://github.com/kvarak/foundry-varlyn5e/discussions)

**Bug reports should include:**

- Foundry VTT version
- System version
- Steps to reproduce
- Expected vs. actual behavior
- Browser console errors (F12)

## Varlyn Rules Reference

This system implements the Varlyn homebrew D&D 5e rules. The authoritative source for rules is:
**[dnd.rigo.nu](https://dnd.rigo.nu)**

When implementing game mechanics, always verify against the rules site, not this codebase or generic D&D 5e SRD.

## License

By contributing, you agree that your contributions will be licensed under the project's [MIT License](LICENSE.txt).
