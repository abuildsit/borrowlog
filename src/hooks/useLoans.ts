import { useState, useEffect } from 'react';
import { getLoans, getLoanById, createLoan, updateLoan, deleteLoan } from '../services/api';
import { Loan } from '../types';
import { useAuth } from '../context/AuthContext';

type LoanFilters = {
  status?: number | 'all';
  type?: 'lending' | 'borrowing' | 'all';
};

export const useLoans = (initialFilters: LoanFilters = { status: 'all', type: 'all' }) => {
  const { user } = useAuth();
  const [loans, setLoans] = useState<Loan[]>([]);
  const [filteredLoans, setFilteredLoans] = useState<Loan[]>([]);
  const [filters, setFilters] = useState<LoanFilters>(initialFilters);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchLoans = async () => {
    if (!user) return;
    
    setLoading(true);
    try {
      const { data, error } = await getLoans(user.id);
      
      if (error) {
        throw error;
      } else if (data) {
        setLoans(data);
      }
    } catch (err) {
      setError(err as Error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLoans();
  }, [user]);

  useEffect(() => {
    let result = [...loans];
    
    // Apply status filter
    if (filters.status && filters.status !== 'all') {
      result = result.filter(loan => loan.status === filters.status);
    }
    
    // Apply type filter
    if (filters.type === 'lending') {
      result = result.filter(loan => loan.is_lending);
    } else if (filters.type === 'borrowing') {
      result = result.filter(loan => !loan.is_lending);
    }
    
    setFilteredLoans(result);
  }, [filters, loans]);

  const getLoan = async (id: string) => {
    setLoading(true);
    try {
      const { data, error } = await getLoanById(id);
      if (error) throw error;
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const addLoan = async (loanData: Partial<Loan>) => {
    setLoading(true);
    try {
      const { data, error } = await createLoan(loanData);
      if (error) throw error;
      
      if (data) {
        setLoans(prev => [...prev, data]);
      }
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const updateLoanItem = async (id: string, updates: Partial<Loan>) => {
    setLoading(true);
    try {
      const { data, error } = await updateLoan(id, updates);
      if (error) throw error;
      
      if (data) {
        setLoans(prev => prev.map(loan => loan.id === id ? data : loan));
      }
      return data;
    } catch (err) {
      setError(err as Error);
      return null;
    } finally {
      setLoading(false);
    }
  };

  const removeLoan = async (id: string) => {
    setLoading(true);
    try {
      const { error } = await deleteLoan(id);
      if (error) throw error;
      
      setLoans(prev => prev.filter(loan => loan.id !== id));
      return true;
    } catch (err) {
      setError(err as Error);
      return false;
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = (newFilters: LoanFilters) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const refresh = () => {
    fetchLoans();
  };

  return {
    loans: filteredLoans,
    loading,
    error,
    filters,
    getLoan,
    addLoan,
    updateLoan: updateLoanItem,
    removeLoan,
    applyFilters,
    refresh
  };
}; 