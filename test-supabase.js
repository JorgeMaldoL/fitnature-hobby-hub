// Test Supabase connection
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://uikmqwozwlojhnshccna.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVpa21xd296d2xvamhuc2hjY25hIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ0NTkwNDcsImV4cCI6MjA3MDAzNTA0N30.jm-jsTRp4RlE7qLNmKn6pJhbGpVhsyMWXliP26xAxJs';

const supabase = createClient(supabaseUrl, supabaseAnonKey);

console.log('Testing Supabase connection...');

// Test connection
async function testConnection() {
  try {
    // Check if we can fetch from posts table
    console.log('Testing with "posts" (lowercase)...');
    let { data, error } = await supabase.from('posts').select('*').limit(1);
    
    if (error && error.code === 'PGRST205') {
      console.log('Trying with "Posts" (capitalized)...');
      const result = await supabase.from('Posts').select('*').limit(1);
      data = result.data;
      error = result.error;
    }
    
    if (error) {
      console.error('Error:', error);
      if (error.code === '42P01' || error.code === 'PGRST205') {
        console.log('❌ Table does not exist! You need to create a "posts" table in Supabase.');
      }
    } else {
      console.log('✅ Connection successful!');
      console.log('Data:', data);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
  }
}

testConnection();
