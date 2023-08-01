import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import Header from "../../components/Header";
import { useEffect, useState } from "react";

const Profile = () => {
    const [name, setName] = useState("");
    const navigate = useNavigate()

    useEffect(() => {
        if (localStorage.getItem("login") !== "true") {
            navigate("/login")
        }
    }, [])

    const changeProfile = (e) => {
        e.preventDefault()
        const formData = new FormData()
        formData.append('avatar', e.target.elements.avatar.files[0])
        const auth = axios.create({
            headers: {
                Authorization: localStorage.getItem("token"),
            }
        })
        auth
            .post("http://localhost:2000/api/authorized/profile", formData)
            .catch(err => {
                if (err.response.status === 401) {
                    localStorage.setItem("login", false)
                    navigate("/login")
                }
            })
    }

    return (
        <div>
            <Header header={"个人资料"} />
            <Link to="/">返回首页</Link>
            <img
                src={`http://localhost:2000/mybucket/${localStorage.getItem("username")}?tempid=${Math.random()}`}
                height={100}
                width={100}
            />
            <form encType="multipart/form-data" onSubmit={changeProfile}>
                <input
                    type="text"
                    value={name}
                    name="name"
                    placeholder="姓名"
                    onChange={({ target }) => setName(target.value)}
                />
                <input
                    type="file"
                    name="avatar"
                    accept="image/*"
                />
                <button type="submit">上传</button>
            </form>
        </div>
    );
};

export default Profile;
