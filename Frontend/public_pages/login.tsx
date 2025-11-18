import React, { useState } from "react";
import Input from "../src/components/input";
import Button from "../src/components/Button";
import "./login.css";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      alert("Email and password required");
      return;
    }

    console.log("Logged in:", { email, password });
  };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>

      <form className="login-form" onSubmit={handleLogin}>
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
          onClick={handleLogin}
        />
      </form>
    </div>
  );
}
