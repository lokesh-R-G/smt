import { type FormEvent, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { getErrorMessage } from '../services/api';

export const LoginPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const successMessage =
    typeof (location.state as { successMessage?: string } | null)?.successMessage === 'string'
      ? (location.state as { successMessage?: string }).successMessage
      : '';

  const validate = () => {
    const next: Record<string, string> = {};
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) next.email = 'Enter a valid email address';
    if (password.length < 8) next.password = 'Password must be at least 8 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await signIn(email, password);
      navigate('/admin');
    } catch (error) {
      setErrors((prev) => ({ ...prev, form: getErrorMessage(error, 'Invalid email or password') }));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 bg-background-light">
      <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="w-full max-w-md bg-white premium-shadow p-10">
        <div className="text-center mb-10">
          <Shield className="w-12 h-12 text-primary mx-auto mb-4" />
          <h1 className="text-3xl font-bold">Client Login</h1>
          <p className="text-accent-grey mt-2">Access your business dashboard</p>
        </div>

        <form className="space-y-6" onSubmit={handleSubmit}>
          {successMessage && <p className="text-xs text-green-600">{successMessage}</p>}
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
          {errors.form && <p className="text-xs text-red-500">{errors.form}</p>}
          <button disabled={isSubmitting} className="w-full bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50">
            {isSubmitting ? 'Signing In...' : 'Sign In'}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-accent-grey">
          Don't have an account? <Link to="/signup" className="text-primary font-bold hover:underline">Sign Up</Link>
        </div>
      </motion.div>
    </div>
  );
};
