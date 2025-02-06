import { supabase } from './lib/supabase';

export async function createTestBeads() {
  const { error } = await supabase
    .from('fyf')
    .insert([
      // ... 데이터 ...
    ]);
  if (error) throw error;
}

export async function deleteAllBeads() {
  const { error } = await supabase
    .from('fyf')
    .delete()
    .neq('id', '0');
  if (error) throw error;
}

export async function getBeads() {
  const { data, error } = await supabase
    .from('fyf')
    .select('*')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data;
} 