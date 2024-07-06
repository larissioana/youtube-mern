import '../login/login.scss';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { axiosInstance } from '../../utils/axios';

const SignUp = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axiosInstance.post("/auth/signup", {
                name,
                email,
                password
            });
            navigate("/login")
        } catch (err) {
            setMessage(err.response.data);
            console.log(err)
        }
    };

    const handlePasswordChange = (e) => {
        setPassword(e.target.value);
        setMessage("");
    };

    return (
        <div className="login-container">
            <form>
                <h2>Create Your Account</h2>
                <input type="text" required placeholder="username" onChange={(e) => setName(e.target.value)} />
                <input type="text" required placeholder="email" onChange={(e) => setEmail(e.target.value)} />
                <input type="password" required placeholder="password" onChange={handlePasswordChange} />
                <button onClick={handleSubmit}>Sign up</button>
                {
                    message &&
                    <p>{message}</p>
                }
                <p>{"Already have an account?"}</p>
                <Link to="/login" style={{
                    textDecoration: "underline",
                    fontWeight: "bold"
                }}>Sign in</Link>
            </form>
        </div>
    )
};

export default SignUp;
