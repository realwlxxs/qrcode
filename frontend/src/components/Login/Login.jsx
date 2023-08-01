import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./Login.scss";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault()
    const loginObject = {
      username: username,
      password: password,
    }
    axios
      .post("http://localhost:2000/api/login", loginObject)
      .then(res => {
        if (res.data === "user not found") {
          setMessage("用户不存在");
        } else if (res.data === "wrong password") {
          setMessage("密码错误")
        } else {
          setMessage("")
          localStorage.setItem("token", res.data)
          localStorage.setItem("login", true)
          localStorage.setItem("username", username)
          navigate("/")
        }
      })
  }

  return (
    <div className="login">
      <form onSubmit={handleLogin}>
        <input
          type="text"
          value={username}
          name="username"
          placeholder="用户名"
          onChange={({ target }) => setUsername(target.value)}
        />
        <input
          type="password"
          value={password}
          name="password"
          placeholder="密码"
          onChange={({ target }) => setPassword(target.value)}
        />
        <div className="button-container">
          <button type="button" onClick={() => { navigate("/register") }}>没有帐号</button>
          <button type="submit">登录</button>
        </div>
      </form>
      <p>{message}</p>
    </div >
  )
};

export default Login;
