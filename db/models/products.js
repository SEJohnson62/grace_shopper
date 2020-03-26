const client = require("../client");

const products = {
  read: async () => {
    return (await client.query("SELECT * from products")).rows;
  },
  create: async ({ name, description, price, avail, image }) => {
    const SQL = `INSERT INTO products(name, description, price, avail, image) values($1, $2, $3, $4, $5) returning *`;
    return (await client.query(SQL, [name, description, price, avail, image])).rows[0];
  },
};

module.exports = products;
