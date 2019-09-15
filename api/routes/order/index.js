
const sql = require('../../../lib/sql');
const JWT = require('../../../lib/jwt');

module.exports = function (app) {




  app.get('/order', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        sql.query(`SELECT * FROM \`order\` WHERE ${role}_id = ${id}`, function (error, orders, fields) {
          if (!error) {
            Promise.all(orders.map(order => new Promise((resolve, reject) => sql.query(`SELECT * FROM point WHERE order_id = ${order.id}`, function (error, points, fields) {
              if (!error) {
                resolve(Object.assign(order, { points: points.map(point => Object.assign({}, point)) }))
              } else {
                res.statusCode = 500;
                res.json({ message: 'Server error 1', code: 'server-error', error })
              }
            })))).then(result => {
              res.json(result);
            }).catch(error => {
              res.statusCode = 500;
              res.json({ message: 'Server error 2', code: 'server-error', error })
            })
          } else {
            res.statusCode = 500;
            res.json({ message: 'Server error 3', code: 'server-error', error })
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

  app.get('/order/active', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        sql.query(`SELECT * FROM \`order\`  WHERE driver_id IS NULL AND status = 'active'`, function (error, orders, fields) {
          if (!error) {
            Promise.all(orders.map(order => new Promise((resolve, reject) => sql.query(`SELECT * FROM point WHERE order_id = ${order.id}`, function (error, points, fields) {
              if (!error) {
                resolve(Object.assign(order, { points: points.map(point => Object.assign({}, point)) }))
              } else {
                res.statusCode = 500;
                res.json({ message: 'Server error 1', code: 'server-error', error })
              }
            })))).then(result => {
              res.json(result);
            }).catch(error => {
              res.statusCode = 500;
              res.json({ message: 'Server error 2', code: 'server-error', error })
            })
          } else {
            res.statusCode = 500;
            res.json({ message: 'Server error 3', code: 'server-error', error })
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



  app.post('/order', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        let { price, distance, is_freightage, size, weight, description, status, client_id, driver_id } = req.body
        sql.query(`INSERT INTO \`order\` (price, distance, is_freightage, size, weight, description, status, client_id, driver_id) 
                    VALUES (${price},${distance}, ${is_freightage}, ${size}, ${weight}, "${description}", "${status}", ${client_id}, ${driver_id})`,
          function (error, results, fields) {
            if (!error) {
              res.json(results.insertId);
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

  app.put('/order', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        console.log(`UPDATE  \`order\` SET driver_id = ${id} WHERE id = ${req.body.id}`);
        sql.query(`UPDATE  \`order\` SET driver_id = ${id} WHERE id = ${req.body.id}`,
          function (error, results, fields) {
            if (!error) {
              res.json({ status: true });
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


  app.put('/order/done', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        sql.query(`UPDATE  \`order\` SET status = 'done' WHERE id = ${req.body.id}`,
          function (error, results, fields) {
            if (!error) {
              res.json({ status: true });
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

  app.put('/order/cancel', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        if (role === 'driver') {
          sql.query(`UPDATE  \`order\` SET driver_id = NULL WHERE id = ${req.body.id}`,
            function (error, results, fields) {
              if (!error) {
                res.json({ status: true });
              } else {
                res.statusCode = 500;
                res.json({ message: 'Server error', code: 'server-error', error })
              }
            });
        } else {
          sql.query(`UPDATE  \`order\` SET status = 'canceled' WHERE id = ${req.body.id}`,
            function (error, results, fields) {
              if (!error) {
                res.json({ status: true });
              } else {
                res.statusCode = 500;
                res.json({ message: 'Server error', code: 'server-error', error })
              }
            });
        }

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