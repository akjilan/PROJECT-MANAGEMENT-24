import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { PropTypes } from 'prop-types';
import { connect } from 'react-redux';

import Input from "../shared/FormElements/Input";
import { useForm } from "../../hooks/form-hook";
import { useHttpClient } from "../../hooks/http-hook";
import { login, register, loadUser } from "../../actions/auth-action";
import { setAlert } from "../../actions/alert-action";
import { initSwitchLayout } from "./initSwitchLayout";
import {
    VALIDATOR_EMAIL,
    VALIDATOR_MINLENGTH,
    VALIDATOR_REQUIRE
} from "../../utils/validators";
import './auth.css';
import Alert from "../layout/Alert";

const Auth = ({ login, register , isAuthenticated , setAlert, loadUser}) => {
    // const auth = useContext(AuthContext);
    const [ isLoginMode, setIsLoginMode ] = useState(true);
    const { isLoading, error, sendRequest , clearError } = useHttpClient();
    const history = useHistory();

    const [ formState, inputHandler, setFormData ] = useForm(
        {
            email: {
                value: '',
                isValid: false,
            },
            password: {
                value: '',
                isValid: false
            }
        },
        false
    );

    useEffect(() => {
        initSwitchLayout();
    }, [])

    useEffect(() => {
        if(error) {
            setAlert(error, 'danger');
            clearError();
        }
    }, [error]);

    const switchModeHandler = () => {
        if(!isLoginMode) {
            console.log('Switching from sign up to sign in mode')
            //Switching from sign up to sign in mode
            setFormData(
                {
                    ...formState.inputs,
                    name: undefined,
                    confirmPassword: undefined,
                    username: undefined
                },
                 formState.inputs.email.isValid && formState.inputs.password.isValid
            );
        } else {
            console.log('Switching from sign in to sign up mode')
            //Switching from sign in to sing up mode
            setFormData(
                 {
                    ...formState.inputs,
                    name: {
                        value: '',
                        isValid: false
                    },
                     username: {
                        value: '',
                        isValid: false,
                        // isAvailable: false
                    },
                    confirmPassword: {
                        value: '',
                        isValid: false
                    }
                },
                false
            );
        }
        setIsLoginMode(prevMode => !prevMode);
    };

    const authSubmitHandler = async event => {
        console.log(formState);
        console.log('in submit handler');
        event.preventDefault();
        if(isLoginMode) {
            console.log(formState);
            try {
                await login(formState.inputs.email.value, formState.inputs.password.value, sendRequest);
                await loadUser();
                await history.push('/');
            } catch (error) {
                console.log(error);
            }
        } else {
            try {
                console.log('in else of submithandler')
                if(formState.inputs.password.value !== formState.inputs.confirmPassword.value) {
                    setAlert('Passwords do not match', 'danger');
                } else {
                    try {
                        await register(formState.inputs.name.value, formState.inputs.username.value,
                            formState.inputs.email.value, formState.inputs.password.value, sendRequest);
                        await loadUser();
                        await history.push('/');
                    } catch (error) {
                        console.error(error);
                    }
                }
                console.log(formState);
            } catch (err) {}
        }
    };
    const emailInput = <Input
        element="input"
        elementTitle="email"
        type="email"
        placeholder="Email"
        validators={[VALIDATOR_EMAIL()]}
        errorText="Please enter a valid email address."
        onInput={inputHandler}
    />;

    const passwordInput = <Input
        element="input"
        placeholder="Password"
        elementTitle="password"
        type="password"
        validators={[VALIDATOR_MINLENGTH(5)]}
        errorText="Please enter at least 5 character."
        onInput={inputHandler}
    />;

    return (
        <div className="main signin__signup">
            <Alert />
            <div className="row">
                <br/><br/>
                <div className="col s12 m12 l12">
                    <div className="container" id="container">
                        {!isLoginMode && (
                        <div className="form-container sign-up-container">
                            <form onSubmit={authSubmitHandler}>
                                <h4>Create Account</h4>
                                <Input
                                    element="input"
                                    elementTitle="name"
                                    type="text"
                                    placeholder="Name"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter your full name."
                                    onInput={inputHandler}
                                />
                                <Input
                                    element="input"
                                    elementTitle="username"
                                    type="text"
                                    placeholder="User Name"
                                    validators={[VALIDATOR_REQUIRE()]}
                                    errorText="Please enter your full name."
                                    onInput={inputHandler}
                                />
                                {emailInput}
                                {passwordInput}
                                <Input
                                    element="input"
                                    placeholder="Confirm Password"
                                    elementTitle="confirmPassword"
                                    type="password"
                                    validators={[VALIDATOR_MINLENGTH(5)]}
                                    errorText="Please enter at least 5 character."
                                    onInput={inputHandler}
                                />
                                <button id="signup__button" disabled={!formState.isValid}>Sign Up</button>
                            </form>
                        </div>
                        )}
                        {isLoginMode && (
                        <div className="form-container sign-in-container">
                            <form onSubmit={authSubmitHandler}>
                                <h1>Sign in</h1>
                                {emailInput}
                                {passwordInput}
                                <a href="#">Forgot your password?</a>
                                <button disabled={!formState.isValid}>Sign In</button>
                            </form>
                        </div>
                        )}

                        <div className="overlay-container">
                            <div className="overlay">
                                <div className="overlay-panel overlay-left">
                                    <h1>Welcome Back!</h1>
                                    <p>To keep connected with us please login with your personal info</p>
                                    <button onClick={switchModeHandler} className="ghost" id="signIn">Sign In</button>
                                </div>
                                <div className="overlay-panel overlay-right">
                                    <h1>Hello, Friend!</h1>
                                    <p>Enter your personal details and start journey with us</p>
                                    <button onClick={switchModeHandler} className="ghost" id="signUp">Sign Up</button>
                                </div>
                            </div>
                        </div>
                    </div>


                    <footer>
                        <p>
                            Created with <i className="fa fa-heart"></i> by
                            <a target="_blank" href="https://florin-pop.com">Florin Pop</a>
                            - Read how I created this and how you can join the challenge
                            <a target="_blank"
                               href="https://www.florin-pop.com/blog/2019/03/double-slider-sign-in-up-form/">here</a>.
                        </p>
                    </footer>
                </div>
            </div>
        </div>
    )
};

Auth.propTypes = {
    login: PropTypes.func.isRequired,
    isAuthenticated: PropTypes.bool.isRequired
}

const mapStateToProps = state => ({
    isAuthenticated: state.auth.isAuthenticated,
})


export default connect(mapStateToProps, { login, register, setAlert, loadUser })(Auth);