import React, {Fragment, useState} from "react";
import {Link} from "react-router-dom";
import {connect} from "react-redux";
import {setAlert} from "../../actions/alert";
import {register} from "../../actions/auth";
import PropTypes from "prop-types";

//import axios from "axios";

const Register = ({setAlert, register}) => {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        password2: ""
    });

    const {name, email, password, password2} = formData;

    const onChange = e =>
        setFormData({...formData, [e.target.name]: e.target.value});
    //this function can be call any where to change the corresponding field

    const onSubmit = async e => {
        e.preventDefault();
        //excecute client side validation in this function
        if (password !== password2) {
            //console.log("Password does not match");
            setAlert("Passwords do not match", "danger");
        } else {
            //connection verify
            //console.log(formData);
            register({name, email, password});

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
        }
    };

    return (
        <Fragment>
            <h1 className="large text-primary">Sign Up</h1>
            <p className="lead">
                <i className="fas fa-user" /> Create Your Account
            </p>
            <form className="form" onSubmit={e => onSubmit(e)}>
                <div className="form-group">
                    <input
                        type="text"
                        placeholder="Name"
                        name="name"
                        value={name}
                        onChange={e => onChange(e)}
                        required //this is the html5 client side checking
                    />
                </div>
                <div className="form-group">
                    <input
                        type="email"
                        placeholder="Email Address"
                        name="email"
                        value={email}
                        onChange={e => onChange(e)}
                        required
                    />
                    <small className="form-text">
                        This site uses Gravatar so if you want a profile image,
                        use a Gravatar email
                    </small>
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
                <div className="form-group">
                    <input
                        type="password"
                        placeholder="Confirm Password"
                        name="password2"
                        value={password2}
                        onChange={e => onChange(e)}
                        required
                        minLength="6"
                    />
                </div>
                <input
                    type="submit"
                    className="btn btn-primary"
                    value="Register"
                />
            </form>
            <p className="my-1">
                Already have an account? <Link to="/login">Sign In</Link>
            </p>
        </Fragment>
    );
};

Register.propTypes = {
    setAlert: PropTypes.func.isRequired,
    register: PropTypes.func.isRequired
};

export default connect(
    null,
    {setAlert, register}
)(Register);
