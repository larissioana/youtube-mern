import { useState } from 'react';
import './login.scss';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { loginFailure, loginStart, loginSuccess } from '../../redux/usersSlice';
import { axiosInstance } from '../../utils/axios';

const Login = () => {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        dispatch(loginStart())
        try {
            const response = await axiosInstance.post("/auth/signin", {
                name,
                password
            });
            dispatch(loginSuccess(response.data));
            navigate('/');
        } catch (err) {
            setMessage(err.response.data.message);
            dispatch(loginFailure())
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
                <h2>Login to Your Account</h2>
                <input type="text" required onChange={(e) => setName(e.target.value)} placeholder="username" />
                <input type="password" requiredplaceholder="password" onChange={handlePasswordChange} />
                <button onClick={handleLogin}>Sign in</button>
                {
                    message &&
                    <p>{message}</p>
                }
                <p>{"Don't have an account?"}</p>
                <Link to="/signup" style={{
                    textDecoration: "underline",
                    fontWeight: "bold"
                }}>Sign up</Link>
            </form>
        </div>
    )
}

export default Login
