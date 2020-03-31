import React, { useState } from "react";

const CreateAccount = ({ createAccount }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();
    createAccount({ username, firstName, lastName, password })
      .then(() => {
        setError("");
        window.location.hash = "#";
      })
      .catch((ex) => {
        setError(ex.response.data.message);
      });
  };
  return (
    <div>
      <form onSubmit={onSubmit}>
        <h2>Create Account</h2>
        <div>{error}</div>
        <div>Username</div>
        <input
          value={username}
          onChange={(ev) => setUsername(ev.target.value)}
        />
        <div>First Name</div>
        <input
          value={firstName}
          onChange={(ev) => setFirstName(ev.target.value)}
        />
        <div>Last Name</div>
        <input
          value={lastName}
          onChange={(ev) => setLastName(ev.target.value)}
        />
        <div>Password</div>
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Submit</button>
      </form>
      <button
        type="button"
        onClick={() => {
          window.location.hash = "#";
        }}
      >
        Sign In
      </button>
    </div>
  );
};

export default CreateAccount;
