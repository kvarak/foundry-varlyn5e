/**
 * Varlyn D&D 5e skill system.
 * Hierarchical skill trees organized by category (untrained, knowledge, practical).
 *
 * Each skill entry:
 *   label       {string}        - Display name
 *   ability     {string}        - Primary ability key (str/dex/con/int/wis/cha/luk)
 *   cost        {number}        - Skill point cost to purchase (default 1)
 *   parent      {string|null}   - Prerequisite skill key, null for root skills
 *   untrained   {boolean}       - Can be rolled without purchasing
 *   expertise   {boolean}       - Grants advantage when purchased
 *   expertiseDual {Object}      - Dual-ability expertise {ability1, ability2}
 *   trait       {boolean}       - Binary ability (owned or not, no roll)
 *   synergy     {string[]}      - Other skills that grant advantage with this one
 */
export const VARLYN_SKILLS = {
  // ═══════════════════════════════════════════════════════════
  //  UNTRAINED — rollable by everyone (owned = better modifier)
  // ═══════════════════════════════════════════════════════════
  untrained: {
    label: "VARLYN.SkillCategoryUntrained",
    skills: {
      // ── Acrobatics tree ──────────────────────────────────
      acrobatics: {
        label: "Acrobatics",
        ability: "dex",
        cost: 1,
        parent: null,
        untrained: true,
      },
      aerialAcrobatics: {
        label: "Aerial Acrobatics",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        expertiseDual: { ability1: "dex", ability2: "cha" },
      },
      contortion: {
        label: "Contortion",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        trait: true,
        expertise: true,
      },
      bodyPacking: {
        label: "Body Packing",
        ability: "dex",
        cost: 1,
        parent: "contortion",
        trait: true,
      },
      dislocation: {
        label: "Dislocation",
        ability: "dex",
        cost: 1,
        parent: "contortion",
        trait: true,
      },
      fastReflexes: {
        label: "Fast Reflexes",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        trait: true,
      },
      parkour: {
        label: "Parkour",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        expertise: true,
      },
      wallRunner: {
        label: "Wall Runner",
        ability: "dex",
        cost: 1,
        parent: "parkour",
        trait: true,
      },
      poleVault: {
        label: "Pole Vault",
        ability: "dex",
        cost: 1,
        parent: "parkour",
        trait: true,
      },
      rollWithBlow: {
        label: "Roll with the Blow",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        expertise: true,
      },
      rollWithBlowII: {
        label: "Roll with the Blow II",
        ability: "dex",
        cost: 1,
        parent: "rollWithBlow",
        expertise: true,
      },
      slipTrap: {
        label: "Slip Trap",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        expertise: true,
      },
      stability: {
        label: "Stability",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        expertise: true,
      },
      beamWalking: {
        label: "Beam Walking",
        ability: "dex",
        cost: 1,
        parent: "stability",
        trait: true,
      },
      tightropeWalking: {
        label: "Tightrope Walking",
        ability: "dex",
        cost: 1,
        parent: "stability",
        trait: true,
      },
      tumbling: {
        label: "Tumbling",
        ability: "dex",
        cost: 1,
        parent: "acrobatics",
        expertise: true,
      },

      // ── Animal Handling ──────────────────────────────────
      animalHandling: {
        label: "Animal Handling",
        ability: "wis",
        cost: 1,
        parent: null,
        untrained: true,
      },

      // ── Athletics tree ───────────────────────────────────
      athletics: {
        label: "Athletics",
        ability: "str",
        cost: 1,
        parent: null,
        untrained: true,
      },
      climbing: {
        label: "Climbing",
        ability: "str",
        cost: 1,
        parent: "athletics",
        expertise: true,
      },
      jumping: {
        label: "Jumping",
        ability: "str",
        cost: 1,
        parent: "athletics",
        expertise: true,
      },
      swimming: {
        label: "Swimming",
        ability: "str",
        cost: 1,
        parent: "athletics",
        expertise: true,
      },

      // ── Stealth tree ─────────────────────────────────────
      stealth: {
        label: "Stealth",
        ability: "dex",
        cost: 1,
        parent: null,
        untrained: true,
      },
      hideInShadows: {
        label: "Hide in Shadows",
        ability: "dex",
        cost: 1,
        parent: "stealth",
        expertise: true,
      },
      moveSilently: {
        label: "Move Silently",
        ability: "dex",
        cost: 1,
        parent: "stealth",
        expertise: true,
      },

      // ── Perception ───────────────────────────────────────
      perception: {
        label: "Perception",
        ability: "wis",
        cost: 1,
        parent: null,
        untrained: true,
      },
      keenEyes: {
        label: "Keen Eyes",
        ability: "wis",
        cost: 1,
        parent: "perception",
        expertise: true,
      },
      keenHearing: {
        label: "Keen Hearing",
        ability: "wis",
        cost: 1,
        parent: "perception",
        expertise: true,
      },

      // ── Survival ─────────────────────────────────────────
      survival: {
        label: "Survival",
        ability: "wis",
        cost: 1,
        parent: null,
        untrained: true,
      },
      tracking: {
        label: "Tracking",
        ability: "wis",
        cost: 1,
        parent: "survival",
        expertise: true,
      },
      foraging: {
        label: "Foraging",
        ability: "wis",
        cost: 1,
        parent: "survival",
        expertise: true,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  //  KNOWLEDGE — require purchase to use without disadvantage
  // ═══════════════════════════════════════════════════════════
  knowledge: {
    label: "VARLYN.SkillCategoryKnowledge",
    skills: {
      arcana: {
        label: "Arcana",
        ability: "int",
        cost: 1,
        parent: null,
      },
      history: {
        label: "History",
        ability: "int",
        cost: 1,
        parent: null,
      },
      nature: {
        label: "Nature",
        ability: "int",
        cost: 1,
        parent: null,
      },
      religion: {
        label: "Religion",
        ability: "int",
        cost: 1,
        parent: null,
      },
      dungeoneering: {
        label: "Dungeoneering",
        ability: "int",
        cost: 1,
        parent: null,
      },
      streetwise: {
        label: "Streetwise",
        ability: "int",
        cost: 1,
        parent: null,
      },
    },
  },

  // ═══════════════════════════════════════════════════════════
  //  PRACTICAL — social and investigative skills
  // ═══════════════════════════════════════════════════════════
  practical: {
    label: "VARLYN.SkillCategoryPractical",
    skills: {
      deception: {
        label: "Deception",
        ability: "cha",
        cost: 1,
        parent: null,
      },
      insight: {
        label: "Insight",
        ability: "wis",
        cost: 1,
        parent: null,
      },
      intimidation: {
        label: "Intimidation",
        ability: "cha",
        cost: 1,
        parent: null,
      },
      investigation: {
        label: "Investigation",
        ability: "int",
        cost: 1,
        parent: null,
      },
      medicine: {
        label: "Medicine",
        ability: "wis",
        cost: 1,
        parent: null,
      },
      performance: {
        label: "Performance",
        ability: "cha",
        cost: 1,
        parent: null,
      },
      persuasion: {
        label: "Persuasion",
        ability: "cha",
        cost: 1,
        parent: null,
      },
      sleightOfHand: {
        label: "Sleight of Hand",
        ability: "dex",
        cost: 1,
        parent: null,
      },
      legerdemain: {
        label: "Legerdemain",
        ability: "dex",
        cost: 1,
        parent: "sleightOfHand",
        expertise: true,
      },
      pickpocket: {
        label: "Pickpocket",
        ability: "dex",
        cost: 1,
        parent: "sleightOfHand",
        expertise: true,
      },
    },
  },
};

/* ─── Helpers ─────────────────────────────────────────────────────────────── */

/**
 * Return all skills flattened into a single {key: def} map.
 * @returns {Record<string, Object>}
 */
export function getFlatSkills() {
  const flat = {};
  for (const category of Object.values(VARLYN_SKILLS)) {
    Object.assign(flat, category.skills);
  }
  return flat;
}

/**
 * Find the skill definition for a given key across all categories.
 * @param {string} skillKey
 * @returns {Object|null}
 */
export function findSkillDef(skillKey) {
  for (const category of Object.values(VARLYN_SKILLS)) {
    if (category.skills[skillKey]) return category.skills[skillKey];
  }
  return null;
}

/**
 * Return skill keys sorted in DFS tree order (parent before all children).
 * @param {Record<string, Object>} skills
 * @returns {string[]}
 */
export function skillTreeOrder(skills) {
  const children = {};
  const roots = [];
  for (const [key, skill] of Object.entries(skills)) {
    if (!skill.parent) roots.push(key);
    else {
      if (!children[skill.parent]) children[skill.parent] = [];
      children[skill.parent].push(key);
    }
  }
  const result = [];
  function visit(key) {
    result.push(key);
    for (const child of children[key] ?? []) visit(child);
  }
  for (const root of roots) visit(root);
  // Safety: include orphaned skills (broken parent references)
  for (const key of Object.keys(skills)) {
    if (!result.includes(key)) result.push(key);
  }
  return result;
}

/**
 * Count hops from a skill back to the root of its tree.
 * @param {string} skillKey
 * @param {Record<string, Object>} skills
 * @returns {number}
 */
export function getSkillDepth(skillKey, skills) {
  let depth = 0;
  let current = skills[skillKey];
  while (current?.parent && skills[current.parent]) {
    depth++;
    current = skills[current.parent];
  }
  return depth;
}

/**
 * Check whether a skill can be purchased given the current purchased set.
 * @param {string} skillKey
 * @param {Set<string>} purchased
 * @param {number} availablePoints
 * @returns {boolean}
 */
export function canPurchaseSkill(skillKey, purchased, availablePoints) {
  const def = findSkillDef(skillKey);
  if (!def) return false;
  if (purchased.has(skillKey)) return false;
  if (availablePoints <= 0) return false;
  if (def.parent && !purchased.has(def.parent)) return false;
  return true;
}
