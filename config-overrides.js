// config-overrides.js
module.exports = function override(config) {
    // Add rule for .cjs files
    config.module.rules.push({
        test: /\.cjs$/,
        type: 'javascript/auto',
    });
    return config;
};
