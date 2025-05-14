import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { createProfile } from '../services/api';
import { supabase } from '../utils/supabaseClient';

// Development mode option
const DEV_MODE = true; // Set to false in production

// Email validation regex
const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

// Real email domains to suggest (to avoid Supabase rejection)
const RECOMMENDED_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'outlook.com', 
  'icloud.com', 'protonmail.com'
];

// Domains that are likely to be rejected by Supabase
const BLOCKED_DOMAINS = [
  'test.com', 'example.com', 'temporary.com', 'temp.com', 
  'fake.com', 'mailinator.com', '10minutemail.com'
];

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  // In development mode, offer to create a random valid email
  const generateRandomEmail = () => {
    if (!DEV_MODE) return;
    
    const randomString = Math.random().toString(36).substring(2, 10);
    const domain = RECOMMENDED_EMAIL_DOMAINS[0];
    setEmail(`user${randomString}@${domain}`);
  };

  const validateEmail = (email: string) => {
    if (!EMAIL_REGEX.test(email)) {
      return false;
    }
    
    // Get the domain part of the email
    const domain = email.split('@')[1].toLowerCase();
    
    // Block known test/temporary domains
    if (BLOCKED_DOMAINS.includes(domain)) {
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password || !displayName) {
      toast.error('Please fill in all fields');
      return;
    }

    // Check for blocked domains first
    const emailDomain = email.split('@')[1]?.toLowerCase();
    if (emailDomain && BLOCKED_DOMAINS.includes(emailDomain)) {
      toast.error(`Please use a real email address. Test domains like ${emailDomain} are not accepted.
        Try using: yourname@${RECOMMENDED_EMAIL_DOMAINS[0]}`);
      return;
    }

    // Validate email format
    if (!validateEmail(email)) {
      toast.error(`Please enter a valid email address like yourname@${RECOMMENDED_EMAIL_DOMAINS[0]}`);
      return;
    }

    // Validate password length
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters long');
      return;
    }
    
    setLoading(true);
    console.log('Starting registration process with email:', email);
    
    try {
      // Sign up the user
      const { data, error } = await signUp(email, password);
      
      if (error) {
        console.error('Registration error details:', error);
        toast.error(`Error: ${error.message}`);
        return;
      }
      
      if (!data?.user) {
        console.error('No user data returned:', data);
        toast.error('Registration completed but no user data returned');
        return;
      }
      
      console.log('User registered successfully:', data.user.id);
      
      // Check if profile already exists first
      const userId = data.user.id;
      const { data: existingProfile, error: profileCheckError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (profileCheckError && profileCheckError.code !== 'PGRST116') {
        console.error('Error checking for existing profile:', profileCheckError);
      }
      
      if (existingProfile) {
        console.log('Profile already exists:', existingProfile);
        toast.success('Account created successfully');
        navigate('/');
        return;
      }
      
      // Create a new profile
      console.log('Creating new profile for user:', userId);
      const { error: profileError } = await createProfile({
        id: userId,
        display_name: displayName,
        avatar_url: null,
      });
      
      if (profileError) {
        console.error('Profile creation error details:', profileError);
        toast.error(`Profile creation failed: ${profileError.message}`);
      } else {
        toast.success('Account created successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Registration process error:', error);
      if (error instanceof Error) {
        toast.error(`Registration error: ${error.message}`);
      } else {
        toast.error('An unknown error occurred during registration');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h1 className="text-center text-3xl font-extrabold text-gray-900">
            BorrowLog
          </h1>
          <h2 className="mt-2 text-center text-lg text-gray-600">
            Create your account
          </h2>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="displayName" className="block text-sm font-medium text-gray-700">
                Display Name
              </label>
              <input
                id="displayName"
                name="displayName"
                type="text"
                required
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email address
              </label>
              <div className="flex">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
                {DEV_MODE && (
                  <button
                    type="button"
                    onClick={generateRandomEmail}
                    className="mt-1 ml-2 px-3 py-2 bg-gray-100 text-gray-700 rounded text-xs"
                  >
                    Generate
                  </button>
                )}
              </div>
              {DEV_MODE && (
                <p className="text-xs text-gray-500 mt-1">
                  Use a real email or click "Generate" for a valid format
                </p>
              )}
            </div>
            
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="new-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
              />
              <p className="text-xs text-gray-500 mt-1">
                Must be at least 6 characters
              </p>
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading}
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
            >
              {loading ? 'Creating account...' : 'Create account'}
            </button>
          </div>

          <div className="text-center">
            <div className="text-sm">
              <span className="text-gray-500">Already have an account?</span>{' '}
              <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                Sign in
              </Link>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Register; 