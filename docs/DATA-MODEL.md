# Data Model - Varlyn D&D 5e System

**Status:** Planned (Phase 1.1+)
**Current state:** Generic world-building attributes (inherited from Simple World-Building)

This document describes the **target** data schemas for Varlyn-specific actor and item types. These will be implemented starting in Phase 1.1.

---

## Actor Types

### Character

The primary player character actor.

```json
{
  "type": "character",
  "system": {
    "biography": {
      "value": "",
      "appearance": "",
      "background": "",
      "personality": "",
      "notes": ""
    },
    "attributes": {
      "hp": {
        "value": 0,
        "min": 0,
        "max": 0,
        "temp": 0
      },
      "ac": {
        "value": 10,
        "bonus": 0
      },
      "initiative": {
        "value": 0,
        "bonus": 0
      },
      "speed": {
        "value": 30,
        "unit": "ft"
      },
      "proficiency": {
        "value": 2
      },
      "luck": {
        "value": 0,
        "max": 0
      }
    },
    "abilities": {
      "str": { "value": 10, "proficient": false },
      "dex": { "value": 10, "proficient": false },
      "con": { "value": 10, "proficient": false },
      "int": { "value": 10, "proficient": false },
      "wis": { "value": 10, "proficient": false },
      "cha": { "value": 10, "proficient": false },
      "luk": { "value": 10, "proficient": false }
    },
    "skills": {
      "skillId": {
        "owned": false,
        "expertise": false,
        "ability": "dex"
      }
    },
    "details": {
      "level": 1,
      "xp": { "value": 0, "min": 0, "max": 300 },
      "folk": "",
      "folkSubtype": "",
      "class": "",
      "archetype": "",
      "classes": [],
      "skillPoints": {
        "total": 0,
        "spent": 0,
        "available": 0
      }
    },
    "spellcasting": {
      "ability": "int",
      "dc": 8,
      "attackBonus": 0,
      "slots": {
        "spell1": { "value": 0, "override": null },
        "spell2": { "value": 0, "override": null },
        "spell3": { "value": 0, "override": null },
        "spell4": { "value": 0, "override": null },
        "spell5": { "value": 0, "override": null },
        "spell6": { "value": 0, "override": null },
        "spell7": { "value": 0, "override": null },
        "spell8": { "value": 0, "override": null },
        "spell9": { "value": 0, "override": null }
      }
    },
    "currency": {
      "cp": 0,
      "sp": 0,
      "gp": 0,
      "pp": 0
    }
  }
}
```

### NPC

Non-player character / monster.

```json
{
  "type": "npc",
  "system": {
    "biography": { "value": "" },
    "attributes": {
      "hp": { "value": 0, "min": 0, "max": 0 },
      "ac": { "value": 10 },
      "speed": { "value": 30 },
      "cr": { "value": "1" }
    },
    "abilities": { ... },
    "details": {
      "type": "humanoid",
      "size": "med",
      "alignment": "neutral"
    }
  }
}
```

---

## Item Types

### Weapon

```json
{
  "type": "weapon",
  "system": {
    "description": { "value": "" },
    "equipped": false,
    "quantity": 1,
    "weight": 0,
    "price": { "value": 0, "denomination": "gp" },
    "weaponGroup": "sword",
    "weaponType": "melee",
    "rankRequired": 1,
    "damage": {
      "parts": [["1d8", "slashing"]],
      "versatile": "1d10"
    },
    "range": {
      "value": null,
      "long": null,
      "units": "ft"
    },
    "properties": {
      "finesse": false,
      "thrown": false,
      "two-handed": false,
      "light": false,
      "heavy": false,
      "reach": false
    }
  }
}
```

### Armor

```json
{
  "type": "armor",
  "system": {
    "description": { "value": "" },
    "equipped": false,
    "quantity": 1,
    "weight": 0,
    "price": { "value": 0, "denomination": "gp" },
    "armorType": "light",
    "skillRequired": "light-armor",
    "ac": { "value": 11, "dex": true, "maxDex": null },
    "stealth": false
  }
}
```

### Class

```json
{
  "type": "class",
  "system": {
    "description": { "value": "" },
    "hitDice": "d8",
    "hitDiceUsed": 0,
    "skillPointBonus": [0, 1, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    "primaryAbilities": ["str"],
    "spellcasting": {
      "ability": null,
      "progression": "none"
    },
    "advancement": [],
    "subclass": {
      "label": "Archetype",
      "value": ""
    }
  }
}
```

### Folk (Race)

