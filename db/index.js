const { Pool } = require('pg');

const pool = new Pool({
  user: 'cheeraw',
  host: '127.0.0.1',
  database: 'artshop',
  password: '1234',
  port: 50851
});

module.exports = {
  query: (text, params, callback) => {
    return pool.query(text, params, callback)
  }
}
