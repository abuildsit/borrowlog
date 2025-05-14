import { supabase } from '../utils/supabaseClient';
import { Profile, Contact, Loan, Notification } from '../types';

// Profile services
export const getProfile = async (userId: string) => {
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single();
  
  return { data: data as Profile | null, error };
};

export const updateProfile = async (userId: string, updates: Partial<Profile>) => {
  const { data, error } = await supabase
    .from('profiles')
    .update(updates)
    .eq('id', userId)
    .select()
    .single();
  
  return { data: data as Profile | null, error };
};

export const createProfile = async (profile: Partial<Profile>) => {
  console.log('Creating profile with data:', profile);
  
  if (!profile.id) {
    console.error('Profile creation error: Missing user ID');
    return { data: null, error: new Error('User ID is required') };
  }
  
  try {
    // Use the RLS bypass function instead of direct insert
    const { data, error } = await supabase.rpc(
      'create_profile_bypass_rls',
      {
        user_id: profile.id,
        display_name: profile.display_name || '',
        avatar_url: profile.avatar_url || null
      }
    );
    
    if (error) {
      console.error('Profile creation error details:', error);
    }
    
    return { data: data?.[0] as Profile | null, error };
  } catch (e) {
    console.error('Unexpected error in createProfile:', e);
    return { data: null, error: e as Error };
  }
};

// Contact services
export const getContacts = async (userId: string) => {
  const { data, error } = await supabase
    .from('contacts')
    .select('*')
    .eq('user_id', userId);
  
  return { data: data as Contact[] | null, error };
};

export const createContact = async (contact: Partial<Contact>) => {
  const { data, error } = await supabase
    .from('contacts')
    .insert([contact])
    .select()
    .single();
  
  return { data: data as Contact | null, error };
};

export const updateContact = async (contactId: string, updates: Partial<Contact>) => {
  const { data, error } = await supabase
    .from('contacts')
    .update(updates)
    .eq('id', contactId)
    .select()
    .single();
  
  return { data: data as Contact | null, error };
};

export const deleteContact = async (contactId: string) => {
  const { error } = await supabase
    .from('contacts')
    .delete()
    .eq('id', contactId);
  
  return { error };
};

// Loan services
export const getLoans = async (userId: string, filters?: { status?: string, isLending?: boolean }) => {
  let query = supabase
    .from('loans')
    .select('*')
    .or(`owner_id.eq.${userId},borrower_id.eq.${userId}`);
  
  if (filters?.status) {
    query = query.eq('status', filters.status);
  }
  
  if (filters?.isLending !== undefined) {
    query = query.eq('is_lending', filters.isLending);
  }
  
  const { data, error } = await query;
  
  return { data: data as Loan[] | null, error };
};

export const getLoanById = async (loanId: string) => {
  const { data, error } = await supabase
    .from('loans')
    .select('*')
    .eq('id', loanId)
    .single();
  
  return { data: data as Loan | null, error };
};

export const createLoan = async (loan: Partial<Loan>) => {
  const { data, error } = await supabase
    .from('loans')
    .insert([loan])
    .select()
    .single();
  
  return { data: data as Loan | null, error };
};

export const updateLoan = async (loanId: string, updates: Partial<Loan>) => {
  const { data, error } = await supabase
    .from('loans')
    .update(updates)
    .eq('id', loanId)
    .select()
    .single();
  
  return { data: data as Loan | null, error };
};

export const deleteLoan = async (loanId: string) => {
  const { error } = await supabase
    .from('loans')
    .delete()
    .eq('id', loanId);
  
  return { error };
};

// Notification services
export const getNotifications = async (userId: string, isRead?: boolean) => {
  let query = supabase
    .from('notifications')
    .select('*')
    .eq('recipient_id', userId);
  
  if (isRead !== undefined) {
    query = query.eq('is_read', isRead);
  }
  
  const { data, error } = await query.order('created_at', { ascending: false });
  
  return { data: data as Notification[] | null, error };
};

export const markNotificationAsRead = async (notificationId: string) => {
  const { data, error } = await supabase
    .from('notifications')
    .update({ is_read: true })
    .eq('id', notificationId)
    .select()
    .single();
  
  return { data: data as Notification | null, error };
};

export const createNotification = async (notification: Partial<Notification>) => {
  const { data, error } = await supabase
    .from('notifications')
    .insert([notification])
    .select()
    .single();
  
  return { data: data as Notification | null, error };
};

// Storage services
export const uploadImage = async (file: File, bucket: string, path: string) => {
  const fileExt = file.name.split('.').pop();
  const fileName = `${path}-${Math.random()}.${fileExt}`;
  const filePath = `${path}/${fileName}`;

  const { error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file);

  if (error) {
    return { data: null, error };
  }

  const { data: publicUrl } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);

  return { data: publicUrl.publicUrl, error: null };
}; 