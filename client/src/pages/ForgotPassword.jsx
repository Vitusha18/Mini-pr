import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Sprout, Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../components/common/Button';

export const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setStatus('Password reset service will be connected in Phase 4. Instructions would be sent to: ' + email);
  };

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="absolute top-6 left-6">
        <Link 
          to="/login" 
          className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-600 hover:text-brand-green transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Login
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <div className="w-12 h-12 rounded-xl bg-brand-green flex items-center justify-center text-white shadow-sm">
            <Sprout className="w-7 h-7 stroke-[2.2]" />
          </div>
        </div>
        <h2 className="mt-4 text-center text-2xl font-bold tracking-tight text-brand-dark">
          Reset Password
        </h2>
        <p className="mt-1.5 text-center text-xs text-brand-secondary">
          Enter your registered email to receive a password recovery link
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4">
        <div className="bg-white py-8 px-6 sm:px-8 shadow-card rounded-2xl border border-brand-border">
          {status && (
            <div className="mb-5 p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
              {status}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-brand-dark mb-1">
                Registered Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                  <Mail className="w-4 h-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="farmer@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full pl-9 pr-3 py-2 text-sm border border-brand-border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-brand-green focus:border-brand-green text-brand-dark"
                />
              </div>
            </div>

            <div className="pt-2">
              <Button type="submit" variant="primary" size="md" className="w-full justify-center" icon={ArrowRight}>
                Send Reset Link
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
