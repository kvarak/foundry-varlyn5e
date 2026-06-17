import { EntitySheetHelper } from "./helper.js";
import { ATTRIBUTE_TYPES } from "./constants.js";

/**
 * Extend DocumentSheetV2 (ApplicationV2 framework) for item sheets.
 * Replaces V1 ItemSheet; see docs/ARCHITECTURE.md for migration notes.
 * @extends {foundry.applications.api.DocumentSheetV2}
 */
export class SimpleItemSheet extends foundry.applications.api.DocumentSheetV2 {
  /** @override */
  static DEFAULT_OPTIONS = {
    classes: ["varlyn5e", "sheet", "item"],
    position: { width: 520, height: 480 },
    form: { submitOnChange: true, closeOnSubmit: false },
  };

  /** @override */
  static PARTS = {
    form: {
      template: "systems/varlyn5e/templates/item-sheet.html",
      scrollable: [".attributes"],
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
      isOwner: doc.isOwner,
      editable: this.isEditable,
      cssClass: this.isEditable ? "editable" : "locked",
    };
    EntitySheetHelper.getAttributeData(context.data);
    context.descriptionHTML = await foundry.applications.ux.TextEditor.implementation.enrichHTML(
      context.systemData.description ?? "",
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
}
