import PropTypes from 'prop-types';
import { useState } from 'react';


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';


import { useForm } from 'react-hook-form';
import { useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

import MainCard from 'components/MainCard';
import { emailSchema, passwordSchema } from 'utils/validationSchema';


import DarkLogo from 'assets/images/logo-dark.svg';
import AuthLoginForm from "./AuthLogin";
import axios from "axios";

export default function ForgotPasswordForm({className,Link}){

 const {
     register,
     handleSubmit,
     formState: {errors,isSubmitting}
 } = useForm();

 const onSubmit = async(data) => {
    try {
        await axios.post("http://localhost:8080/api/v1/auth/forgot-password", {email : data.email});
        alert("If the email exists, a reset link was sent.");
    }catch (error){
        console.error(error);
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
                <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Forgot Password</h4>
                <Form.Group className="mb-3" controlId="formEmail">
                    <Form.Control
                        type="email"
                        placeholder="Email Address"
                        {...register('email', emailSchema)}
                        isInvalid={!!errors.email}
                        className={className && 'bg-transparent border-white text-white border-opacity-25 '}
                    />
                    <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
                </Form.Group>
                <div className="text-center mt-4">
                    <Button type="submit" disabled={isSubmitting} className="shadow px-sm-4">
                        {isSubmitting ? "Sending..." : "Send Reset Link"}
                    </Button>
                </div>
            </Form>
        </MainCard>
    );
}

AuthLoginForm.propTypes = { className: PropTypes.string, link: PropTypes.string, resetLink: PropTypes.string };
