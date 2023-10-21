import { authService } from "fbase";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
const inputStyles = {};

const AuthForm = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [newAccount, setNewAccount] = useState(true);
    const [error, setError] = useState("");
    const toggleAccount = () => setNewAccount((prev) => !prev);
    const onSubmit = async (event) => {
        event.preventDefault();
        try {
            let data;
            if (newAccount) {
                //create account
                data = await createUserWithEmailAndPassword(
                    authService, email, password
                );
            } else {
                //login
                data = await signInWithEmailAndPassword(
                    authService, email, password
                );
            }
            console.log(data);
        } catch (error) {
            setError(error.message);
        }
    }

    const onChange = (event) => {
        const { target: { name, value } } = event;
        if (name === "email") {
            setEmail(value);
        } else if (name === "password") {
            setPassword(value);
        }
    }

    return (
        <>
            <form onSubmit={onSubmit} className="container">
                <input
                    name="email"
                    type="text"
                    placeholder="Email"
                    required
                    value={email}
                    onChange={onChange}
                    className="authInput"/>
                <input
                    name="password"
                    type="password"
                    placeholder="Password"
                    required
                    value={password}
                    onChange={onChange}
                    className="authInput"/>
                <input
                    type="submit"
                    value={newAccount ? "Create Account" : "Log In"}
                    className="authInput authSubmit" />
            </form>
            {error && <span className="authError">{error}</span>}
            <span onClick={toggleAccount} className="authSwitch">
                {newAccount ? "Sign Up" : "Create Account "}
            </span>
        </>
    );
}

export default AuthForm;