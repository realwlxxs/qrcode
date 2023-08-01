import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header"
import axios from "axios";
import "./Register.scss"

const Register = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [password2, setPassword2] = useState("");
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleRegister = (e) => {
        e.preventDefault()
        if (password !== password2) {
            setMessage("两次输入的密码不同")
            return
        }
        setMessage("")
        const registerObject = {
            username: username,
            password: password,
        }
        axios
            .post("http://localhost:2000/api/register", registerObject)
            .then(res => {
                if (res.data === "username has been taken") {
                    setMessage("用户名已被占用")
                    return
                }
                axios
                    .post("http://localhost:2000/api/login", registerObject)
                    .then(res => {
                        localStorage.setItem("token", res.data)
                        localStorage.setItem("login", true)
                        localStorage.setItem("username", username)
                        navigate("/")
                    })
            })
    }

    return (
        <div>
            <Header header={"用户注册"} />
            <Link to="/">返回首页</Link>
            <div className="container">
                <div className="register">
                    <form onSubmit={handleRegister}>
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
                        <input
                            type="password"
                            value={password2}
                            name="password2"
                            placeholder="确认密码"
                            onChange={({ target }) => setPassword2(target.value)}
                        />
                        <div className="button-container">
                            <button type="button" onClick={() => { navigate("/login") }}>返回登录</button>
                            <button type="submit">注册</button>
                        </div>
                    </form>
                    <p>{message}</p>
                </div>
            </div>
        </div>
    )
}

export default Register;
