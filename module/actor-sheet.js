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
    // editable:true is required — ApplicationV2.isEditable checks options.editable;
    // DocumentSheetV2.isEditable also gates on document.isOwner so permissions are still respected.
    editable: true,
    form: { submitOnChange: true, closeOnSubmit: false },
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/varlyn5e/templates/actor-sheet.html",
      scrollable: [".biography", ".items", ".attributes"],
    },
  };

  /** Active tab (UI state). @type {Record<string, string>} */
  tabGroups = { primary: "abilities" };

  /** Collapsed skill tree nodes (UI-only, not persisted). @type {Set<string>} */
  _collapsedSkillNodes = new Set();

  /** Whether _collapsedSkillNodes has been auto-initialized on first render. */
  _skillNodesInitialized = false;

  /** @override */
  get title() {
    return this.document.name;
  }

  /* -------------------------------------------- */
  /*  Context Preparation                          */
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
   * Build skill categories with full UI metadata for the template.
   * Includes: trait detection, collapse state, breadcrumb, rollable flag.
   * @param {SimpleActor} doc
   * @param {Record<string, Object>} abilities
   * @returns {{ skillCategories: Record<string, Object>, skillPoints: Object }}
   */
  _prepareSkills(doc, abilities) {
    const purchased = new Set(doc.system.skills?.purchased ?? []);
    const expertise = new Set(doc.system.skills?.expertise ?? []);
    const points = doc.system.skills?.points ?? { total: 3, spent: 0, available: 3 };
    const collapsedNodes = this._collapsedSkillNodes;

    // Auto-collapse parent nodes on first open (unless they have owned descendants).
    if (!this._skillNodesInitialized) this._initSkillCollapse(purchased);

    const skillCategories = {};
    for (const [catKey, category] of Object.entries(VARLYN_SKILLS)) {
      if (!Object.keys(category.skills).length) continue;
      const sortedKeys = skillTreeOrder(category.skills);

      // Pre-compute which skills have children (to show collapse toggle)
      const childrenOf = {};
      for (const [sk, sd] of Object.entries(category.skills)) {
        if (sd.parent) {
          if (!childrenOf[sd.parent]) childrenOf[sd.parent] = [];
          childrenOf[sd.parent].push(sk);
        }
      }

      const skills = {};
      for (const skillKey of sortedKeys) {
        const skillDef = category.skills[skillKey];
        const owned = purchased.has(skillKey);
        const parentOwned = !skillDef.parent || purchased.has(skillDef.parent);
        const canPurchase = !owned && points.available > 0 && parentOwned;
        const hasExp = expertise.has(skillKey);
        const abilityMod = abilities[skillDef.ability]?.mod ?? 0;
        const depth = getSkillDepth(skillKey, category.skills);
        const isTrait = !!skillDef.trait;
        const isParent = !!childrenOf[skillKey]?.length;

        // Check if hidden because an ancestor is collapsed
        let hiddenByCollapse = false;
        let ancestor = skillDef.parent;
        while (ancestor) {
          if (collapsedNodes.has(ancestor)) {
            hiddenByCollapse = true;
            break;
          }
          ancestor = category.skills[ancestor]?.parent ?? null;
        }

        // Trait skills are passive (no roll); all others: owned or untrained = rollable
        const rollable = !isTrait && (owned || !!skillDef.untrained);

        const abilityAbbr = abilities[skillDef.ability]?.abbr ?? skillDef.ability.toUpperCase();
        const breadcrumb = this._buildSkillBreadcrumb(skillKey, category.skills);
        const typeLabel = isTrait ? "Trait" : skillDef.untrained ? "Untrained" : "Skill";

        skills[skillKey] = {
          label: skillDef.label,
          ability: skillDef.ability,
          abilityAbbr,
          mod: abilityMod,
          modSigned: (abilityMod >= 0 ? "+" : "") + abilityMod,
          owned,
          canPurchase,
          hasExpertise: hasExp,
          rollable,
          isTrait,
          isParent,
          isCollapsed: collapsedNodes.has(skillKey),
          hiddenByCollapse,
          depth,
          indentPx: 8 + depth * 14,
          parent: skillDef.parent ?? null,
          untrained: !!skillDef.untrained,
          breadcrumb,
          tooltip: `${breadcrumb} • ${abilityAbbr} • ${typeLabel}`,
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

  /**
   * Build the full ancestor path for a skill: "Acrobatics › Parkour › Wall Runner"
   * @param {string} skillKey
   * @param {Record<string, Object>} categorySkills
   * @returns {string}
   */
  _buildSkillBreadcrumb(skillKey, categorySkills) {
    const path = [];
    let key = skillKey;
    while (key) {
      const def = categorySkills[key];
      if (!def) break;
      path.unshift(def.label);
      key = def.parent ?? null;
    }
    return path.join(" › ");
  }

  /* -------------------------------------------- */

  /**
   * Auto-collapse all parent skill nodes that have no owned descendants.
   * Called once on first sheet render; subsequent manual toggles are preserved.
   * @param {Set<string>} purchased  Set of purchased skill keys.
   */
  _initSkillCollapse(purchased) {
    this._skillNodesInitialized = true;
    for (const category of Object.values(VARLYN_SKILLS)) {
      const catSkills = category.skills;
      const childrenOf = {};
      for (const [sk, sd] of Object.entries(catSkills)) {
        if (sd.parent) {
          if (!childrenOf[sd.parent]) childrenOf[sd.parent] = [];
          childrenOf[sd.parent].push(sk);
        }
      }
      for (const parentKey of Object.keys(childrenOf)) {
        if (!this._hasOwnedDescendant(parentKey, purchased, childrenOf)) {
          this._collapsedSkillNodes.add(parentKey);
        }
      }
    }
  }

  /**
   * Check whether any descendant of a skill is in the purchased set.
   * @param {string} skillKey
   * @param {Set<string>} purchased
   * @param {Record<string, string[]>} childrenOf
   * @returns {boolean}
   */
  _hasOwnedDescendant(skillKey, purchased, childrenOf) {
    for (const child of childrenOf[skillKey] ?? []) {
      if (purchased.has(child)) return true;
      if (this._hasOwnedDescendant(child, purchased, childrenOf)) return true;
    }
    return false;
  }

  /* -------------------------------------------- */
  /*  Tab Management                               */
  /* -------------------------------------------- */

  /**
   * Activate a tab by directly toggling active classes on nav items and content divs.
   * Avoids changeTab() API differences across Foundry v14 builds.
   * @param {string} tab  The tab name to activate.
   */
  _activateTab(tab) {
    this.tabGroups.primary = tab;
    this.element.querySelectorAll(".sheet-tabs .item[data-tab]").forEach((el) => {
      el.classList.toggle("active", el.dataset.tab === tab);
    });
    this.element.querySelectorAll(".sheet-body .tab[data-group='primary']").forEach((el) => {
      el.classList.toggle("active", el.dataset.tab === tab);
    });
  }

  /* -------------------------------------------- */
  /*  Render Lifecycle                             */
  /* -------------------------------------------- */

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);

    // Activate default tab
    this._activateTab(this.tabGroups.primary ?? "abilities");

    // Tab navigation
    this.element.querySelectorAll(".sheet-tabs .item[data-tab]").forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        this._activateTab(event.currentTarget.dataset.tab);
      });
    });

    // ── Ability rolls: available to anyone who can view the sheet ──────────
    this.element.querySelector(".abilities-grid")?.addEventListener("click", (event) => {
      if (event.target.closest("[data-action='roll-ability']")) this._onAbilityRoll(event);
    });

    // ── Skills tab: rolls + collapse for everyone; purchases only for editable ──
    const skillsContent = this.element.querySelector(".skills-tab-content");
    if (skillsContent) {
      skillsContent.addEventListener("click", (event) => {
        if (event.target.closest("[data-action='roll-skill']")) {
          this._onSkillRoll(event);
          return;
        }
        if (event.target.closest("[data-action='toggle-skill-tree']")) {
          this._onToggleSkillCollapse(event);
          return;
        }
        // Below this point: editable-only actions
        if (!this.isEditable) return;
        if (event.target.closest("[data-action='purchase-skill']")) {
          this._onPurchaseSkill(event);
          return;
        }
        if (event.target.closest("[data-action='toggle-expertise']")) {
          this._onToggleExpertise(event);
        }
      });
    }

    // Restore collapse display state after re-render
    if (this._collapsedSkillNodes.size > 0) this._updateSkillDisplay();

    // ── Everything below is editable-only ─────────────────────────────────
    if (!this.isEditable) return;

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

    // Draggable attribute rolls for macro creation
    this.element.querySelectorAll(".attributes a.attribute-roll").forEach((a) => {
      a.setAttribute("draggable", true);
      a.addEventListener("dragstart", (ev) => {
        ev.dataTransfer.setData("text/plain", JSON.stringify(ev.currentTarget.dataset));
      });
    });
  }

  /* -------------------------------------------- */
  /*  Form Submission                              */
  /* -------------------------------------------- */

  /** @override */
  _processFormData(event, form, formData) {
    // Use formData.object directly — it is already the flat dot-notation update object.
    // Calling super here is unreliable across Foundry v14 builds (may return expanded,
    // flat, or FormDataExtended depending on version).
    let data = foundry.utils.flattenObject(formData.object);
    data = EntitySheetHelper.updateAttributes(data, this.document);
    data = EntitySheetHelper.updateGroups(data, this.document);
    return data;
  }

  /** @override — save pending form data when the sheet is closed. */
  async _preClose(options) {
    if (this.isEditable && this.element) {
      const form = this.element.querySelector("form");
      if (form) {
        try {
          const fde = new foundry.applications.ux.FormDataExtended(form);
          let data = foundry.utils.flattenObject(fde.object);
          data = EntitySheetHelper.updateAttributes(data, this.document);
          data = EntitySheetHelper.updateGroups(data, this.document);
          await this.document.update(data);
        } catch {
          // Errors on close are non-fatal — ignore.
        }
      }
    }
    return super._preClose(options);
  }

  /* -------------------------------------------- */
  /*  Skill Tree Collapse                          */
  /* -------------------------------------------- */

  /**
   * Toggle collapse state of a skill's subtree.
   * @param {MouseEvent} event
   */
  _onToggleSkillCollapse(event) {
    const el = event.target.closest("[data-action='toggle-skill-tree']");
    const skillKey = el?.dataset.skill;
    if (!skillKey) return;
    if (this._collapsedSkillNodes.has(skillKey)) this._collapsedSkillNodes.delete(skillKey);
    else this._collapsedSkillNodes.add(skillKey);
    this._updateSkillDisplay();
  }

  /**
   * Update skill item visibility and toggle icons based on collapse state.
   * Operates directly on DOM — no full re-render needed.
   */
  _updateSkillDisplay() {
    const collapsedNodes = this._collapsedSkillNodes;

    this.element.querySelectorAll(".skill-item[data-skill]").forEach((item) => {
      const skillKey = item.dataset.skill;
      const skillDef = findSkillDef(skillKey);
      if (!skillDef) return;
      let shouldHide = false;
      let ancestor = skillDef.parent;
      while (ancestor) {
        if (collapsedNodes.has(ancestor)) {
          shouldHide = true;
          break;
        }
        ancestor = findSkillDef(ancestor)?.parent ?? null;
      }
      item.classList.toggle("skill-hidden", shouldHide);
    });

    // Update chevron icons
    this.element.querySelectorAll("[data-action='toggle-skill-tree'][data-skill]").forEach((btn) => {
      const isCollapsed = collapsedNodes.has(btn.dataset.skill);
      const icon = btn.querySelector("i");
      if (icon) icon.className = isCollapsed ? "fas fa-chevron-right" : "fas fa-chevron-down";
      btn.closest(".skill-item")?.classList.toggle("skill-collapsed", isCollapsed);
    });
  }

  /* -------------------------------------------- */
  /*  Roll Handlers                                */
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

  /**
   * Roll a skill check.
   * - Trait skills: never rolled (guard in template, but also here for safety)
   * - Untrained skills: always 1d20 + mod (no disadvantage)
   * - Owned skills: 1d20 + mod
   * - Unowned non-untrained: 2d20kl (disadvantage)
   * - Expertise: 2d20kh (advantage)
   */
  _onSkillRoll(event) {
    const el = event.target.closest("[data-action='roll-skill']");
    const skillKey = el?.dataset.skill;
    if (!skillKey) return;
    const skillDef = findSkillDef(skillKey);
    if (!skillDef || skillDef.trait) return;

    const ability = this.document.system.abilities?.[skillDef.ability];
    const mod = Math.floor(((ability?.value ?? 10) - 10) / 2);
    const abilityAbbr = VARLYN.abilities[skillDef.ability]
      ? game.i18n.localize(VARLYN.abilities[skillDef.ability].abbreviation)
      : skillDef.ability.toUpperCase();

    // Build breadcrumb path for roll flavor
    let catSkills = null;
    for (const cat of Object.values(VARLYN_SKILLS)) {
      if (cat.skills[skillKey]) {
        catSkills = cat.skills;
        break;
      }
    }
    const breadcrumb = catSkills ? this._buildSkillBreadcrumb(skillKey, catSkills) : skillDef.label;

    const purchased = this.document.system.skills?.purchased ?? [];
    const expertise = this.document.system.skills?.expertise ?? [];
    const owned = purchased.includes(skillKey);
    const hasExpertise = expertise.includes(skillKey);

    let rollFormula;
    if (hasExpertise && owned) rollFormula = "2d20kh + @mod";
    else if (!owned && !skillDef.untrained) rollFormula = "2d20kl + @mod";
    else rollFormula = "1d20 + @mod";

    const r = new Roll(rollFormula, { mod });
    const modStr = mod >= 0 ? `+${mod}` : `${mod}`;
    return r.toMessage({
      user: game.user.id,
      speaker: ChatMessage.getSpeaker({ actor: this.document }),
      flavor: `<h3>${breadcrumb} <span class="skill-roll-ability">(${abilityAbbr} ${modStr})</span></h3>`,
    });
  }

  /* -------------------------------------------- */

  /** Purchase a skill by appending to system.skills.purchased. */
  async _onPurchaseSkill(event) {
    const el = event.target.closest("[data-action='purchase-skill']");
    const skillKey = el?.dataset.skill;
    if (!skillKey) return;
    const purchased = [...(this.document.system.skills?.purchased ?? [])];
    if (!purchased.includes(skillKey)) {
      purchased.push(skillKey);
      // Expand any collapsed ancestors so the user can immediately see the new skill.
      const skillDef = findSkillDef(skillKey);
      let ancestor = skillDef?.parent;
      while (ancestor) {
        this._collapsedSkillNodes.delete(ancestor);
        ancestor = findSkillDef(ancestor)?.parent ?? null;
      }
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
  /*  Item Controls                                */
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
