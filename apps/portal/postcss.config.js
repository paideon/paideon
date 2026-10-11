const { join } = require('node:path');
const { createPostcssConfig } = require('@paideon/config/postcss');

module.exports = createPostcssConfig(join(__dirname, 'tailwind.config.js'));
