import Header from "../../components/Header"
import Login from "../../components/Login"
import "./LoginPage.scss"
import { Link } from "react-router-dom"

const LoginPage = () => {
    return (
        <div>
            <Header header={"用户登录"} />
            <Link to="/">返回首页</Link>
            <div className="container">
                <Login />
            </div>
        </div>
    )
}

export default LoginPage;
