/** @typedef {import("prettier").Config} PrettierConfig */
/** @typedef {import("prettier-plugin-tailwindcss").PluginOptions} TailwindConfig */
/** @typedef {import("@ianvs/prettier-plugin-sort-imports").PluginConfig} SortImportsConfig */

/**
 * Prettier configuration
 *
 * Architecture:
 * app → features → integrations → core → other internal modules → relative imports
 *
 * Keeping imports ordered by architectural layer reinforces the project's
 * dependency hierarchy and makes violations easier to spot during review.
 *
 * @type {PrettierConfig | SortImportsConfig | TailwindConfig}
 */
const config = {
  // Formatting
  arrowParens: "avoid",
  bracketSameLine: false,
  bracketSpacing: true,
  endOfLine: "lf",
  htmlWhitespaceSensitivity: "css",
  printWidth: 100,
  proseWrap: "preserve",
  quoteProps: "consistent",
  semi: false,
  singleQuote: false,
  tabWidth: 2,
  trailingComma: "es5",
  useTabs: false,

  // Plugins (Tailwind must be last)
  plugins: [
    "@prettier/plugin-oxc",
    "@ianvs/prettier-plugin-sort-imports",
    "prettier-plugin-tailwindcss",
  ],

  // Tailwind
  tailwindFunctions: ["cn", "cva"],

  /**
   * Import order
   *
   * Groups are ordered from the outermost dependency layer to the innermost.
   * Imports within each group are sorted alphabetically by the plugin.
   */
  importOrder: [
    // Frameworks
    "^(next$)",
    "^(next/.*)$",
    "^(react$)",
    "^(react/.*)$",
    "",
    // Node.js & third-party packages
    "<BUILTIN_MODULES>",
    "<THIRD_PARTY_MODULES>",
    "",
    // Project architecture
    "^@/app/(.*)$",
    "",
    "^@/features/(.*)$",
    "",
    "^@/integrations/(.*)$",
    "",
    "^@/core/(.*)$",
    "",
    // Other internal aliases
    "^@/(?!app|features|integrations|core)(?:.*)$",
    "",
    // Relative imports (furthest first)
    "^(?:[.][.]/){2,}(?!.*[.]css$)(.*)$",
    "",
    "^[.][.]/(?!.*[.]css$)(.*)$",
    "",
    "^[.]/(?:[(][^)]+[)]/)?_(?!.*[.]css$)(.*)$",
    "",
    "^[.]/(?!.*[.]css$)(.*)$",
    "",
    // Styles
    "[.]css$",
  ],

  importOrderParserPlugins: ["typescript", "jsx", "decorators-legacy"],

  importOrderTypeScriptVersion: "5.0.0",

  overrides: [
    {
      files: "*.json.hbs",
      options: {
        parser: "json",
      },
    },
    {
      files: "*.ts.hbs",
      options: {
        parser: "babel",
      },
    },
  ],
}

export default config
