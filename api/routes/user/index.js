
const sql = require('../../../lib/sql');
const JWT = require('../../../lib/jwt');

module.exports = function (app) {
  app.get('/user', (req, res) => {
    
    console.log(req.query);
    /*
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
    });*/
  });


  
}