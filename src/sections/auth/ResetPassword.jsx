import PropTypes from 'prop-types';
import { useState } from 'react';


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import Alert from 'react-bootstrap/Alert';


import { useForm } from 'react-hook-form';
import MainCard from 'components/MainCard';

import DarkLogo from 'assets/images/logo-dark.svg';
import AuthLoginForm from "./AuthLogin";
import axios from "axios";
import {useSearchParams,useNavigate} from "react-router-dom";

export default function ResetPasswordForm({className,Link}){

    const {
        register,
        handleSubmit,
        watch,
        formState: { errors, isSubmitting }
    } = useForm();

    const password = watch("newPassword");


    const [searchParams]= useSearchParams();
    const navigate = useNavigate();
    const token = searchParams.get("token");

    const [errorMessage, setErrorMessage] = useState("");
    const [successMessage, setSuccessMessage] = useState("");


    const onSubmit = async(data) => {

        setErrorMessage("");
        setSuccessMessage("");

        try {
            await axios.post("http://localhost:8080/api/v1/auth/reset-password", {
                token : token,
                newPassword : data.newPassword,
                confirmPassword: data.confirmPassword
            });
            setSuccessMessage("Password reset successful! Redirecting to login...");

            setTimeout(() => {
                navigate('/login');
            }, 2000);
        }catch (error){
            if (error.response) {
                const errorMsg = String(error.response.data.message || error.response.data || "");

                if (errorMsg.includes("same as current password") ||
                    errorMsg.includes("cannot be the same")) {
                    setErrorMessage("New password must be different from your current password");
                } else if (errorMsg.includes("Passwords do not match")) {
                    setErrorMessage("The passwords you entered do not match");
                } else if (errorMsg.includes("expired") || errorMsg.includes("Token expired")) {
                    setErrorMessage("This reset link has expired. Please request a new password reset");
                } else if (errorMsg.includes("Invalid")) {
                    setErrorMessage("Invalid reset link. Please request a new password reset");
                } else {
                    setErrorMessage(errorMsg || "Failed to reset password. Please try again");
                }
            } else if (error.request) {
                setErrorMessage("Unable to connect to server. Please check your connection");
            } else {
                setErrorMessage("An unexpected error occurred. Please try again");
            }
        }

    };

    return(

        <MainCard className="mb-0">
            <div className="text-center">
                <a>
                    <Image src={DarkLogo} alt="img" />
                </a>
            </div>
            <Form onSubmit={handleSubmit(onSubmit)}>
                <h5 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Reset Password</h5>

                {successMessage && (
                    <Alert variant="success" className="mb-3">
                        {successMessage}
                    </Alert>
                )}


                {errorMessage && (
                    <Alert variant="danger" className="mb-3" dismissible onClose={() => setErrorMessage("")}>
                        {errorMessage}
                    </Alert>
                )}

                <Form.Group className="mb-3" controlId="newPassword">
                    <Form.Control
                        type="password"
                        placeholder="New password"
                        {...register("newPassword", {
                            required: "Password is required",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }})}
                        isInvalid={!!errors.newPassword}
                        className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                    />
                    <Form.Control.Feedback type="invalid">{errors.newPassword?.message}</Form.Control.Feedback>
                </Form.Group>

                <Form.Group className="mb-3" controlId="confirmPassword">
                    <Form.Control
                        type="password"
                        placeholder="Confirm password"
                        {...register("confirmPassword", {
                            required: "Please confirm password",
                            validate: (value) =>
                                value === password || "Passwords do not match",
                            minLength: {
                                value: 8,
                                message: "Password must be at least 8 characters"
                            }
                        })}
                        isInvalid={!!errors.confirmPassword}
                        className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                    />
                    <Form.Control.Feedback type="invalid">{errors.confirmPassword?.message}</Form.Control.Feedback>
                </Form.Group>

                <div className="text-center mt-4">
                    <Button type="submit" disabled={isSubmitting} className="shadow px-sm-4">
                        {isSubmitting ? "Resetting password..." : "Submit"}
                    </Button>
                </div>
            </Form>
        </MainCard>
    );
}

AuthLoginForm.propTypes = { className: PropTypes.string, link: PropTypes.string, resetLink: PropTypes.string };
