const jwt = require('jsonwebtoken');

class TokenFactory {
  constructor(key) {
    this.privete = key;
  }

  generate(data) {
    return jwt.sign({
      exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24 * 14), // токен на 14 днів
      data
    }, this.privete);
  }

  check(token) {
    return new Promise((resolve, reject) => {
      jwt.verify(token, this.privete, function (err, decoded) {
        if (err) {
          reject(err);
        } else {
          let { exp, data } = decoded;
          if (exp > Math.floor(Date.now() / 1000)) {
            resolve(data);
          } else {
            reject({ message: 'Token expired please try login again', code: 'token-expired' })
          }
        }
      });
    })
  }
}

module.exports = new TokenFactory('FLIBER_API_PRIVATE_KEY');