import js from "@eslint/js";
import globals from "globals";

export default [
  js.configs.recommended,
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: "module",
      globals: {
        ...globals.browser,
        ...globals.node,
        // Foundry VTT globals
        game: "readonly",
        canvas: "readonly",
        ui: "readonly",
        foundry: "readonly",
        CONFIG: "readonly",
        CONST: "readonly",
        Hooks: "readonly",
        Actor: "readonly",
        Actors: "readonly",
        ActorSheet: "readonly",
        Item: "readonly",
        Items: "readonly",
        ItemSheet: "readonly",
        Dialog: "readonly",
        Application: "readonly",
        FormApplication: "readonly",
        FormDataExtended: "readonly",
        Roll: "readonly",
        ChatMessage: "readonly",
        Token: "readonly",
        TokenDocument: "readonly",
        Scene: "readonly",
        Macro: "readonly",
        User: "readonly",
        Folder: "readonly",
        Combat: "readonly",
        Combatant: "readonly",
        Handlebars: "readonly",
        loadTemplates: "readonly",
        mergeObject: "readonly",
        duplicate: "readonly",
        expandObject: "readonly",
        flattenObject: "readonly",
        getProperty: "readonly",
        setProperty: "readonly",
        hasProperty: "readonly",
        diffObject: "readonly",
        isNewerVersion: "readonly",
        randomID: "readonly",
        TextEditor: "readonly",
        FilePicker: "readonly",
        renderTemplate: "readonly",
        getDocumentClass: "readonly",
        $: "readonly", // jQuery
      },
    },
    rules: {
      // Possible errors
      "no-unused-vars": ["warn", { args: "none", ignoreRestSiblings: true }],
      "no-console": "off",

      // Best practices
      "eqeqeq": ["error", "always", { null: "ignore" }],
      "no-var": "error",
      "prefer-const": "warn",
      "prefer-arrow-callback": "warn",

      // Style
      "indent": ["error", 2, { SwitchCase: 1 }],
      "quotes": ["error", "double", { avoidEscape: true }],
      "semi": ["error", "always"],
      "comma-dangle": ["error", "only-multiline"],
      "no-trailing-spaces": "error",
      "eol-last": ["error", "always"],
    },
    ignores: [
      "node_modules/**",
      "styles/**/*.css",
      ".git/**",
    ],
  },
];
