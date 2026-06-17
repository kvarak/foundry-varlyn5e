# Development Guide - Varlyn D&D 5e System

## Prerequisites

### Required Software

- **Foundry VTT**: v12+ (v14 verified, v14 maximum)
- **Node.js**: v22.x (matching CI/CD)
- **npm**: v10+ (comes with Node.js)
- **Git**: Latest version

### Recommended Tools

- **VS Code**: With ESLint and Prettier extensions
- **Foundry VTT**: Installed locally (not just hosted)

## Local Development Setup

### 1. Clone Repository

```bash
# Clone the repository
git clone https://github.com/kvarak/foundry-varlyn5e.git

# Navigate to project directory
cd foundry-varlyn5e

# Verify you're on main branch
git branch
```

### 2. Install Dependencies

```bash
# Install npm packages
npm install

# Verify installation
npm list

# Check that dev dependencies installed correctly
ls node_modules | grep -E "gulp|eslint|prettier"
```

### 3. Symlink to Foundry

**Purpose:** Create symbolic link so Foundry VTT loads your development files directly.

**Foundry Data Path:**

- **Linux**: `~/.local/share/FoundryVTT/Data/systems/varlyn5e`
- **macOS**: `~/Library/Application Support/FoundryVTT/Data/systems/varlyn5e`
- **Windows**: `%LOCALAPPDATA%/FoundryVTT/Data/systems/varlyn5e`

**Steps:**

#### On Linux/macOS:

```bash
# Navigate to Foundry systems directory
cd ~/Library/Application\ Support/FoundryVTT/Data/systems  # macOS
# OR
cd ~/.local/share/FoundryVTT/Data/systems                  # Linux

# Remove existing varlyn5e if present
rm -rf varlyn5e

# Create symlink to your development directory
ln -s /absolute/path/to/foundry-varlyn5e varlyn5e

# Verify symlink created correctly
ls -la varlyn5e
```

#### On Windows (PowerShell as Administrator):

```powershell
# Navigate to Foundry systems directory
cd $env:LOCALAPPDATA\FoundryVTT\Data\systems

# Remove existing varlyn5e if present
Remove-Item -Recurse -Force varlyn5e -ErrorAction SilentlyContinue

# Create symlink (replace with actual path)
New-Item -ItemType SymbolicLink -Path varlyn5e -Target "C:\full\path\to\foundry-varlyn5e"

# Verify symlink created correctly
Get-Item varlyn5e | Select-Object *
```

**Verification:**

1. Start Foundry VTT
2. Go to "Game Systems" tab in settings
3. Look for "Varlyn D&D 5e" system
4. Version should match `system.json` (currently 0.1.0)
5. System should show as available to use

### 4. Development Workflow

#### Initial Build

```bash
# Compile CSS from LESS source
npm run css

# Verify styles compiled
ls -la styles/simple.css
```

#### Hot-Reload Setup

After symlink is set up, you can develop with automatic changes:

```bash
# Start watch mode in one terminal
npm run watch

# In another terminal, edit files:
# - Edit src/less files → CSS auto-compiles
# - Edit JavaScript files → No auto-reload needed (just refresh browser)
# - Edit templates → No auto-compile needed (just refresh browser)

# In Foundry VTT browser:
# - Press F5 to refresh after changes
# - Changes appear immediately
```

#### Step-by-Step Workflow

1. **Start development server:**

   ```bash
   cd /path/to/foundry-varlyn5e
   npm run watch
   ```

   Watch mode will now automatically compile LESS to CSS whenever you save.

2. **Edit files in your code editor:**
   - Modify `.less` files in `styles/`
   - Modify `.js` files in `module/`
   - Modify `.html` files in `templates/`

3. **See changes in Foundry VTT:**
   - Refresh browser (F5) after JavaScript/template changes
   - CSS changes appear automatically on next refresh

4. **Test functionality:**
   - Create/edit actors and items
   - Check console for errors (F12)
   - Verify sheets render correctly

## Build Commands

### Development Build

```bash
# Watch mode - automatically recompile LESS on save
npm run watch

# Build CSS only (one-time)
npm run css

# Build everything (one-time)
npm run dev

# Continuous watch for changes
npm run dev
```

### Production Build

```bash
# Full production build (compiles CSS, validates)
npm run build

# Output: `styles/simple.css` compiled with optimizations
```

### Quality Checks

```bash
# Run all linters
npm run lint

# Lint JavaScript only
npm run lint:js

# Lint CSS/LESS only
npm run lint:css

# Auto-fix linting issues
npm run lint:fix

# Format all files with Prettier
npm run format

# Check formatting without changes
npm run format:check
```

## Project Structure

