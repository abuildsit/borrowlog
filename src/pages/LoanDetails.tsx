import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getLoanById, updateLoan, getContacts } from '../services/api';
import { Loan, Contact } from '../types';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Button from '../components/ui/Button';

const LoanDetails = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [loan, setLoan] = useState<Loan | null>(null);
  const [contact, setContact] = useState<Contact | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [returnDate, setReturnDate] = useState<string>(
    new Date().toISOString().split('T')[0] // Today's date in YYYY-MM-DD format
  );

  useEffect(() => {
    const fetchLoanDetails = async () => {
      if (!id || !user) return;
      
      try {
        const { data, error } = await getLoanById(id);
        
        if (error) {
          console.error('Error fetching loan:', error);
          toast.error('Failed to load loan details');
          navigate('/');
          return;
        }
        
        if (!data) {
          toast.error('Loan not found');
          navigate('/');
          return;
        }
        
        setLoan(data);
        
        // Fetch contact info if available
        if (data.borrower_contact_id) {
          const { data: contacts } = await getContacts(user.id);
          const foundContact = contacts?.find(c => c.id === data.borrower_contact_id) || null;
          setContact(foundContact);
        }
      } catch (error) {
        console.error('Error fetching loan details:', error);
        toast.error('An error occurred while loading loan details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchLoanDetails();
  }, [id, user, navigate]);

  const handleMarkAsReturned = async () => {
    if (!loan || !id || !user) return;
    
    setUpdating(true);
    
    try {
      // Update the loan status directly to completed with the return date
      const updates: Partial<Loan> = {
        status: 'completed',
        return_date: returnDate,
      };
      
      const { data, error } = await updateLoan(id, updates);
      
      if (error) {
        toast.error('Failed to mark item as returned');
        console.error('Error updating loan:', error);
      } else if (data) {
        setLoan(data);
        toast.success('Item marked as returned');
      }
    } catch (error) {
      console.error('Error updating loan:', error);
      toast.error('An error occurred while updating the loan');
    } finally {
      setUpdating(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center py-20">Loading...</div>;
  }

  if (!loan) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-500">Loan not found</p>
        <button
          onClick={() => navigate('/')}
          className="mt-4 text-blue-600 hover:text-blue-500"
        >
          Go back to Home
        </button>
      </div>
    );
  }

  const isOwner = user?.id === loan.owner_id;
  const canUpdate = isOwner || user?.id === loan.borrower_id;

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => navigate('/')}
          className="text-blue-600 hover:text-blue-500 flex items-center"
        >
          <span className="material-icons mr-1 text-sm">arrow_back</span>
          Back to Home
        </button>
      </div>
      
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {loan.photo_url && (
          <div className="h-64 bg-gray-200">
            <img
              src={loan.photo_url}
              alt={loan.item_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        
        <div className="p-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold">{loan.item_name}</h1>
              <div className="flex items-center mt-1">
                <span className="text-sm text-gray-500">
                  {loan.is_lending ? 'Lending' : 'Borrowing'}
                </span>
                <span className="mx-2 text-gray-300">•</span>
                <span
                  className={`px-2 py-1 text-xs rounded-full ${
                    loan.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : loan.status === 'pending_return'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-gray-100 text-gray-800'
                  }`}
                >
                  {loan.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>
          
          {loan.description && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Description</h3>
              <p className="mt-1 text-gray-600">{loan.description}</p>
            </div>
          )}
          
          <div className="mt-4 grid grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-700">
                {loan.is_lending ? 'Lending To' : 'Borrowing From'}
              </h3>
              <p className="mt-1 text-gray-600">{contact?.name || 'Unknown'}</p>
            </div>
            
            {loan.due_date && (
              <div>
                <h3 className="text-sm font-medium text-gray-700">Due Date</h3>
                <p className="mt-1 text-gray-600">
                  {format(new Date(loan.due_date), 'MMM d, yyyy')}
                </p>
              </div>
            )}
          </div>
          
          {loan.status === 'completed' && loan.return_date && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-700">Returned On</h3>
              <p className="mt-1 text-gray-600">
                {format(new Date(loan.return_date), 'MMM d, yyyy')}
              </p>
            </div>
          )}
          
          {canUpdate && loan.status !== 'completed' && (
            <div className="mt-6 pt-6 border-t">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Return Item</h3>
              
              <div className="mb-4">
                <label htmlFor="returnDate" className="block text-sm font-medium text-gray-700 mb-1">
                  Return Date
                </label>
                <input
                  type="date"
                  id="returnDate"
                  value={returnDate}
                  onChange={(e) => setReturnDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                />
              </div>
              
              <Button
                onClick={handleMarkAsReturned}
                disabled={updating}
                variant="primary"
                isLoading={updating}
                fullWidth
              >
                Mark as Returned
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoanDetails; 