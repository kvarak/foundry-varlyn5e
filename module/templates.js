/**
 * Define a set of template paths to pre-load
 * Pre-loaded templates are compiled and cached for fast access when rendering
 * @return {Promise}
 */
export const preloadHandlebarsTemplates = async function () {
  // Define template paths to load
  const templatePaths = [
    // Attribute partials
    "systems/varlyn5e/templates/parts/sheet-attributes.html",
    "systems/varlyn5e/templates/parts/sheet-groups.html",
    // Actor partials
    "systems/varlyn5e/templates/parts/actor-abilities.html",
    "systems/varlyn5e/templates/parts/actor-skills.html",
  ];

  // Load the template parts
  return foundry.applications.handlebars.loadTemplates(templatePaths);
};
