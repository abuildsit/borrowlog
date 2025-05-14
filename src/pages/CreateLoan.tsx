import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createLoan, getContacts, uploadImage } from '../services/api';
import { Contact } from '../types';
import toast from 'react-hot-toast';

const CreateLoan = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loadingContacts, setLoadingContacts] = useState(true);
  
  // Form state
  const [isLending, setIsLending] = useState<boolean>(true);
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [contactId, setContactId] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [photo, setPhoto] = useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);

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
        setLoadingContacts(false);
      }
    };
    
    fetchContacts();
  }, [user]);

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setPhoto(file);
    
    // Create a preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotoPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!user) return;
    
    if (!itemName || !contactId || !photo) {
      toast.error('Please fill in all required fields and add a photo');
      return;
    }
    
    setLoading(true);
    
    try {
      // Upload photo first
      const { data: photoUrl, error: uploadError } = await uploadImage(
        photo,
        'loan-photos',
        `loan-${Date.now()}`
      );
      
      if (uploadError) {
        toast.error('Failed to upload photo');
        return;
      }
      
      // Create the loan record
      const { error } = await createLoan({
        owner_id: user.id,
        borrower_contact_id: contactId,
        item_name: itemName,
        description: description || null,
        photo_url: photoUrl,
        due_date: dueDate || null,
        status: 'Active',
        is_lending: isLending,
      });
      
      if (error) {
        toast.error('Failed to create loan');
        console.error('Error creating loan:', error);
      } else {
        toast.success('Loan created successfully');
        navigate('/');
      }
    } catch (error) {
      console.error('Error creating loan:', error);
      toast.error('An error occurred while creating the loan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add New Loan</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-xl">
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={() => setIsLending(true)}
            className={`flex-1 py-2 rounded-md ${
              isLending
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Lending Out
          </button>
          <button
            type="button"
            onClick={() => setIsLending(false)}
            className={`flex-1 py-2 rounded-md ${
              !isLending
                ? 'bg-blue-600 text-white'
                : 'bg-gray-100 text-gray-800'
            }`}
          >
            Borrowing
          </button>
        </div>
        
        <div>
          <label htmlFor="itemName" className="block text-sm font-medium text-gray-700 mb-1">
            Item Name *
          </label>
          <input
            id="itemName"
            type="text"
            required
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
          />
        </div>
        
        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
          />
        </div>
        
        <div>
          <label htmlFor="contact" className="block text-sm font-medium text-gray-700 mb-1">
            {isLending ? 'Lending To *' : 'Borrowing From *'}
          </label>
          {loadingContacts ? (
            <p className="text-sm text-gray-500">Loading contacts...</p>
          ) : contacts.length === 0 ? (
            <div className="mb-2">
              <p className="text-sm text-gray-500">No contacts found.</p>
              <button
                type="button"
                onClick={() => navigate('/contacts')}
                className="text-sm text-blue-600 hover:text-blue-500"
              >
                Add a contact first
              </button>
            </div>
          ) : (
            <select
              id="contact"
              required
              value={contactId}
              onChange={(e) => setContactId(e.target.value)}
              className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
            >
              <option value="">Select a contact</option>
              {contacts.map((contact) => (
                <option key={contact.id} value={contact.id}>
                  {contact.name}
                </option>
              ))}
            </select>
          )}
        </div>
        
        <div>
          <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-1">
            Due Date
          </label>
          <input
            id="dueDate"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm py-2 px-3 border"
          />
        </div>
        
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700 mb-1">
            Photo *
          </label>
          <input
            id="photo"
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          {photoPreview && (
            <div className="mt-2">
              <img
                src={photoPreview}
                alt="Selected"
                className="h-40 w-40 object-cover rounded border"
              />
            </div>
          )}
        </div>
        
        <div className="pt-4">
          <button
            type="submit"
            disabled={loading || loadingContacts}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded disabled:opacity-50"
          >
            {loading ? 'Creating...' : 'Create Loan'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CreateLoan; 