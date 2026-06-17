/**
 * Varlyn D&D 5e system configuration constants.
 * @namespace VARLYN
 */
export const VARLYN = {};

/**
 * The 7 ability scores used in Varlyn 5e (STR, DEX, CON, INT, WIS, CHA, LUK).
 * Luck is a "fortune" type, distinct from the standard physical/mental abilities.
 */
VARLYN.abilities = {
  str: { label: "VARLYN.AbilityStr", abbreviation: "VARLYN.AbilityStrAbbr", type: "physical", fullKey: "strength" },
  dex: { label: "VARLYN.AbilityDex", abbreviation: "VARLYN.AbilityDexAbbr", type: "physical", fullKey: "dexterity" },
  con: { label: "VARLYN.AbilityCon", abbreviation: "VARLYN.AbilityConAbbr", type: "physical", fullKey: "constitution" },
  int: { label: "VARLYN.AbilityInt", abbreviation: "VARLYN.AbilityIntAbbr", type: "mental", fullKey: "intelligence" },
  wis: { label: "VARLYN.AbilityWis", abbreviation: "VARLYN.AbilityWisAbbr", type: "mental", fullKey: "wisdom" },
  cha: { label: "VARLYN.AbilityCha", abbreviation: "VARLYN.AbilityChaAbbr", type: "mental", fullKey: "charisma" },
  luk: { label: "VARLYN.AbilityLuk", abbreviation: "VARLYN.AbilityLukAbbr", type: "fortune", fullKey: "luck" },
};

/**
 * Folk (race) categories in the Varlyn setting.
 */
VARLYN.folkCategories = {
  old: "VARLYN.FolkCategoryOld",
  visitor: "VARLYN.FolkCategoryVisitor",
  new: "VARLYN.FolkCategoryNew",
  awakened: "VARLYN.FolkCategoryAwakened",
  elseTouched: "VARLYN.FolkCategoryElseTouched",
};

/**
 * Available hit die sizes for classes.
 */
VARLYN.hitDice = ["d6", "d8", "d10", "d12"];

/**
 * Skill point formula: base = level + INT mod (min 1) + 2 starting bonus.
 * Class and folk bonuses are added on top of this.
 * @param {number} level
 * @param {number} intMod
 * @returns {number}
 */
VARLYN.calcBaseSkillPoints = (level, intMod) => Math.max(1, level) + Math.max(0, intMod) + 2;
