const client = require("../client");
const { hash } = require("../auth");

const users = {
  read: async () => {
    return (await client.query("SELECT * from users")).rows;
  },
  create: async ({ username, firstName, lastName, password, role }) => {
    const SQL = `INSERT INTO users(username, "firstName", "lastName", password, role) values($1, $2, $3, $4, $5) returning *`;
    return (
      await client.query(SQL, [
        username,
        firstName,
        lastName,
        await hash(password),
        role,
      ])
    ).rows[0];
  },
};

module.exports = users;
