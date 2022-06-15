const hash = require('crypto');

module.exports = (email) => hash.createHash('sha256').update(email).digest('hex');
