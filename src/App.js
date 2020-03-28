import React, { useState, useEffect } from "react";
import qs from "qs";
import axios from "axios";
import Login from "./Login";
import Orders from "./Orders";
import Cart from "./Cart";
import Products from "./Products";
import Product_details from "./product_details";
import CreateAccount from "./CreateAccount";

const headers = () => {
  const token = window.localStorage.getItem("token");

  return {
    headers: {
      authorization: token,
    },
  };
};

const App = () => {
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));
  const [auth, setAuth] = useState({});
  const [orders, setOrders] = useState([]);
  const [cart, setCart] = useState({});
  const [products, setProducts] = useState([]);
  const [lineItems, setLineItems] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    axios.get("/api/products").then((response) => setProducts(response.data));
  }, []);

  useEffect(() => {
    if (auth.id) {
      const token = window.localStorage.getItem("token");
      axios.get("/api/getLineItems", headers()).then((response) => {
        setLineItems(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getCart", headers()).then((response) => {
        setCart(response.data);
      });
    }
  }, [auth]);

  useEffect(() => {
    if (auth.id) {
      axios.get("/api/getOrders", headers()).then((response) => {
        setOrders(response.data);
      });
    }
  }, [auth]);

  const login = async (credentials) => {
    const token = (await axios.post("/api/auth", credentials)).data.token;
    window.localStorage.setItem("token", token);
    exchangeTokenForAuth();
  };

  const createAccount = async (newUser) => {
    try {
      const response = (await axios.post("/api/users", newUser)).data;
      window.localStorage.setItem("token", response.token);
      setAuth(response.user);
      setError("");
    } catch (ex) {
      setError(ex.response.data.message);
    }
  };

  const exchangeTokenForAuth = async () => {
    const response = await axios.get("/api/auth", headers());
    setAuth(response.data);
  };

  const logout = () => {
    window.localStorage.removeItem("token");
    window.location.hash = "#";
    setAuth({});
  };

  useEffect(() => {
    exchangeTokenForAuth();
  }, []);

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const createOrder = () => {
    const token = window.localStorage.getItem("token");
    axios
      .post("/api/createOrder", null, headers())
      .then((response) => {
        setOrders([response.data, ...orders]);
        const token = window.localStorage.getItem("token");
        return axios.get("/api/getCart", headers());
      })
      .then((response) => {
        setCart(response.data);
      });
  };

  const addToCart = (productId, quantity) => {
    console.log("In addToCart", quantity);
    axios
      .post("/api/addToCart", { productId, quantity }, headers())
      .then((response) => {
        const lineItem = response.data;
        lineItem.quantity = quantity;
        console.log(lineItem);
        const found = lineItems.find(
          (_lineItem) => _lineItem.id === lineItem.id
        );
        if (!found) {
          setLineItems([...lineItems, lineItem]);
        } else {
          const updated = lineItems.map((_lineItem) =>
            _lineItem.id === lineItem.id ? lineItem : _lineItem
          );
          setLineItems(updated);
        }
      });
  };

  const removeFromCart = (lineItemId) => {
    axios.delete(`/api/removeFromCart/${lineItemId}`, headers()).then(() => {
      setLineItems(
        lineItems.filter((_lineItem) => _lineItem.id !== lineItemId)
      );
    });
  };

  const { view } = params;
  console.log(params);

  if (!auth.id && !view) {
    //says something is wrong here with auth.id
    return <Login login={login} />;
  } else if (!auth.id && view === "createAccount") {
    return <CreateAccount createAccount={createAccount} />;
  } else {
    return (
      <div>
        <h1>
          <a href={"#"}> Foo, Bar, Bazz.. etc Store</a>
        </h1>
        <span></span>
        <button onClick={logout}>
          Logout {auth.firstName} {auth.lastName}{" "}
        </button>
        {view === "product" && (
          <Product_details
            product={products.filter((product) => product.id === params.id)}
          />
        )}
        {!view && (
          <div className="horizontal">
            <Products addToCart={addToCart} products={products} />
            <Cart
              lineItems={lineItems}
              removeFromCart={removeFromCart}
              cart={cart}
              createOrder={createOrder}
              products={products}
            />
            <Orders lineItems={lineItems} products={products} orders={orders} />
          </div>
        )}
      </div>
    );
  }
};

export default App;

/*
                console.log("product id:", product.id)
                console.log(" params.id:", params.id)
                return(product.id === params.id)
                */
