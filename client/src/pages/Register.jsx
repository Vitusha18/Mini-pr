import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Sprout, Eye, EyeOff, Lock, Mail, User, ArrowRight, ArrowLeft, AlertCircle } from 'lucide-react';
import Button from '../components/common/Button';
import { useAuth } from '../context/AuthContext';

export const Register = () => {
  const navigate = useNavigate();
  const { register } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (!formData.agreeTerms) {
      setError('Please accept the terms and conditions to proceed');
      return;
    }

    setLoading(true);

    try {
      await register(formData.fullName.trim(), formData.email.trim(), formData.password);
      navigate('/dashboard');
    } catch (err) {
      console.error('Registration error:', err);
      setError(
        err.response?.data?.message || err.message || 'Registration failed. Please check your details.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      
      <div className="absolute top-6 left-6">
        <Link 
          to="/" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-brand-dark">
          Create Farmer Account
        </h2>
        <p className="mt-1.5 text-center text-xs text-brand-secondary">
          Join PestGuard AI to safeguard your crops with predictive warnings
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-2xl border border-brand-border">
          
          {error && (
            <div className="mb-5 p-3 rounded-lg bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 flex-shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Full Name */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <User className="w-4 h-4" />
                </div>
                <input
                  type="text"
                  name="fullName"
                  required
                  placeholder="Ramesh Kumar"
                  value={formData.fullName}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-brand-dark"
                />
              </div>
            </div>

            {/* Email field */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  name="email"
                  required
                  placeholder="farmer@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-brand-dark"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  required
                  minLength={6}
                  placeholder="Minimum 6 characters"
                  value={formData.password}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-10 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-brand-dark"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Lock className="w-4 h-4" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  required
                  placeholder="Repeat password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-brand-dark"
                />
              </div>
            </div>

            {/* Terms checkbox */}
            <div className="flex items-start">
              <input
                id="agreeTerms"
                name="agreeTerms"
                type="checkbox"
                required
                checked={formData.agreeTerms}
                onChange={handleChange}
                className="w-4 h-4 text-brand-green border-brand-border rounded focus:ring-brand-green mt-0.5"
              />
              <label htmlFor="agreeTerms" className="ml-2 block text-xs text-slate-600 leading-normal">
                I agree to the <span className="text-brand-green font-medium">Terms of Service</span> and acknowledge environmental data monitoring.
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button 
                type="submit" 
                variant="primary" 
                size="md" 
                className="w-full justify-center"
                icon={ArrowRight}
                disabled={loading}
              >
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </div>
          </form>

          <div className="mt-6 pt-5 border-t border-slate-100 text-center">
            <p className="text-xs text-slate-600">
              Already have an account?{' '}
              <Link to="/login" className="font-semibold text-brand-green hover:underline">
                Sign In
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Register;
