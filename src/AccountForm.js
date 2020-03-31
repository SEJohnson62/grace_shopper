import React, { useState, useEffect } from "react";

const AccountForm = ({ auth, updateAccount }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = (ev) => {
    ev.preventDefault();
    updateAccount({ ...auth, password })
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
        <h2>Update Account</h2>
        <div>{error}</div>
        <div>Change Password</div>
        <input
          value={password}
          onChange={(ev) => setPassword(ev.target.value)}
        />
        <button>Submit</button>
      </form>
    </div>
  );
};

export default AccountForm;
