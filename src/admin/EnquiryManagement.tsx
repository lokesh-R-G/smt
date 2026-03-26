import { useEffect, useState } from 'react';
import { enquiries } from '../data/mockData';
import { AdminEnquiry, fetchAdminEnquiries, getErrorMessage, markAdminEnquiryRead } from '../services/api';

export const EnquiryManagement = () => {
  const [adminEnquiries, setAdminEnquiries] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(false);
  const [markingId, setMarkingId] = useState<string | null>(null);

  const loadEnquiries = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminEnquiries();
      setAdminEnquiries(data);
    } catch {
      setAdminEnquiries(
        enquiries.map((item) => ({
          id: item.id,
          name: item.name,
          email: item.email,
          company: item.company,
          subject: item.subject,
          message: item.message,
          isRead: false,
          date: item.date,
        })),
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadEnquiries();
  }, []);

  const markRead = async (enquiryId: string) => {
    setMarkingId(enquiryId);
    try {
      await markAdminEnquiryRead(enquiryId);
      alert('Enquiry marked as read.');
      await loadEnquiries();
    } catch (error) {
      alert(getErrorMessage(error, 'Failed to mark enquiry as read'));
    } finally {
      setMarkingId(null);
    }
  };

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold">Enquiry Management</h1>
      {loading && <p className="text-sm text-accent-grey">Loading enquiries...</p>}
      <div className="grid grid-cols-1 gap-6">
        {adminEnquiries.map((enquiry) => (
          <div key={enquiry.id} className="bg-white p-8 premium-shadow">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-xl font-bold mb-1">{enquiry.subject}</h3>
                <p className="text-sm text-accent-grey">From: <span className="font-bold text-gray-900">{enquiry.name}</span> ({enquiry.company})</p>
              </div>
              <span className="text-xs text-accent-grey">{enquiry.date}</span>
            </div>
            <p className="text-gray-600 leading-relaxed mb-6 bg-background-light p-4 rounded-sm italic">"{enquiry.message}"</p>
            <div className="flex justify-end gap-4">
              <button disabled={markingId === enquiry.id} onClick={() => markRead(enquiry.id)} className="text-sm font-bold text-accent-grey hover:text-primary transition-colors disabled:opacity-50">
                {enquiry.isRead ? 'Read' : markingId === enquiry.id ? 'Marking...' : 'Mark as Read'}
              </button>
              <button className="bg-primary text-white px-6 py-2 rounded-sm text-sm font-bold">Reply via Email</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
