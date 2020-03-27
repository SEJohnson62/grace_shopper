import React, { useState, useEffect } from "react";
import CreateAccount from "./CreateAccount";
import qs from "qs";

const Login = ({ login }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [params, setParams] = useState(qs.parse(window.location.hash.slice(1)));

  useEffect(() => {
    window.addEventListener("hashchange", () => {
      setParams(qs.parse(window.location.hash.slice(1)));
    });
  }, []);

  const createAccount = async (newUser) => {
    try {
      const createdUser = (await axios.post("/api/users/", newUser)).data;
      setAuth([...auth, createdUser]);
      setError("");
    } catch (ex) {
      setError(ex.response.data.message);
    }
  };

  const onSubmit = (ev) => {
    ev.preventDefault();
    login({ username, password }).catch((ex) =>
      setError(ex.response.data.message)
    );
  };

  const { view } = params;

  return (
    <div>
      {view === "createAccount" && (
        <CreateAccount createAccount={createAccount} />
      )}

      {!view && (
        <form onSubmit={onSubmit}>
          <h1>Login</h1>
          <div className="error">{error}</div>
          <input
            value={username}
            onChange={(ev) => setUsername(ev.target.value)}
          />
          <input
            value={password}
            onChange={(ev) => setPassword(ev.target.value)}
          />
          <button>Login</button>
          <a href={`#view=createAccount`}>Sign Up</a>
        </form>
      )}
    </div>
  );
};

export default Login;
