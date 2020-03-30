const express = require("express");
const app = express();
const path = require("path");
const db = require("./db");
const jwt = require("jwt-simple");
const models = db.models;

app.use("/dist", express.static(path.join(__dirname, "dist")));
app.use("/assets", express.static(path.join(__dirname, "assets")));

app.use(express.json());

const isLoggedIn = (req, res, next) => {
  if (!req.user) {
    const error = Error("not authorized");
    error.status = 401;
    return next(error);
  }
  next();
};

const isAdmin = (req, res, next) => {
  if (req.user.role !== "ADMIN") {
    return next(Error("not authorized"));
  }
  next();
};

app.use((req, res, next) => {
  const token = req.headers.authorization;
  if (!token) {
    return next();
  }
  db.findUserFromToken(token)
    .then((auth) => {
      req.user = auth;
      next();
    })
    .catch((ex) => {
      const error = Error("not authorized");
      error.status = 401;
      next(error);
    });
});

app.get("/", (req, res, next) =>
  res.sendFile(path.join(__dirname, "index.html"))
);

app.post("/api/auth", (req, res, next) => {
  db.authenticate(req.body)
    .then((token) => res.send({ token }))
    .catch(() => {
      const error = Error("not authorized");
      error.status = 401;
      next(error);
    });
});

app.get("/api/auth", isLoggedIn, (req, res, next) => {
  res.send(req.user);
});

app.get("/api/getCart", (req, res, next) => {
  db.getCart(req.user.id)
    .then((cart) => res.send(cart))
    .catch(next);
});

app.get("/api/getOrders", (req, res, next) => {
  db.getOrders(req.user.id)
    .then((orders) => res.send(orders))
    .catch(next);
});

app.post("/api/createOrder", (req, res, next) => {
  db.createOrder(req.user.id)
    .then((order) => res.send(order))
    .catch(next);
});

app.post("/api/users", async (req, res, next) => {
  try {
    const user = await db.models.users.create({ ...req.body, role: "USER" });
    const token = jwt.encode({ id: user.id }, process.env.JWT);
    delete user.password;
    //need the delete for security purposes
    res.send({ user, token });
  } catch (error) {
    next(error);
  }
});

app.get("/api/getLineItems", (req, res, next) => {
  db.getLineItems(req.user.id)
    .then((lineItems) => res.send(lineItems))
    .catch(next);
});

app.post("/api/addToCart", (req, res, next) => {
  // see db/userMethods.js
  db.addToCart({ userId: req.user.id, productId: req.body.productId, quantity: req.body.quantity })
    .then((lineItem) => {
      res.send(lineItem)
    })
    .catch(next);
});

app.delete("/api/removeFromCart/:id", (req, res, next) => {
  db.removeFromCart({ userId: req.user.id, lineItemId: req.params.id })
    .then(() => res.sendStatus(204))
    .catch(next);
});

app.get("/api/products", (req, res, next) => {
  db.models.products
    .read()
    .then((products) => res.send(products))
    .catch(next);
});

app.post("/api/addresses", (req,res,next)=>{
  db.createAddress(req.user.id, req.body.address)
    .then(response => res.send(response))
    .catch(next)
});

//add app.get("/api/addresses")
app.get("/api/addresses", (req,res,next)=>{
  db.readAddresses(req.user.id)
    .then(response => res.send(response))
})

// Update products table
app.put("/api/products", (req, res, next) => {
  db.updateProductAvail({id: req.body.id, avail: req.body.avail})
  .then((products) => res.send(products))
  .catch(next);

});

Object.keys(models).forEach((key) => {
  app.get(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .read({ user: req.user })
      .then((items) => res.send(items))
      .catch(next);
  });
  app.post(`/api/${key}`, isLoggedIn, isAdmin, (req, res, next) => {
    models[key]
      .create(req.body)
      .then((items) => res.send(items))
      .catch(next);
  });
});

app.use((req, res, next) => {
  const error = {
    message: `page not found ${req.url} for ${req.method}`,
    status: 404,
  };
  next(error);
});

app.use((err, req, res, next) => {
  console.log(err.status, err.message);
  res.status(err.status || 500).send({ message: err.message });
});

module.exports = app;
