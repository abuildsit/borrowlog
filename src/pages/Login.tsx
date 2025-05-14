import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import FormField from '../components/ui/FormField';
import Button from '../components/ui/Button';
import toast from 'react-hot-toast';
import { useForm } from '../hooks/useForm';

interface LoginFormValues {
  email: string;
  password: string;
}

const Login: React.FC = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();

  const validate = (values: LoginFormValues) => {
    const errors: Record<string, string> = {};
    if (!values.email) errors.email = 'Email is required';
    if (!values.password) errors.password = 'Password is required';
    return errors;
  };

  const handleSubmit = async (values: LoginFormValues) => {
    try {
      const { error } = await signIn(values.email, values.password);
      
      if (error) {
        toast.error(error.message);
      } else {
        navigate('/');
      }
    } catch (error) {
      console.error('Unexpected error during login:', error);
      toast.error('An unexpected error occurred');
    }
  };

  const { 
    values, 
    errors, 
    isSubmitting, 
    handleChange, 
    handleBlur,
    handleSubmit: onSubmit 
  } = useForm<LoginFormValues>({
    initialValues: { email: '', password: '' },
    validate,
    onSubmit: handleSubmit
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8 bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Sign in to your account</h1>
          <p className="mt-2 text-sm text-gray-600">
            Or{' '}
            <Link to="/register" className="text-blue-600 hover:text-blue-500">
              create a new account
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={onSubmit}>
          <FormField
            label="Email Address"
            name="email"
            type="email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            autoComplete="email"
            required
          />
          
          <FormField
            label="Password"
            name="password"
            type="password"
            value={values.password}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.password}
            autoComplete="current-password"
            required
          />
          
          <div>
            <Button
              type="submit"
              variant="primary"
              fullWidth
              isLoading={isSubmitting}
            >
              Sign in
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login; 