```json
{
  "type": "folk",
  "system": {
    "description": { "value": "" },
    "folkCategory": "Old",
    "movement": { "walk": 30, "fly": 0, "swim": 0 },
    "size": "med",
    "abilityBonuses": { "str": 0, "dex": 0, "con": 0, "int": 0, "wis": 0, "cha": 0, "luk": 0 },
    "skillPointBonus": 0,
    "classModifications": {
      "className": {
        "abilitySubstitution": null,
        "skillPointBonus": 0,
        "features": []
      }
    },
    "traits": [],
    "rollTable": null
  }
}
```

### Skill

```json
{
  "type": "skill",
  "system": {
    "description": { "value": "" },
    "category": "Practical",
    "ability": "dex",
    "cost": 1,
    "prerequisite": null,
    "untrained": false
  }
}
```

### Feature

```json
{
  "type": "feature",
  "system": {
    "description": { "value": "" },
    "source": {
      "type": "class",
      "name": "",
      "subtype": ""
    },
    "level": 1,
    "activation": {
      "type": "action",
      "cost": 1
    },
    "uses": {
      "value": 0,
      "max": 0,
      "per": "sr"
    }
  }
}
```

### Spell

```json
{
  "type": "spell",
  "system": {
    "description": { "value": "" },
    "level": 0,
    "school": "evo",
    "components": { "vocal": false, "somatic": false, "material": false, "ritual": false, "concentration": false },
    "materials": { "value": "", "consumed": false, "cost": 0 },
    "target": { "value": null, "units": "", "type": "" },
    "range": { "value": null, "units": "touch" },
    "duration": { "value": null, "units": "inst" },
    "castingTime": { "value": 1, "units": "action" },
    "damage": { "parts": [], "versatile": "" },
    "save": { "ability": null, "scaling": "spell" },
    "prepared": false
  }
}
```

---

## Derived Data

These values are computed in `SimpleActor#prepareDerivedData()`:

| Field                           | Formula                                     |
| ------------------------------- | ------------------------------------------- |
| `abilities.X.mod`               | `Math.floor((score - 10) / 2)`              |
| `abilities.X.save`              | `mod + (proficient ? proficiency : 0)`      |
| `attributes.proficiency`        | `Math.ceil(level / 4) + 1`                  |
| `attributes.ac`                 | Depends on armor skill tree                 |
| `details.skillPoints.total`     | Class base + class bonuses + folk bonus     |
| `details.skillPoints.available` | `total - spent`                             |
| `spellcasting.dc`               | `8 + proficiency + spellcastingAbility.mod` |
| `spellcasting.attackBonus`      | `proficiency + spellcastingAbility.mod`     |

---

## Weapon Groups

Varlyn uses 12 weapon groups instead of simple/martial:

| Group           | Type         | Examples                     |
| --------------- | ------------ | ---------------------------- |
| `axe`           | Melee        | Handaxe, Greataxe, Battleaxe |
| `club`          | Melee        | Club, Mace, Greatclub        |
| `fencing-sword` | Melee        | Rapier, Epee                 |
| `flail`         | Melee        | Flail, Morningstar           |
| `knife`         | Melee/Ranged | Dagger, Shortsword           |
| `polearm`       | Melee        | Halberd, Glaive, Pike        |
| `spear`         | Melee/Ranged | Spear, Javelin, Trident      |
| `sword`         | Melee        | Longsword, Greatsword        |
| `whip`          | Melee        | Whip                         |
| `bow`           | Ranged       | Shortbow, Longbow            |
| `crossbow`      | Ranged       | Light/Heavy/Hand crossbow    |
| `sling-thrown`  | Ranged       | Sling, Thrown weapons        |

### Weapon Group Ranks

| Rank | Benefit                                         |
| ---- | ----------------------------------------------- |
| 1    | Can use the weapon                              |
| 2    | Martial techniques unlocked                     |
| 3    | Weapon Master abilities (Cleave, Riposte, etc.) |
| 4    | Advanced Master techniques                      |

---

## Skill Categories

```
Untrained Skills (always rollable, cost 0)
├── Perception
├── Athletics
└── ...

Knowledge Skills (cost 1 per skill)
├── Arcana
├── History
├── Nature
└── ...

Practical Skills (hierarchical prerequisites, cost 1)
├── Stealth
│   └── Sleight of Hand
│       └── Thieves' Tools
├── Animal Handling
│   └── Ride
└── ...
```

---

## References

- **Rules source:** [dnd.rigo.nu](https://dnd.rigo.nu)
- **Architecture overview:** [ARCHITECTURE.md](ARCHITECTURE.md)
- **Implementation plan:** [VARLYN-FOUNDRY-PLAN.md](../.github/VARLYN-FOUNDRY-PLAN.md)
- **Fork reference (Phase 1 complete):** `foundryvtt-dnd5e/module/data/`
