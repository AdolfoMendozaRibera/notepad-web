// @ts-check
import eslint from '@eslint/js';
import eslintPluginPrettier from 'eslint-plugin-prettier';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default tseslint.config({
  ignores: ['eslint.config.mjs'],
  languageOptions: {
    globals: {
      ...globals.node,
      ...globals.jest,
    },
    ecmaVersion: "latest", // Cambia a una versión más reciente si es necesario
    sourceType: 'module',
    parserOptions: {
      projectService: true,
      tsconfigRootDir: new URL('.', import.meta.url).pathname, // Usar URL para obtener el directorio
    },
  },
  rules: {
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/no-floating-promises': 'warn',
    '@typescript-eslint/no-unsafe-argument': 'warn',
  },
});

// Configuración extendida
export const configs = {
  recommended: {
    extends: [
      'eslint:recommended',
      'plugin:react/recommended',
      'prettier'
    ],
  },
};
