module.exports = {
    "env": {
        "browser": true,
        "es6": true
    },
    "extends": "airbnb-base",
    "globals": {
        "Atomics": "readonly",
        "SharedArrayBuffer": "readonly",
        "Messenger": "writable"
    },
    "parserOptions": {
        "ecmaVersion": 2018,
        "sourceType": "module"
    },
    "rules": {
        "no-param-reassign": ["error", { "props": false }],
        "no-underscore-dangle": "off",
        "no-unused-expressions": ["warn", { "allowShortCircuit": true }],
        "max-len": ["error", { "code": 200 }],
        "no-restricted-globals": "warn",
        "consistent-return": "warn",
        "no-unused-vars": "warn",
    }
};