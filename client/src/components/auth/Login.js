import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";

const Login = () => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const {email, password} = formData;

    const onChange = e =>
        setFormData({...formData, [e.target.name]: e.target.value});
    //this function can be call any where to change the corresponding field

    const onSubmit = async e => {
        //connection verify
        console.log("login success");

        //form data transmission on component
        // try {
        //     const newUser = {
        //         name,
        //         email,
        //         password
        //     };
        //     const config = {
        //         headers: {
        //             "Content-Type": "application/json"
        //         }
        //     };
        //     const body = JSON.stringify(newUser);
        //     const res = await axios.post("/api/users", body, config);
        //     console.log(res.data);
        // } catch (error) {
        //     console.log(error.reaponse.data);
        // }
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Sign In</h1>
            <p className="lead">
                <i className="fas fa-user" /> Login to Your Account
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                </div>
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        value={password}
                        onChange={e => onChange(e)}
                        required
                        minLength="6"
                    />
                </div>

                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Login"
                />
            </form>
            <p className="my-1">
                Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
        </Fragment>
    );
};

export default Login;
