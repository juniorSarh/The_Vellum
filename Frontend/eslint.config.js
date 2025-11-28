import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import tseslint from 'typescript-eslint'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      js.configs.recommended,
      tseslint.configs.recommended,
      reactHooks.configs['recommended-latest'],
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
    },
<<<<<<< HEAD
    rules: {
      'react-refresh/only-export-components': 'warn',
      'react-refresh/sort-comp': 'warn',
    },
  },
=======
  "rules": {
    "@typescript-eslint/no-explicit-any": "off"
  }
}
>>>>>>> 125d59c25ba85b117cb81e9c2e74445f248b9427
])
