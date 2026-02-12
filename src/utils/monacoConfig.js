import * as monaco from 'monaco-editor';

/**
 * @fileoverview Monaco Editor configuration utilities.
 * Provides helper functions to:
 * - Register custom autocomplete suggestions
 * - Add simulated syntax error markers
 *
 * @module utils/monacoConfig
 */

/**
 * Registers custom autocomplete suggestions for a given language.
 *
 * @function registerAutocomplete
 * @param {string} language - Programming language (e.g., "javascript", "typescript").
 * @returns {void}
 *
 * @example
 * // Enable autocomplete for JavaScript
 * registerAutocomplete("javascript");
 */
export const registerAutocomplete = (language) => {
  monaco.languages.registerCompletionItemProvider(language, {
    provideCompletionItems: () => ({
      suggestions: [
        {
          label: 'console.log',
          kind: monaco.languages.CompletionItemKind.Function,
          insertText: 'console.log(${1})',
          insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
          documentation: 'Prints to the console',
        },
      ],
    }),
  });
};

/**
 * Adds simulated syntax error markers to the Monaco editor instance.
 *
 * @function highlightErrors
 * @param {monaco.editor.IStandaloneCodeEditor} editor - Monaco editor instance.
 * @returns {void}
 *
 * @example
 * // Highlight errors in the current editor instance
 * highlightErrors(editorInstance);
 */
export const highlightErrors = (editor) => {
  const model = editor.getModel();
  const markers = [
    {
      startLineNumber: 1,
      startColumn: 1,
      endLineNumber: 1,
      endColumn: 10,
      message: 'Simulated syntax error',
      severity: monaco.MarkerSeverity.Error,
    },
  ];
  monaco.editor.setModelMarkers(model, 'owner', markers);
};
