module.exports = {
    env: {
        browser: true,
        es6: true
    },
    extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:promise/recommended',
        'plugin:import/errors',
        'plugin:import/warnings',
        'plugin:import/typescript',
        'prettier',
        'prettier/@typescript-eslint'
    ],
    parser: '@typescript-eslint/parser',
    parserOptions: {
        ecmaFeatures: {
            jsx: true
        },
        ecmaVersion: 2019,
        sourceType: 'module'
    },
    plugins: ['prettier', '@typescript-eslint', 'promise', 'import'],
    settings: {
        react: {
            version: 'detect'
        },
        'import/resolver': {
            typescript: {}
        }
    },
    rules: {
        'import/order': [
            'warn',
            {
                groups: ['external', 'internal', 'unknown', 'builtin', 'parent', 'sibling', 'index'],
                'newlines-between': 'always'
            }
        ],
        'import/default': 'off',
        'import/first': 'warn',
        'import/no-named-as-default-member': 'off',
        'import/named': 'off',
        'import/namespace': 'off',
        'prettier/prettier': 'warn',
        '@typescript-eslint/explicit-function-return-type': 'off',
        '@typescript-eslint/explicit-module-boundary-types': 'off',
        '@typescript-eslint/array-type': 'warn',
        '@typescript-eslint/explicit-member-accessibility': [
            'warn',
            {
                overrides: {
                    constructors: 'off'
                }
            }
        ],
        '@typescript-eslint/prefer-for-of': 'warn',
        '@typescript-eslint/prefer-function-type': 'warn',
        'no-trailing-spaces': 'warn',
        'prefer-const': 'warn',
        'comma-dangle': ['warn', 'never'],
        curly: 'warn',
        'dot-notation': 'warn',
        'no-var': 'warn',
        'prefer-object-spread': 'warn',
        'prefer-template': 'warn',
        'promise/catch-or-return': 'warn',
        'promise/always-return': 'off',
        radix: 'warn',
        yoda: 'warn'
    },
    overrides: [
        {
            files: ['*.js'],
            rules: {
                'no-undef': 'off'
            }
        }
    ]
};
