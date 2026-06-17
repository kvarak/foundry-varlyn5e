import { EntitySheetHelper } from "./helper.js";
import { ATTRIBUTE_TYPES } from "./constants.js";

const { HandlebarsApplicationMixin } = foundry.applications.api;

/**
 * Extend DocumentSheetV2 (ApplicationV2 framework) for actor sheets.
 * Uses HandlebarsApplicationMixin to support .html templates.
 * Replaces V1 ActorSheet; see docs/ARCHITECTURE.md for migration notes.
 * @extends {foundry.applications.api.DocumentSheetV2}
 */
export class SimpleActorSheet extends HandlebarsApplicationMixin(foundry.applications.api.DocumentSheetV2) {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["varlyn5e", "sheet", "actor"],
    position: { width: 600, height: 600 },
    form: { submitOnChange: true, closeOnSubmit: false },
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/varlyn5e/templates/actor-sheet.html",
      scrollable: [".biography", ".items", ".attributes"],
    },
  };

  /** Tab group initial state @type {Record<string, string>} */
  tabGroups = { primary: "description" };

  /** @override */
  get title() {
    return this.document.name;
  }

  /* -------------------------------------------- */

  /** @override */
  async _prepareContext(options) {
    const doc = this.document;
    const docData = doc.toObject(false);
    const context = {
      data: docData,
      systemData: docData.system,
      dtypes: ATTRIBUTE_TYPES,
      shorthand: !!game.settings.get("varlyn5e", "macroShorthand"),
      isOwner: doc.isOwner,
      editable: this.isEditable,
      cssClass: this.isEditable ? "editable" : "locked",
    };
    EntitySheetHelper.getAttributeData(context.data);
    context.biographyHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.systemData.biography ?? "",
      { secrets: doc.isOwner, async: true }
    );
    return context;
  }

  /* -------------------------------------------- */

  /** @override */
  _onRender(context, options) {
    super._onRender(context, options);

    // Initialize active tab
    this.changeTab(this.tabGroups.primary ?? "description", "primary");

    // Tab navigation
    this.element.querySelectorAll(".sheet-tabs .item[data-tab]").forEach((tab) => {
      tab.addEventListener("click", (event) => {
        event.preventDefault();
        this.changeTab(event.currentTarget.dataset.tab, "primary");
      });
    });

    // Everything below is only needed if the sheet is editable
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

  /**
   * Handle click events for Item control buttons within the Actor Sheet
   * @param {MouseEvent} event
   * @private
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
   * @param {MouseEvent} event    The originating left click event
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
