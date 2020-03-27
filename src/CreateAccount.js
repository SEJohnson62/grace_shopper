import React, { useState, useEffect } from "react";

const CreateAccount = ({ createAccount }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();
    createAccount({ userName })
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
          value={userName}
          onChange={(ev) => setUserName(ev.target.value)}
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
          return deleteSchool(school);
        }}
      >
        Delete School
      </button>
    </div>
  );
};

export default CreateAccount;
