import { useState, useEffect } from 'react';
import { getContacts, createContact, updateContact, deleteContact } from '../services/api';
import { Contact } from '../types';
import { useAuth } from '../context/AuthContext';

export const useContacts = () => {
  const { user } = useAuth();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchContacts = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await getContacts(user.id);
      
      if (error) {
        throw error;
      } else if (data) {
        setContacts(data);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
  }, [user]);

  const addContact = async (contactData: Partial<Contact>) => {
    setLoading(true);
    try {
      const { data, error } = await createContact({
        ...contactData,
        user_id: user?.id || ''
      });
      
      if (error) throw error;
      
      if (data) {
        setContacts(prev => [...prev, data]);
      }
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateContactItem = async (id: string, updates: Partial<Contact>) => {
    setLoading(true);
    try {
      const { data, error } = await updateContact(id, updates);
      if (error) throw error;
      
      if (data) {
        setContacts(prev => prev.map(contact => contact.id === id ? data : contact));
      }
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeContact = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await deleteContact(id);
      if (error) throw error;
      
      setContacts(prev => prev.filter(contact => contact.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const refresh = () => {
    fetchContacts();
  };

  return {
    contacts,
    loading,
    error,
    addContact,
    updateContact: updateContactItem,
    removeContact,
    refresh
  };
}; 