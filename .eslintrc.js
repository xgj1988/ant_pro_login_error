module.exports = {
  parser: 'babel-eslint',
  extends: ['airbnb', 'prettier', 'plugin:compat/recommended'],
  env: {
    browser: true,
    node: true,
    es6: true,
    mocha: true,
    jest: true,
    jasmine: true
  },
  globals: {
    APP_TYPE: true
  },
  parserOptions: {
    ecmaFeatures: {
      legacyDecorators: true
    }
  },
  rules: {
    'max-len': [0],
    'no-underscore-dangle': [0],
    'space-unary-ops': [0],
    'linebreak-style': [0],
    'generator-star-spacing': [0],
    'consistent-return': [0],
    'react/forbid-prop-types': [0],
    'react/no-array-index-key': [0],
    'react/jsx-filename-extension': [1, { 'extensions': ['.js'] }],
    'react/jsx-one-expression-per-line': 0,
    'react/jsx-indent': [0],
    'global-require': [1],
    'import/prefer-default-export': [0],
    'react/jsx-no-bind': [0],
    'react/prop-types': [0],
    'react/prefer-stateless-function': [0],
    'react/jsx-tag-spacing': [0],
    'react/no-access-state-in-setstate': [0],
    'react/destructuring-assignment': [0],
    'react/jsx-wrap-multilines': ['error', {
      'declaration': 'parens-new-line',
      'assignment': 'parens-new-line',
      'return': 'parens-new-line',
      'arrow': 'parens-new-line',
      'condition': 'parens-new-line',
      'logical': 'parens-new-line',
      'prop': 'ignore'
    }],
    'indent': [0],
    'no-else-return': [0],
    'no-plusplus': [0],
    'no-param-reassign': [0],
    'no-restricted-syntax': [0],
    'import/no-extraneous-dependencies': [0],
    'no-use-before-define': [0],
    'jsx-a11y/no-static-element-interactions': [0],
    'jsx-a11y/no-noninteractive-element-interactions': [0],
    'jsx-a11y/click-events-have-key-events': [0],
    'jsx-a11y/anchor-is-valid': [0],
    'no-nested-ternary': [0],
    'arrow-body-style': [0],
    'import/extensions': [0],
    'prefer-destructuring': [0],
    'no-bitwise': [0],
    'no-cond-assign': [0],
    'import/no-unresolved': [0],
    'comma-dangle': [0],
//    'comma-dangle': ['error', {
//      'arrays': 'always-multiline',
//      'objects': 'always-multiline',
//      'imports': 'always-multiline',
//      'exports': 'always-multiline',
//      'functions': 'ignore'
//    }],
    'object-curly-spacing': [0],
    'object-curly-newline': [0],
    'function-paren-newline': [0],
    'no-restricted-globals': [0],
    'require-yield': [1],
    // 'quotes': ['error', 'single'],
    'no-sequences': [0]
  },
  settings: {
    polyfills: ['fetch', 'promises', 'url']
  }
};
