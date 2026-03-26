import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { UserPlus } from 'lucide-react';
import { getErrorMessage, register } from '../services/api';

export const SignupPage = () => {
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const next: Record<string, string> = {};

    if (name.trim().length < 2) next.name = 'Name must be at least 2 characters';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (password.length < 8) next.password = 'Password must be at least 8 characters';
    if (confirmPassword !== password) next.confirmPassword = 'Passwords do not match';

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({ name: name.trim(), email: email.trim(), password });
      navigate('/login', {
        state: { successMessage: 'Account created successfully. Please sign in.' },
      });
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: getErrorMessage(error, 'Unable to create account. Please try again.') }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background-light">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white premium-shadow p-10">
        <div className="text-center mb-10">
          <UserPlus className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Create Account</h1>
          <p className="text-accent-grey mt-2">Register to start placing business orders</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Name</label>
            <input type="text" value={name} onChange={(e) => setName(e.target.value)} className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" />
            {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" />
            {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Password</label>
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" />
            {errors.password && <p className="text-xs text-red-500">{errors.password}</p>}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-widest text-accent-grey">Confirm Password</label>
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all" />
            {errors.confirmPassword && <p className="text-xs text-red-500">{errors.confirmPassword}</p>}
          </div>

          {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}

          <button disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50">
            {isSubmitting ? 'Creating Account...' : 'Sign Up'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-accent-grey">
          Already have an account? <Link to="/login" className="text-primary font-bold hover:underline">Sign In</Link>
        </div>
      </motion.div>
    </div>
  );
};
