import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getContacts, createContact, deleteContact } from '../services/api';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const Contacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [isAddMode, setIsAddMode] = useState(false);

  useEffect(() => {
    const fetchContacts = async () => {
      if (!user) return;
      
      try {
        const { data, error } = await getContacts(user.id);
        
        if (error) {
          console.error('Error fetching contacts:', error);
          toast.error('Failed to load contacts');
        } else if (data) {
          setContacts(data);
        }
      } catch (error) {
        console.error('Error fetching contacts:', error);
        toast.error('Failed to load contacts');
      } finally {
        setLoading(false);
      }
    };
    
    fetchContacts();
  }, [user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user || !name) {
      toast.error('Please enter a name for the contact');
      return;
    }
    
    setSubmitting(true);
    
    try {
      const { data, error } = await createContact({
        user_id: user.id,
        name,
        email: email || null,
        phone: phone || null,
      });
      
      if (error) {
        toast.error('Failed to create contact');
        console.error('Error creating contact:', error);
      } else if (data) {
        setContacts([...contacts, data]);
        toast.success('Contact added successfully');
        
        // Reset form
        setName('');
        setEmail('');
        setPhone('');
        setIsAddMode(false);
      }
    } catch (error) {
      console.error('Error creating contact:', error);
      toast.error('An error occurred while creating the contact');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (contactId: string) => {
    if (!window.confirm('Are you sure you want to delete this contact?')) {
      return;
    }
    
    try {
      const { error } = await deleteContact(contactId);
      
      if (error) {
        toast.error('Failed to delete contact');
        console.error('Error deleting contact:', error);
      } else {
        setContacts(contacts.filter((contact) => contact.id !== contactId));
        toast.success('Contact deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting contact:', error);
      toast.error('An error occurred while deleting the contact');
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Contacts</h1>
        <button
          onClick={() => setIsAddMode(!isAddMode)}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
        >
          {isAddMode ? 'Cancel' : 'Add Contact'}
        </button>
      </div>

      {isAddMode && (
        <div className="mb-8 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-lg font-medium mb-4">Add New Contact</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Name *
              </label>
              <input
                id="name"
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
              />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
              />
            </div>
            
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                Phone
              </label>
              <input
                id="phone"
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
              />
            </div>

            <div className="pt-2">
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
              >
                {submitting ? 'Adding...' : 'Add Contact'}
              </button>
            </div>
          </form>
        </div>
      )}

      {contacts.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No contacts found</p>
          <p className="text-gray-500 mt-1 text-sm">
            Add a new contact to get started
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <ul className="divide-y divide-gray-200">
            {contacts.map((contact) => (
              <li key={contact.id} className="p-4 hover:bg-gray-50">
                <div className="flex justify-between">
                  <div>
                    <h3 className="font-medium">{contact.name}</h3>
                    {contact.email && (
                      <p className="text-sm text-gray-500">{contact.email}</p>
                    )}
                    {contact.phone && (
                      <p className="text-sm text-gray-500">{contact.phone}</p>
                    )}
                  </div>
                  <button
                    onClick={() => handleDelete(contact.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <span className="material-icons text-sm">delete</span>
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Contacts; 