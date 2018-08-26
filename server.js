const express = require('express');
const app = express();
const port = process.env.PORT || 5000;

var pg = require('pg');
var bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var config = {
  user: 'cheeraw',
  host: '127.0.0.1',
  database: 'artshop',
  password: '1234',
  port: 5432,
  max: 10,
  idleTimeoutMillis: 30000,
};

var pool = new pg.Pool(config);

var bcrypt = require('bcrypt');

const saltRounds = 12;
/*
const text = "INSERT INTO public.artists(username, email, password_hash, salt) VALUES($1, $2, $3, $4)";
const values = ["ssss","b","c","d"];

pool.connect((err, client, done) => {
  if(err) {
    return console.error("error fetching client from pool", err);
  }
  client.query(text, values, (err, result) => {
    done();

    if(err) {
      return console.error("error running query", err);
    }
    console.log(result.rows[0]);
  });
});

pool.end();
*/
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.post('/register/submit', (req, res, next) => {
  var username = req.body.username;
  var email = req.body.email;
  var password = req.body.password;
  var firstname = req.body.firstname;
  var lastname = req.body.lastname;
  var country = req.body.country;
  var city = req.body.city;

  bcrypt.genSalt(saltRounds, function(err, salt) {
    bcrypt.hash(password, salt, function(err, hash) {
      var password_hash = hash;

      pool.connect((err, client, done) => {
        if(err) {
          return console.error("error fetching client from pool", err);
        }
        var sql = "WITH ins AS (INSERT INTO public.artists (username, email, password_hash) VALUES ($1, $2, $3) RETURNING id) INSERT INTO public.artistDetails (artist_id, firstname, lastname, country, city) VALUES ((SELECT id FROM ins), $4, $5, $6, $7)";
        var values = [username, email, password_hash, firstname, lastname, country, city];
        console.log(values);
        client.query(sql, values, (err, result) => {
          done();

          if(err) {
            res.status(406).send({ message: "failed" });
            console.log("error running query", err);
          } else {
            res.status(200).send({ message: "success" });
            console.log("register successful");
          }
        });
      });
    });
  });
});

app.get("/register/usercheck", (req, res, next) => {
  var username = req.query.username;

  var sql = "SELECT * FROM public.artists WHERE username=$1";
  var values = [username];

  pool.connect((err, client, done) => {
    if(err) {
      return console.error("error fetching client from pool", err);
    }

    client.query(sql, values, (err, result) => {
      done();

      if(err) {
        res.status(406).send({ error: "error running query " + err});
        return console.error("error running query", err);
      } else {
        if(typeof(result.rows[0]) === 'undefined') {
          res.status(200).send({message: "userOK"});
        } else {
          res.status(200).send({message: "userExists"});
        }
        return console.log("username checked");
      }
    });
  });
});

app.get("/register/emailcheck", (req, res, next) => {
  var email = req.query.email;

  var sql = "SELECT * FROM public.artists WHERE email=$1";
  var values = [email];

  pool.connect((err, client, done) => {
    if(err) {
      return console.error("error fetching client from pool", err);
    }

    client.query(sql, values, (err, result) => {
      done();

      if(err) {
        res.status(406).send({ error: "error running query " + err});
        return console.error("error running query", err);
      } else {
        if(typeof(result.rows[0]) === 'undefined') {
          res.status(200).send({message: "emailOK"});
        } else {
          res.status(200).send({message: "emailExists"});
        }
        return console.log("username checked");
      }
    });
  });
});

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get('/express_backend', (req, res) => {
  res.send({ express: 'YOUR EXPRESS BACKEND IS CONNECTED TO REACT' });
});
