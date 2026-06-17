import { EntitySheetHelper } from "./helper.js";
import { ATTRIBUTE_TYPES } from "./constants.js";
import { VARLYN } from "./config.js";
import { VARLYN_SKILLS, findSkillDef, skillTreeOrder, getSkillDepth } from "./skills.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Actor sheet for Varlyn D&D 5e characters.
 * Tabs: Abilities | Skills | Biography | Items | Attributes
 * @extends {foundry.applications.api.DocumentSheetV2}
 */
export class SimpleActorSheet extends HandlebarsApplicationMixin(foundry.applications.api.DocumentSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["varlyn5e", "sheet", "actor"],
    position: { width: 650, height: 680 },
    form: { submitOnChange: true, closeOnSubmit: false },
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/varlyn5e/templates/actor-sheet.html",
      scrollable: [".biography", ".items", ".attributes", ".skills-tab-content", ".abilities"],
    },
  };

  /** Active tab defaults to abilities. @type {Record<string, string>} */
  tabGroups = { primary: "abilities" };

  /** @override */
  get title() {
    return this.document.name;
  }

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const doc = this.document;
    const docData = doc.toObject(false);

    const abilities = this._prepareAbilities(doc);
    const { skillCategories, skillPoints } = this._prepareSkills(doc, abilities);

    const context = {
      data: docData,
      systemData: docData.system,
      dtypes: ATTRIBUTE_TYPES,
      shorthand: !!game.settings.get("varlyn5e", "macroShorthand"),
      isOwner: doc.isOwner,
      editable: this.isEditable,
      cssClass: this.isEditable ? "editable" : "locked",
      abilities,
      skillCategories,
      skillPoints,
    };
    EntitySheetHelper.getAttributeData(context.data);
    context.biographyHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.systemData.biography ?? "",
      { secrets: doc.isOwner, async: true }
    );
    return context;
  }

  /* -------------------------------------------- */

  /**
   * Build the abilities object for template rendering.
   * @param {SimpleActor} doc
   * @returns {Record<string, Object>}
   */
  _prepareAbilities(doc) {
    const abilities = {};
    for (const [key, cfg] of Object.entries(VARLYN.abilities)) {
      const raw = doc.system.abilities?.[key] ?? { value: 10 };
      const mod = Math.floor(((raw.value ?? 10) - 10) / 2);
      abilities[key] = {
        value: raw.value ?? 10,
        mod,
        modSigned: (mod >= 0 ? "+" : "") + mod,
        label: game.i18n.localize(cfg.label),
        abbr: game.i18n.localize(cfg.abbreviation),
        type: cfg.type,
      };
    }
    return abilities;
  }

  /* -------------------------------------------- */

  /**
   * Build the skill categories structure for template rendering.
   * @param {SimpleActor} doc
   * @param {Record<string, Object>} abilities
   * @returns {{ skillCategories: Record<string, Object>, skillPoints: Object }}
   */
  _prepareSkills(doc, abilities) {
    const purchased = new Set(doc.system.skills?.purchased ?? []);
    const expertise = new Set(doc.system.skills?.expertise ?? []);
    const points = doc.system.skills?.points ?? { total: 3, spent: 0, available: 3 };

    const skillCategories = {};
    for (const [catKey, category] of Object.entries(VARLYN_SKILLS)) {
      if (!Object.keys(category.skills).length) continue;
      const sortedKeys = skillTreeOrder(category.skills);
      const skills = {};

      for (const skillKey of sortedKeys) {
        const skillDef = category.skills[skillKey];
        const owned = purchased.has(skillKey);
        const parentOwned = !skillDef.parent || purchased.has(skillDef.parent);
        const canPurchase = !owned && points.available > 0 && parentOwned;
        const hasExp = expertise.has(skillKey);
        const abilityMod = abilities[skillDef.ability]?.mod ?? 0;
        const depth = getSkillDepth(skillKey, category.skills);

        skills[skillKey] = {
          label: skillDef.label,
          ability: skillDef.ability,
          abilityAbbr: abilities[skillDef.ability]?.abbr ?? skillDef.ability.toUpperCase(),
          mod: abilityMod,
          modSigned: (abilityMod >= 0 ? "+" : "") + abilityMod,
          owned,
          canPurchase,
          hasExpertise: hasExp,
          rollable: owned || !!skillDef.untrained,
          depth,
          indentPx: 8 + depth * 14,
          parent: skillDef.parent ?? null,
          untrained: !!skillDef.untrained,
        };
      }

      skillCategories[catKey] = {
        label: game.i18n.localize(category.label),
        skills,
      };
    }
    return { skillCategories, skillPoints: points };
  }

  /* -------------------------------------------- */

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);

    // Initialize active tab
    this.changeTab(this.tabGroups.primary ?? "abilities", "primary");

    // Tab navigation
    this.element.querySelectorAll(".sheet-tabs .item[data-tab]").forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        this.changeTab(event.currentTarget.dataset.tab, "primary");
      });
    });

    if (!this.isEditable) return;

    // Ability rolls
    this.element.querySelector(".abilities-grid")?.addEventListener("click", (event) => {
      const el = event.target.closest("[data-action='roll-ability']");
      if (el) this._onAbilityRoll(event);
    });

    // Skills (purchase, expertise toggle, roll)
    this.element.querySelector(".skills-tab-content")?.addEventListener("click", (event) => {
      const purchaseEl = event.target.closest("[data-action='purchase-skill']");
      if (purchaseEl) {
        this._onPurchaseSkill(event);
        return;
      }
      const expertiseEl = event.target.closest("[data-action='toggle-expertise']");
      if (expertiseEl) {
        this._onToggleExpertise(event);
        return;
      }
      const rollEl = event.target.closest("[data-action='roll-skill']");
      if (rollEl) this._onSkillRoll(event);
    });

    // Attribute Management
    this.element.querySelector(".attributes")?.addEventListener("click", (event) => {
      const control = event.target.closest(".attribute-control");
      if (control) EntitySheetHelper.onClickAttributeControl.call(this, event);
      const roll = event.target.closest("a.attribute-roll");
      if (roll) EntitySheetHelper.onAttributeRoll.call(this, event);
    });
    this.element.querySelector(".groups")?.addEventListener("click", (event) => {
      const control = event.target.closest(".group-control");
      if (control) EntitySheetHelper.onClickAttributeGroupControl.call(this, event);
    });

    // Item Controls
    this.element
      .querySelectorAll(".item-control")
      .forEach((el) => el.addEventListener("click", this._onItemControl.bind(this)));
    this.element
      .querySelectorAll(".items .rollable")
      .forEach((el) => el.addEventListener("click", this._onItemRoll.bind(this)));

    // Draggable attribute rolls for Macro creation
    this.element.querySelectorAll(".attributes a.attribute-roll").forEach((a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", (ev) => {
        const dragData = ev.currentTarget.dataset;
        ev.dataTransfer.setData("text/plain", JSON.stringify(dragData));
      });
    });
  }

  /* -------------------------------------------- */

  /** @override */
  _processFormData(event, form, formData) {
    const submitData = super._processFormData(event, form, formData);
    let data = foundry.utils.flattenObject(submitData);
    data = EntitySheetHelper.updateAttributes(data, this.document);
    data = EntitySheetHelper.updateGroups(data, this.document);
    return data;
  }

  /* -------------------------------------------- */

  /** Roll an ability check. */
  _onAbilityRoll(event) {
    const el = event.target.closest("[data-action='roll-ability']");
    const abilityKey = el?.dataset.ability;
    if (!abilityKey) return;
    const abilityData = this.document.system.abilities?.[abilityKey];
    const mod = Math.floor(((abilityData?.value ?? 10) - 10) / 2);
    const cfg = VARLYN.abilities[abilityKey];
    const label = cfg ? game.i18n.localize(cfg.label) : abilityKey;
    const r = new Roll("1d20 + @mod", { mod });
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.document }),
      flavor: `<h3>${label} ${game.i18n.localize("VARLYN.AbilityCheck")}</h3>`,
    });
  }

  /* -------------------------------------------- */

  /** Roll a skill check (advantage if expertise, disadvantage if unowned non-untrained). */
  _onSkillRoll(event) {
    const el = event.target.closest("[data-action='roll-skill']");
    const skillKey = el?.dataset.skill;
    if (!skillKey) return;
    const skillDef = findSkillDef(skillKey);
    if (!skillDef) return;

    const ability = this.document.system.abilities?.[skillDef.ability];
    const mod = Math.floor(((ability?.value ?? 10) - 10) / 2);
    const purchased = this.document.system.skills?.purchased ?? [];
    const expertise = this.document.system.skills?.expertise ?? [];
    const owned = purchased.includes(skillKey);
    const hasExpertise = expertise.includes(skillKey);

    let rollFormula;
    if (hasExpertise && owned)
      rollFormula = "2d20kh + @mod"; // advantage
    else if (!owned && !skillDef.untrained)
      rollFormula = "2d20kl + @mod"; // disadvantage
    else rollFormula = "1d20 + @mod";

    const r = new Roll(rollFormula, { mod });
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.document }),
      flavor: `<h3>${skillDef.label}</h3>`,
    });
  }

  /* -------------------------------------------- */

  /** Purchase a skill by adding it to system.skills.purchased. */
  async _onPurchaseSkill(event) {
    const el = event.target.closest("[data-action='purchase-skill']");
    const skillKey = el?.dataset.skill;
    if (!skillKey) return;
    const purchased = [...(this.document.system.skills?.purchased ?? [])];
    if (!purchased.includes(skillKey)) {
      purchased.push(skillKey);
      await this.document.update({ "system.skills.purchased": purchased });
    }
  }

  /* -------------------------------------------- */

  /** Toggle expertise for an owned skill. */
  async _onToggleExpertise(event) {
    const el = event.target.closest("[data-action='toggle-expertise']");
    const skillKey = el?.dataset.skill;
    if (!skillKey) return;
    const expertise = [...(this.document.system.skills?.expertise ?? [])];
    const idx = expertise.indexOf(skillKey);
    if (idx >= 0) expertise.splice(idx, 1);
    else expertise.push(skillKey);
    await this.document.update({ "system.skills.expertise": expertise });
  }

  /* -------------------------------------------- */

  /**
   * Handle click events for Item control buttons within the Actor Sheet.
   * @param {MouseEvent} event
   */
  _onItemControl(event) {
    event.preventDefault();
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.document.items.get(li?.dataset.itemId);
    switch (button.dataset.action) {
      case "create": {
        const cls = getDocumentClass("Item");
        return cls.create({ name: game.i18n.localize("SIMPLE.ItemNew"), type: "item" }, { parent: this.document });
      }
      case "edit":
        return item.sheet.render(true);
      case "delete":
        return item.delete();
    }
  }

  /* -------------------------------------------- */

  /**
   * Listen for roll buttons on items.
   * @param {MouseEvent} event
   */
  _onItemRoll(event) {
    const button = event.currentTarget;
    const li = button.closest(".item");
    const item = this.document.items.get(li.dataset.itemId);
    const r = new Roll(button.dataset.roll, this.document.getRollData());
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.document }),
      flavor: `<h2>${item.name}</h2><h3>${button.textContent.trim()}</h3>`,
    });
  }
}
