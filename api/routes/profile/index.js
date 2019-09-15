
const sql = require('../../../lib/sql');
const JWT = require('../../../lib/jwt');

module.exports = function (app) {


  app.get('/profile', (req, res) => {
    let { authorization } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        sql.query(`SELECT name,email FROM user WHERE id = ${id}`, function (error, results, fields) {
          if (!error) {
            let { name, email } = results[0];
            sql.query(`SELECT * FROM \`order\` WHERE driver_id = ${id} AND status = 'active' `, function (error, orders, fields) {
              if (!error) {
                if (orders[0]) {
                  sql.query(`SELECT * FROM point WHERE order_id = ${orders[0].id} ORDER BY number`, function (error, points, fields) {
                    if (!error) {
                      res.json({ id, name, email, order: Object.assign(orders[0], { points: points.map(point => Object.assign({}, point)) }) });
                    } else {
                      res.statusCode = 500;
                      res.json({ message: 'Server error 1', code: 'server-error', error })
                    }
                  })
                } else {
                  res.json({ id, name, email });
                }
              } else {
                res.statusCode = 500;
                res.json({ message: 'Server error', code: 'server-error', error })
              }
            });
          } else {
            res.statusCode = 500;
            res.json({ message: 'Server error', code: 'server-error', error })
          }
        });
      }).catch(err => {
        res.statusCode = 401;
        res.json(err)
      })
    } else {
      res.statusCode = 401;
      res.json({ message: 'Unauthorized', code: 'unauthorized' })
    }
  });




}