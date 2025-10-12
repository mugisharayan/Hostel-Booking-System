const crypto = require('crypto');

function generateToken() {
    return crypto.randomBytes(8).toString('hex').toUpperCase();

}

module.exports = generateToken;
