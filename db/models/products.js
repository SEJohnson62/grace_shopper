const client = require('../client');

const products = {
  read: async()=> {
    return (await client.query('SELECT * from products')).rows;
  },
  create: async({ name, price, avail })=> {
    const SQL = `INSERT INTO products(name, price, avail) values($1, $2, $3) returning *`;
    return (await client.query(SQL, [name, price, avail ])).rows[0];
  },
};

module.exports = products;
