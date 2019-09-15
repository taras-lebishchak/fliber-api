
const sql = require('../../../lib/sql');
const JWT = require('../../../lib/jwt');

module.exports = function (app) {
  app.post('/signin', (req, res) => {
    let { email, password } = req.body;
    sql.query(`SELECT id,name,email FROM user WHERE email = "${email}" AND password = "${password}"`, function (error, results, fields) {
      if (!error) {
        if (results.length == 1) {
          let { id, name, email } = results[0];
          res.json({ token: JWT.generate({ id, name, email }) });
        } else {
          res.statusCode = 400;
          res.json({ message: 'User not exist, or wrong email and password', code: 'wrong-auth' })
        }
      } else {
        res.statusCode = 500;
        res.json({ message: 'Server error', code: 'server-error', error })
      }
    });
  });


  app.post('/signup', (req, res) => {
    let { email, name, password } = req.body;
    sql.query(`SELECT * FROM user WHERE email = "${email}"`, function (error, results, fields) {
      if (!error) {
        if (results.length === 0) {
          sql.query(`
          INSERT INTO user (name, email, password)
          VALUES ("${name}", "${email}", "${password}");
          `, function (error, results, fields) {
              let { insertId } = results;
              if (!error) {
                res.json({ token: JWT.generate({ id: insertId, email, name }) });
              } else {
                res.statusCode = 500;
                res.json({ message: 'Server error', code: 'server-error', error })
              }
            })
        } else {
          res.statusCode = 400;
          res.json({ message: 'User with same email is exist', code: 'email-exist' })
        }
      }
    });
  });
}