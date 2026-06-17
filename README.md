# Varlyn D&D 5e - Foundry VTT System

**A custom D&D 5e system for Foundry VTT implementing the Varlyn homebrew rules.**

[![Foundry VTT](https://img.shields.io/badge/Foundry-v12+-informational)](https://foundryvtt.com)
[![System Version](https://img.shields.io/badge/version-0.1.0-blue)](https://github.com/kvarak/dnd/releases)
[![License](https://img.shields.io/badge/license-MIT-green)](LICENSE.txt)

---

## Overview

The Varlyn system is a comprehensive homebrew modification of D&D 5e featuring:

- **7 Abilities**: STR, DEX, CON, INT, WIS, CHA, and **Luck** (fortune type)
- **Hierarchical Skill System**: Skill point economy with prerequisites and categories (Untrained, Knowledge, Practical)
- **Folk System**: 19 custom races with class-specific modifications
- **Weapon Groups**: 12 weapon groups with 4 ranks each (replacing simple/martial proficiency)
- **Custom Classes**: 18+ classes including homebrew additions (Alchemist, Cavalier, Cursed, Feyblood, Inquisitor, Professional)
- **100+ Archetypes**: Unique subclasses across all classes

---

## Installation

### Method 1: Manifest URL (Recommended - When Available)
1. In Foundry VTT, go to **Setup** → **Game Systems**
2. Click **Install System**
3. Paste manifest URL: `https://github.com/kvarak/dnd/releases/latest/download/system.json`
4. Click **Install**

### Method 2: Manual Installation
1. Download the latest release from [GitHub Releases](https://github.com/kvarak/dnd/releases)
2. Extract to `[Foundry Data]/Data/systems/varlyn5e/`
3. Restart Foundry VTT
4. Create a new world using the **Varlyn D&D 5e** system

---

## Current Status

**Version 0.1.0** - Phase 0: Foundation & Infrastructure

### ✅ Completed
- Phase 0.1: Project identity established
- System renamed from worldbuilding → varlyn5e
- Basic system manifest configured

### 🚧 In Progress
- Phase 0.2: Build system modernization
- Phase 0.3: CI/CD pipeline setup
- Phase 0.4: Development environment configuration
- Phase 0.5: Documentation structure

### 📋 Planned
- **Phase 1** (6-8 weeks): Core game engine (abilities, skills, folk, classes)
- **Phase 2** (3-4 weeks): Combat & equipment systems
- **Phase 3** (4-6 weeks): Character sheet UI
- **Phase 4** (8-10 weeks): Compendiums & content
- **Phase 5** (4-6 weeks): Advanced features
- **Phase 6** (3-4 weeks): Polish & v1.0 release

See [VARLYN-FOUNDRY-PLAN.md](../.github/VARLYN-FOUNDRY-PLAN.md) for detailed roadmap.

---

## Documentation

- **Rules Reference**: [dnd.rigo.nu](https://dnd.rigo.nu) - Complete Varlyn homebrew rules
- **Implementation Plan**: [VARLYN-FOUNDRY-PLAN.md](../.github/VARLYN-FOUNDRY-PLAN.md)
- **Repository Structure**: [REPOSITORY-STRUCTURE.md](../.github/REPOSITORY-STRUCTURE.md)
- **Development Guide**: Coming in Phase 0.5

---

## Key Features (Planned)

### Skill System
- **No proficiency bonus** - replaced with skill point economy
- **Hierarchical prerequisites** - unlock advanced skills by mastering basics
- **Three categories**: Untrained (always available), Knowledge, Practical
- **Expertise = Advantage** (not double proficiency)
- Skill points allocated: 1 base per level + class bonuses + folk bonus

### Folk (Races)
19 custom folk organized by category:
- **Old**: Dwarves, Elves
- **Visitor**: Aasimar, Genasi, Tiefling
- **New**: Humans, Halflings, Dragonfolk
- **Awakened**: Sentient animals and plants
- **Else-Touched**: Changelings, Dhampirs, Shifters

Each folk has class-specific modifications (e.g., Halfling Rogues get unique abilities).

### Weapon Groups
Replace simple/martial with 12 groups:
- **Melee**: Axe, Club, Fencing Sword, Flail, Knife, Polearm, Spear, Sword, Whip
- **Ranged**: Bow, Crossbow, Sling/Thrown
- **4 Ranks**: Simple → Martial → Master → Advanced Master

### Classes
18+ classes with custom mechanics:
- Standard variants: Barbarian, Bard, Cleric, Druid, Fighter, Monk, Paladin, Ranger, Rogue, Sorcerer, Warlock, Wizard
- Homebrew: **Alchemist**, **Cavalier**, **Cursed**, **Feyblood**, **Inquisitor**, **Professional**

---

## Development

### Requirements
- Node.js 22+
- npm or yarn
- Foundry VTT v12+

### Building
```bash
# Install dependencies
npm install

# Build CSS
npm run build

# Watch mode (auto-rebuild on changes)
npm run dev
```

### Testing
Currently in foundational phase. Testing framework to be established in Phase 0.2.

---

## Contributing

This is an early-stage project. Contributions welcome once Phase 1 is complete!

Areas for future contribution:
- Folk and class content
- Compendium entries
- UI improvements
- Bug reports and testing
- Documentation

See [CONTRIBUTING.md](CONTRIBUTING.md) (coming in Phase 0.5) for guidelines.

---

## Credits

### Varlyn System
- **Created by**: Uppsala Rollspel
- **Rules Documentation**: https://dnd.rigo.nu
- **Development**: Clean build implementation for Foundry VTT

### Based On
- **Simple World-Building System** by Atropos (Foundry Gaming LLC)
- Original system: https://github.com/foundryvtt/worldbuilding
- License: MIT

### Inspiration
- Official D&D 5e system for Foundry VTT
- Roll20 character sheet implementation (stable, in production)
- Community feedback from Uppsala Rollspel campaigns

---

## License

MIT License - see [LICENSE.txt](LICENSE.txt)

**Acknowledgments:**
- Based on the Simple World-Building system by Atropos (MIT License)
- Varlyn homebrew rules © Uppsala Rollspel
- Foundry VTT © Foundry Gaming LLC

---

## Links

- **Rules**: https://dnd.rigo.nu
- **GitHub**: https://github.com/kvarak/dnd
- **Issues**: https://github.com/kvarak/dnd/issues
- **Foundry VTT**: https://foundryvtt.com

---

## Version History

### 0.1.0 (2026-06-17) - Phase 0.1 Complete
- Initial system identity established
- Renamed from worldbuilding to varlyn5e
- Updated manifest with Varlyn metadata
- Foundation for development set

**Status**: Alpha - Early Development

**Next**: Phase 0.2 - Build system modernization
