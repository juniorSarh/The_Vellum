import React, { useState } from "react";
import Input from "../src/components/input";
import Button from "../src/components/Button";
import "./login.css";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Please fill in both fields.");
      return;
    }

    console.log("Login Submitted:", { email, password });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Sign In</h2>

      <form className="login-form" onSubmit={handleSubmit}>
        <Input
          label="Email"
          type="email"
          placeholder="example@gmail.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Input
          label="Password"
          type="password"
          placeholder="Enter password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <Button
          name="Login"
          backgroundColor="#846D29"
          color="#fff"
          className="login-btn"
          // required so button submits the form instead of only clicking
          onClick={handleSubmit}
        />
      </form>
    </div>
  );
};

export default Login;
