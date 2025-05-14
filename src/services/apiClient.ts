import { supabase } from '../utils/supabaseClient';
import toast from 'react-hot-toast';

export interface ApiResponse<T> {
  data: T | null;
  error: Error | null;
}

class ApiClient {
  async get<T>(table: string, options?: {
    id?: string;
    filter?: { field: string; value: any }[];
    select?: string;
    order?: { column: string; ascending?: boolean };
  }): Promise<ApiResponse<T>> {
    try {
      let query = supabase.from(table).select(options?.select || '*');

      if (options?.id) {
        query = query.eq('id', options.id);
      }
      
      if (options?.filter) {
        options.filter.forEach(({ field, value }) => {
          query = query.eq(field, value);
        });
      }
      
      if (options?.order) {
        query = query.order(options.order.column, { 
          ascending: options.order.ascending ?? true 
        });
      }
      
      const { data, error } = options?.id 
        ? await query.single() 
        : await query;
      
      if (error) throw error;
      
      return { data: data as T, error: null };
    } catch (error) {
      console.error(`Error fetching ${table}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async create<T>(table: string, data: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const { data: result, error } = await supabase
        .from(table)
        .insert([data])
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: result as T, error: null };
    } catch (error) {
      console.error(`Error creating ${table}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async update<T>(table: string, id: string, updates: Record<string, any>): Promise<ApiResponse<T>> {
    try {
      const { data, error } = await supabase
        .from(table)
        .update(updates)
        .eq('id', id)
        .select()
        .single();
      
      if (error) throw error;
      
      return { data: data as T, error: null };
    } catch (error) {
      console.error(`Error updating ${table}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async delete(table: string, id: string): Promise<ApiResponse<null>> {
    try {
      const { error } = await supabase
        .from(table)
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      return { data: null, error: null };
    } catch (error) {
      console.error(`Error deleting from ${table}:`, error);
      return { data: null, error: error as Error };
    }
  }

  async upload(bucket: string, path: string, file: File): Promise<ApiResponse<string>> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${path}-${Math.random()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;

      const { error } = await supabase.storage
        .from(bucket)
        .upload(filePath, file);

      if (error) throw error;

      const { data: publicUrl } = supabase.storage
        .from(bucket)
        .getPublicUrl(filePath);

      return { data: publicUrl.publicUrl, error: null };
    } catch (error) {
      console.error('Error uploading file:', error);
      return { data: null, error: error as Error };
    }
  }

  // Helper to handle errors consistently
  handleError(error: Error | null): void {
    if (error) {
      toast.error(error.message || 'An error occurred');
    }
  }
}

export const apiClient = new ApiClient(); 