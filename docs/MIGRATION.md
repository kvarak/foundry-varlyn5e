# Migration Guide - Varlyn D&D 5e System

This guide helps users migrate to the Varlyn D&D 5e Foundry VTT system from other sources.

---

## Migrating from Roll20

The Varlyn campaign was previously run using a custom Roll20 character sheet (`character-sheet/`). This guide helps import that data into Foundry VTT.

### What Can Be Migrated

| Data              | Migration Method | Notes                            |
| ----------------- | ---------------- | -------------------------------- |
| Character names   | Manual entry     | Simple copy                      |
| Ability scores    | Manual entry     | Direct mapping                   |
| HP / max HP       | Manual entry     | Direct mapping                   |
| Class and level   | Manual entry     | Select from compendium           |
| Folk              | Manual entry     | Select from compendium           |
| Skills owned      | Manual entry     | Re-purchase in new skill tree    |
| Equipment         | Manual entry     | Select from compendium or create |
| Spells            | Manual entry     | Select from compendium           |
| Biography / notes | Copy-paste       | Copy text from Roll20            |

### Migration Steps

1. **Export from Roll20:**
   - Open your Roll20 character sheet
   - Note down all values (no bulk export available)
   - Screenshot the sheet for reference

2. **Create actor in Foundry:**
   - In Foundry, create a new Actor of type "Character"
   - Enter the character name

3. **Enter ability scores:**
   - Match the 6 standard ability scores directly
   - Enter the Luck score if the character has one recorded

4. **Set class and folk:**
   - Open the Class compendium (`varlyn-classes`)
   - Drag the class to the character sheet
   - Open the Folk compendium (`varlyn-folk`)
   - Drag the folk to the character sheet

5. **Re-purchase skills:**
   - Review the old Roll20 skill selections
   - Allocate skill points in the new hierarchical system
   - Note: the skill system is different — some direct mappings, some changes

6. **Add equipment:**
   - Open the appropriate compendium (weapons, armor, gear)
   - Drag items to the character inventory
   - Mark equipped items

7. **Add spells (if applicable):**
   - Open the spells compendium
   - Add prepared/known spells

8. **Copy biography:**
   - Copy character description and notes from Roll20 to the Biography tab

### Skill System Differences

The Roll20 sheet uses standard D&D 5e skills. The Foundry system uses Varlyn's hierarchical skill tree. Here's a rough mapping:

| Standard D&D 5e Skill | Varlyn Equivalent                         |
| --------------------- | ----------------------------------------- |
| Acrobatics (DEX)      | Acrobatics (Practical tree)               |
| Animal Handling (WIS) | Animal Handling (Practical tree)          |
| Arcana (INT)          | Arcana (Knowledge tree)                   |
| Athletics (STR)       | Athletics (Untrained)                     |
| Deception (CHA)       | Deception (Practical tree)                |
| History (INT)         | History (Knowledge tree)                  |
| Insight (WIS)         | Insight (Untrained)                       |
| Intimidation (CHA)    | Intimidation (Untrained)                  |
| Investigation (INT)   | Investigation (Knowledge tree)            |
| Medicine (WIS)        | Medicine (Knowledge tree)                 |
| Nature (INT)          | Nature (Knowledge tree)                   |
| Perception (WIS)      | Perception (Untrained)                    |
| Performance (CHA)     | Performance (Practical tree)              |
| Persuasion (CHA)      | Persuasion (Untrained)                    |
| Religion (INT)        | Religion (Knowledge tree)                 |
| Sleight of Hand (DEX) | Sleight of Hand (Practical, req. Stealth) |
| Stealth (DEX)         | Stealth (Practical tree)                  |
| Survival (WIS)        | Survival (Practical tree)                 |

> **Note:** Expertise in Roll20 (double proficiency) becomes **advantage** in Varlyn.

---

## Migrating from the D&D 5e System on Foundry

If you have characters in the official D&D 5e system (`dnd5e`) and want to move to Varlyn:

### What Transfers Directly

- Ability scores (add Luck manually)
- HP values
- Biography text
- Equipment (names and descriptions carry over, stats may differ)
- Spell names and descriptions

### What Needs Updating

- **Weapon proficiencies:** Map from simple/martial to weapon group ranks
- **Armor proficiencies:** Re-enter as skill tree purchases
- **Racial features:** Re-enter as folk with appropriate subtype
- **Skills:** Re-map to Varlyn skill tree categories
- **Class features:** Some features have Varlyn-specific variants

### Migration Process

1. Open both systems side by side
2. Create new character in Varlyn system
3. Transfer each section manually using the table above as a guide
4. Pay special attention to: skills, weapon groups, folk features

---

## Version Upgrades (Future)

As the Varlyn system evolves, your character data may need migration between system versions.

### Automatic Migrations

When a new version of the system is released, automatic data migration will run when you:

1. Update the system in Foundry's package manager
2. Load a world that uses the Varlyn system

Migration scripts will update:

- Data schema changes (new fields, renamed fields)
- Default value updates
- Structural reorganization

### Manual Steps (if required)

Release notes in [CHANGELOG.md](../CHANGELOG.md) will document any manual steps required for each update.

### Before Upgrading

Always back up your world before updating:

1. In Foundry: `Settings → Export World`
2. Save the backup file somewhere safe
3. Then update the system

---

## Getting Help

- **GitHub Issues:** [https://github.com/kvarak/foundry-varlyn5e/issues](https://github.com/kvarak/foundry-varlyn5e/issues)
- **Varlyn Rules:** [dnd.rigo.nu](https://dnd.rigo.nu)
- **Architecture docs:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Data model docs:** [DATA-MODEL.md](DATA-MODEL.md)
