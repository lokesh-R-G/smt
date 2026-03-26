import { type FormEvent, useState } from 'react';
import { getErrorMessage, submitEnquiry } from '../services/api';

export const EnquiryPage = () => {
  const [form, setForm] = useState({ name: '', email: '', company: '', subject: '', message: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [submitError, setSubmitError] = useState('');

  const validate = () => {
    const next: Record<string, string> = {};
    if (!form.name.trim()) next.name = 'Name is required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) next.email = 'Enter a valid email';
    if (!form.company.trim()) next.company = 'Company is required';
    if (!form.subject.trim()) next.subject = 'Subject is required';
    if (form.message.trim().length < 10) next.message = 'Message must be at least 10 characters';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setSuccessMessage('');
    setSubmitError('');
    if (!validate()) return;

    setSubmitting(true);
    try {
      await submitEnquiry(form);
      setSuccessMessage('Enquiry submitted successfully. Our team will contact you shortly.');
      setForm({ name: '', email: '', company: '', subject: '', message: '' });
      setErrors({});
    } catch (error) {
      setSubmitError(getErrorMessage(error, 'Failed to submit enquiry. Please try again.'));
    } finally {
      setSubmitting(false);
    }
  };

  const fieldClass = 'w-full px-4 py-3 bg-background-light border-0 focus:ring-2 focus:ring-primary outline-none transition-all';

  return (
    <div className="pt-32 pb-24 px-6 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold mb-6">Business Enquiry</h1>
          <p className="text-xl text-accent-grey">Get a custom quote for bulk requirements or specialized equipment.</p>
        </div>

        <div className="bg-white premium-shadow p-10">
          <form className="grid grid-cols-1 md:grid-cols-2 gap-8" onSubmit={onSubmit}>
            {successMessage && <p className="md:col-span-2 text-sm text-green-600">{successMessage}</p>}
            {submitError && <p className="md:col-span-2 text-sm text-red-500">{submitError}</p>}
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Full Name</label>
              <input type="text" value={form.name} onChange={(e) => setForm((prev) => ({ ...prev, name: e.target.value }))} className={fieldClass} placeholder="John Doe" />
              {errors.name && <p className="text-xs text-red-500">{errors.name}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Email Address</label>
              <input type="email" value={form.email} onChange={(e) => setForm((prev) => ({ ...prev, email: e.target.value }))} className={fieldClass} placeholder="john@company.com" />
              {errors.email && <p className="text-xs text-red-500">{errors.email}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Company Name</label>
              <input type="text" value={form.company} onChange={(e) => setForm((prev) => ({ ...prev, company: e.target.value }))} className={fieldClass} placeholder="Industrial Solutions Ltd." />
              {errors.company && <p className="text-xs text-red-500">{errors.company}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Subject</label>
              <input type="text" value={form.subject} onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))} className={fieldClass} placeholder="Bulk Order Inquiry" />
              {errors.subject && <p className="text-xs text-red-500">{errors.subject}</p>}
            </div>
            <div className="md:col-span-2 space-y-2">
              <label className="text-sm font-bold uppercase tracking-wider text-accent-grey">Message</label>
              <textarea rows={6} value={form.message} onChange={(e) => setForm((prev) => ({ ...prev, message: e.target.value }))} className={`${fieldClass} resize-none`} placeholder="Tell us about your requirements..." />
              {errors.message && <p className="text-xs text-red-500">{errors.message}</p>}
            </div>
            <div className="md:col-span-2">
              <button disabled={submitting} className="w-full bg-primary text-white py-4 rounded-sm font-bold hover:bg-primary-dark transition-all disabled:opacity-50">
                {submitting ? 'Submitting...' : 'Submit Enquiry'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
