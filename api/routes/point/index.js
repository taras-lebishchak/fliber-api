
const sql = require('../../../lib/sql');
const JWT = require('../../../lib/jwt');

module.exports = function (app) {
  app.get('/point', (req, res) => {
    console.log(req)
    res.json({})
    /*
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        sql.query(`SELECT * FROM order WHERE ${role}_id = ${id}`, function (error, results, fields) {
          if (!error) {
            res.json(results);
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
    }*/
  });


  app.post('/point', (req, res) => {
    let { authorization, role } = req.headers;
    if (authorization) {
      JWT.check(authorization).then(({ id }) => {
        var points = []
        if (Array.isArray(req.body)) {
          points = req.body;
        } else {
          points = [req.body];
        }
        Promise.all(points.map((point, index) => {
          return new Promise((resolve, reject) => {
            let { title, ln, lg, number, order_id } = point;
            sql.query(`INSERT INTO point (title,	ln,	lg,	number,	order_id ) VALUES ("${title}",${ln}, ${lg}, ${number}, ${order_id})`, function (error, results, fields) {
              if (!error) {
                resolve(results.insertId);
              } else {
                reject({ index, error });/*
                res.statusCode = 500;
                res.json({ message: 'Server error', code: 'server-error', error })*/
              }
            });
          })
        })).then(result => {
          res.json(result);
        }).catch(error => {
          res.statusCode = 500;
          res.json({ message: 'Server error', code: 'server_error' })
        })
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