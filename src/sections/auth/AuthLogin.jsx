import PropTypes from 'prop-types';
import { useState,useEffect   } from 'react';


import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import Image from 'react-bootstrap/Image';
import InputGroup from 'react-bootstrap/InputGroup';
import Stack from 'react-bootstrap/Stack';


import { useForm } from 'react-hook-form';
import { useNavigate} from "react-router-dom";
import {Link} from "react-router-dom";

import MainCard from 'components/MainCard';
import { emailSchema } from 'utils/validationSchema';


import DarkLogo from 'assets/images/logo-dark.svg';
import authService from "../../services/authService";
import Alert from "react-bootstrap/Alert";
import {STORAGE_KEYS} from "../../utils/const";

const getOrCreateKey = async () => {
  // Check if we have a stored key
  const storedKey = localStorage.getItem('_ck');

  if (storedKey) {
    // Import existing key
    const keyData = JSON.parse(atob(storedKey));
    return await window.crypto.subtle.importKey(
        'jwk',
        keyData,
        { name: 'AES-GCM' },
        true,
        ['encrypt', 'decrypt']
    );
  }

  const key = await window.crypto.subtle.generateKey(
      { name: 'AES-GCM', length: 256 },
      true,
      ['encrypt', 'decrypt']
  );

  const exportedKey = await window.crypto.subtle.exportKey('jwk', key);
  localStorage.setItem('_ck', btoa(JSON.stringify(exportedKey)));

  return key;
};

const encryptPassword = async (password) => {
  const key = await getOrCreateKey();
  const encoder = new TextEncoder();
  const iv = window.crypto.getRandomValues(new Uint8Array(12));

  const encrypted = await window.crypto.subtle.encrypt(
      { name: 'AES-GCM', iv },
      key,
      encoder.encode(password)
  );

  // Combine iv + encrypted into one base64 string
  const combined = new Uint8Array(iv.length + encrypted.byteLength);
  combined.set(iv);
  combined.set(new Uint8Array(encrypted), iv.length);

  return btoa(String.fromCharCode(...combined));
};

const decryptPassword = async (encryptedData) => {
  try {
    const key = await getOrCreateKey();
    const combined = new Uint8Array(
        atob(encryptedData).split('').map(c => c.charCodeAt(0))
    );

    const iv = combined.slice(0, 12);
    const encrypted = combined.slice(12);

    const decrypted = await window.crypto.subtle.decrypt(
        { name: 'AES-GCM', iv },
        key,
        encrypted
    );

    return new TextDecoder().decode(decrypted);
  } catch {
    localStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
    return null;
  }
};
// ==============================|| AUTH LOGIN FORM ||============================== //

export default function AuthLoginForm({ className, link }) {
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isPreFilled, setIsPreFilled] = useState(false);
  const navigate = useNavigate();



  const {
    register,
    handleSubmit,
      setValue,
    formState: { errors }
  } = useForm();

  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const togglePasswordVisibility = () => {
    setShowPassword((prevState) => !prevState);
  };

  useEffect(() => {
    const loadSavedCredentials = async () => {
      const savedEmail = localStorage.getItem(STORAGE_KEYS.REMEMBERED_EMAIL);
      const savedPassword = localStorage.getItem(STORAGE_KEYS.REMEMBERED_PASSWORD);

      if (savedEmail && savedPassword) {
        try {
          const decryptedPassword = await decryptPassword(savedPassword);

          if (decryptedPassword) {
            setValue('email', savedEmail);
            setValue('password', decryptedPassword);
            setRememberMe(true);
            setIsPreFilled(true);
          }
        } catch {
          localStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
          localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
        }
      }
    };

    loadSavedCredentials();
  }, [setValue]);

  const handleRememberMeChange = (e) => {
    const checked = e.target.checked;
    setRememberMe(checked);

    if (!checked && isPreFilled) {
      // Clear password from form and storage when unchecking
      setValue('password', '');
      setIsPreFilled(false);
      setShowPassword(false);
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
    }
  };

  const onSubmit = async (data) => {
    const { email, password } = data;
    setErrorMessage("");

    if (rememberMe) {
      // Encrypt and save password
      const encryptedPassword = await encryptPassword(password);
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_PASSWORD, encryptedPassword);
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
    } else {
      localStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
      localStorage.setItem(STORAGE_KEYS.REMEMBERED_EMAIL, email);
      localStorage.removeItem('_ck');
    }

    authService.login(email, password, rememberMe)
        .then(() => {
          navigate('/dashboard');
        })
        .catch((error) => {
          console.error("Login failed:", error);
          setErrorMessage("Invalid email or password");
          localStorage.removeItem(STORAGE_KEYS.REMEMBERED_PASSWORD);
          localStorage.removeItem(STORAGE_KEYS.REMEMBERED_EMAIL);
          localStorage.removeItem('_ck');
        });
  };

  return (
    <MainCard className="mb-0">
      <div className="text-center">
        <a>
          <Image src={DarkLogo} alt="img" />
        </a>
      </div>
      <Form onSubmit={handleSubmit(onSubmit)} autoComplete="on">
        <h4 className={`text-center f-w-500 mt-4 mb-3 ${className}`}>Login</h4>
        {errorMessage && (
            <Alert variant="danger" className="mb-3" dismissible onClose={() => setErrorMessage("")}>
              {errorMessage}
            </Alert>
        )}
        <Form.Group className="mb-3" controlId="formEmail">
          <Form.Control
            type="email"
            placeholder="Email Address"
            autoComplete="email"
            name="email"
            {...register('email', emailSchema)}
            isInvalid={!!errors.email}
            className={className && 'bg-transparent border-white text-white border-opacity-25 '}
          />
          <Form.Control.Feedback type="invalid">{errors.email?.message}</Form.Control.Feedback>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formPassword">
          <InputGroup>
            <Form.Control
                type={!isPreFilled && showPassword ? 'text' : 'password'}
                placeholder="Password"
                autoComplete="current-password"
                name="password"
                {...register('password')}
                isInvalid={!!errors.password}
                className={className && 'bg-transparent border-white text-white border-opacity-25'}
            />
            {!isPreFilled && (
                <Button onClick={togglePasswordVisibility}>
                  {showPassword
                      ? <i className="ti ti-eye" />
                      : <i className="ti ti-eye-off" />
                  }
                </Button>
            )}
          </InputGroup>
          <Form.Control.Feedback type="invalid">{errors.password?.message}</Form.Control.Feedback>
        </Form.Group>

        <Stack direction="horizontal" className="mt-1 justify-content-between align-items-center">
          <Form.Group controlId="customCheckc1">
            <Form.Check
                type="checkbox"
                label="Remember me?"
                checked={rememberMe}
                onChange={handleRememberMeChange}
                className={`input-primary ${className ? className : 'text-muted'}`}
            />
          </Form.Group>
          <Link to="/forgotPassword" className={`text-secondary f-w-400 mb-0  ${className}`}>
            Forgot Password?
          </Link>
        </Stack>
        <div className="text-center mt-4">
          <Button type="submit" className="shadow px-sm-4">
            Login
          </Button>
        </div>
        <Stack direction="horizontal" className="justify-content-between align-items-end mt-4">
          <h6 className={`f-w-500 mb-0 ${className}`}>Don't have an Account?</h6>
          <Link to="/register" className="link-primary">
            Create Account
          </Link>
        </Stack>
      </Form>
    </MainCard>
  );
}

AuthLoginForm.propTypes = { className: PropTypes.string, link: PropTypes.string, resetLink: PropTypes.string };