```
foundry-varlyn5e/
├── module/                          # JavaScript source files
│   ├── simple.js                   # Main entry point
│   ├── actor.js                    # Actor document class
│   ├── item.js                     # Item document class
│   ├── actor-sheet.js              # Actor sheet UI
│   ├── item-sheet.js               # Item sheet UI
│   ├── helper.js                   # Utility functions
│   ├── constants.js                # System constants
│   ├── templates.js                # Template registration
│   ├── macro.js                    # Macro functions
│   └── token.js                    # Token customization
├── styles/                          # CSS/LESS stylesheets
│   ├── simple.less                 # Main LESS source
│   ├── simple.css                  # Compiled CSS (generated)
│   └── simple.css.map              # Source map
├── templates/                       # Handlebars templates
│   ├── actor-sheet.html            # Actor character sheet
│   ├── item-sheet.html             # Item sheet
│   └── parts/                      # Template partials
│       ├── sheet-attributes.html
│       └── sheet-groups.html
├── lang/                            # Localization files
│   └── en.json                     # English text
├── system.json                      # System manifest
├── package.json                     # NPM package config
├── gulpfile.js                      # Gulp build configuration
├── .eslintrc.json                   # ESLint configuration
├── .stylelintrc.json                # Stylelint configuration
├── .prettierrc.json                 # Prettier configuration
├── .gitignore                       # Git ignore rules
├── CHANGELOG.md                     # Version history
├── README.md                        # Project README
├── DEVELOPMENT.md                   # This file
└── .vscode/                         # VS Code settings
    ├── settings.json               # Workspace settings
    └── launch.json                 # Debug configurations
```

## Testing Changes

### Quick Test Workflow

1. **Make changes to files**
2. **Compile if needed:**
   ```bash
   npm run css  # If editing LESS
   ```
3. **Refresh Foundry VTT (F5)**
4. **Check browser console (F12)** for errors

### Test Checklist

- [ ] System appears in Game Systems tab
- [ ] Can create a new actor (world)
- [ ] Actor sheet opens without errors
- [ ] Can edit actor properties
- [ ] Can add items to actor
- [ ] Item sheet opens without errors
- [ ] Styles are applied (check dark theme)
- [ ] No console errors (F12)
- [ ] Linting passes: `npm run lint`

### Console Debugging

```bash
# Monitor console in browser (F12)
# Look for:
# - Warnings: [yellow] Deprecated APIs
# - Errors: [red] Runtime errors
# - Info: [blue] System initialization messages

# Test specific functionality by opening console:
game.varlyn5e.SimpleActor  # Check actor class
game.actors                 # List all actors
game.items                  # List all items
```

## Debugging

### VS Code Debugging

If you have VS Code configured with launch.json:

1. Open VS Code to foundry-varlyn5e folder
2. Add breakpoints in code
3. Press F5 to start debugging
4. Debugger attaches to Gulp processes

### Browser Debugging

1. **Open browser DevTools (F12)**
2. **Go to Console tab**
3. **Look for system initialization:**
   ```
   Initializing Varlyn D&D 5e System
   ```
4. **Test in console:**

   ```javascript
   // Check if system loaded
   game.system.id;

   // Check actors
   game.actors.forEach((actor) => console.log(actor.name));

   // Check items
   game.items.forEach((item) => console.log(item.name));

   // Check settings
   game.settings.get("varlyn5e", "macroShorthand");
   ```

### Common Issues

| Issue                             | Solution                                                           |
| --------------------------------- | ------------------------------------------------------------------ |
| "System not found in Systems tab" | Check symlink path with `ls -la`, verify Foundry restart           |
| CSS not applying                  | Run `npm run css`, refresh browser (Ctrl+Shift+R for hard refresh) |
| Console errors                    | Check browser console (F12), search for error messages             |
| "Module not found" errors         | Verify node_modules installed: `npm install`                       |
| Changes not appearing             | Check watch mode running, verify symlink, hard refresh browser     |

## Workflow Tips

### Efficient Development

1. **Keep terminals organized:**
   - Terminal 1: `npm run watch` (always running)
   - Terminal 2: Git commands, npm scripts
   - Terminal 3: System commands

2. **Use hot-reload effectively:**
   - Edit LESS → automatic CSS compile
   - Edit JS → edit, save, refresh browser
   - Edit templates → refresh browser

3. **Check quality frequently:**

   ```bash
   npm run lint  # Before committing
   npm run format:check  # Check formatting
   ```

4. **Test systematically:**
   - Test in isolation (single feature)
   - Test integration (feature with others)
   - Test edge cases (empty data, special characters)

### Commit Before Major Changes

```bash
# Before refactoring or experimental work:
git add -A
git commit -m "backup: Save working state before [change description]"

# Then make your changes, test, commit properly:
git add -A
git commit -m "feat: Actual feature description"

# Or revert if needed:
git reset --hard HEAD~1
```

## Resources

- **Foundry VTT Documentation**: https://foundryvtt.com/article/system-development/
- **Our Repository**: https://github.com/kvarak/foundry-varlyn5e
- **Varlyn Rules**: https://dnd.rigo.nu
- **Issue Tracker**: https://github.com/kvarak/foundry-varlyn5e/issues

## Getting Help

1. **Check CHANGELOG.md** - See what's been done
2. **Search issues** - Your problem might be documented
3. **Check console** - Errors usually point to the problem
4. **Read code comments** - Developer notes in the code
5. **Ask in issues** - Create a discussion thread

---

**Happy developing! 🎲**
