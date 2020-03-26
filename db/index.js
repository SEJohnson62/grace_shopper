const client = require("./client");
const faker = require('faker');

const { authenticate, compare, findUserFromToken, hash } = require("./auth");

const models = ({ products, users, orders, lineItems } = require("./models"));

const {
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
} = require("./userMethods");

const sync = async () => {
  const SQL = `
    CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
    DROP TABLE IF EXISTS "lineItems";
    DROP TABLE IF EXISTS orders;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;
    CREATE TABLE users(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(100) NOT NULL UNIQUE,
      "firstName" VARCHAR(100) NOT NULL,
      "lastName" VARCHAR(100) NOT NULL,
      password VARCHAR(100) NOT NULL,
      role VARCHAR(20) DEFAULT 'USER',
      CHECK (char_length(username) > 0),
      CHECK (char_length("firstName") > 0)
    );

    CREATE TABLE products(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      name VARCHAR(100) NOT NULL UNIQUE,
      description VARCHAR(999),
      price DECIMAL NOT NULL,
      avail INTEGER,
      image VARCHAR(999),
      CHECK (char_length(name) > 0)
    );
    CREATE TABLE orders(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "userId" UUID REFERENCES users(id) NOT NULL,
      status VARCHAR(10) DEFAULT 'CART',
      "createdAt" TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
    CREATE TABLE "lineItems"(
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      "orderId" UUID REFERENCES orders(id) NOT NULL,
      "productId" UUID REFERENCES products(id) NOT NULL,
      quantity INTEGER DEFAULT 0
    );
  `;
  await client.query(SQL);

  const _users = {
    lucy: {
      username: "lucy",
      firstName: "Lucille",
      lastName: "Pincher",
      password: "LUCY",
      role: "ADMIN",
    },
    moe: {
      username: "moe",
      firstName: "Moe",
      lastName: "Durvish",
      password: "MOE",
      role: null,
    },
    curly: {
      username: "larry",
      firstName: "Larrold",
      lastName: "Bohannaghan",
      password: "LARRY",
      role: null,
    },
  };

  const _products = {
    foo: {
      name: "foo",
      description: "I am the greatest foo in all the universe",
      price: 2,
      avail: 0
    },
    bar: {
      name: "bar",
      price: 2,
      avail: 10,
    },
    bazz: {
      name: "bazz",
      price: 2.5,
      avail: 10,
    },
    quq: {
      name: "quq",
      price: 11.99,
      avail: 10,
    },
  };

  for(i =0; i<5; i++){
    let temp_name = faker.commerce.productName();
    let temp_URL = faker.image.image();
    //let temp_URL = 'https://picsum.photos/200'
    console.log(temp_URL)

    _products[temp_name] = {
      name: temp_name,
      price: faker.commerce.price(),
      avail: Math.ceil(Math.random()*10),
      description: faker.lorem.sentences(),
      image: temp_URL
    }
  }

  const [lucy, moe] = await Promise.all(
    Object.values(_users).map((user) => users.create(user))
  );

  //, t1, t2, t3, t4, t5
  const [foo] = await Promise.all(
    Object.values(_products).map((product) => products.create(product))
  );

  const _orders = {
    moe: {
      userId: moe.id,
    },
    lucy: {
      userId: lucy.id,
    },
  };

  const userMap = (await users.read()).reduce((acc, user) => {
    acc[user.username] = user;
    return acc;
  }, {});
  const productMap = (await products.read()).reduce((acc, product) => {
    acc[product.name] = product;
    return acc;
  }, {});
  return {
    users: userMap,
    products: productMap,
  };
};

module.exports = {
  sync,
  models,
  authenticate,
  findUserFromToken,
  getCart,
  getOrders,
  addToCart,
  removeFromCart,
  createOrder,
  getLineItems,
};
