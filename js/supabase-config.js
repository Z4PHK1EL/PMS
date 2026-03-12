// Supabase Configuration File
// Replace with your actual Supabase project credentials

const SUPABASE_CONFIG = {
    URL: 'https://ehatowzdktvkklohheud.supabase.co', // e.g., 'https://abcdefgh123456789.supabase.co'
    ANON_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVoYXRvd3pka3R2a2tsb2hoZXVkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzMyMzMzMjQsImV4cCI6MjA4ODgwOTMyNH0.9y24F1SVxv0FM_48b99qULhbQaysx1l2oXvBpQZQiPs', // e.g., 'eyJhbGciOiJIUzI1NiIs...'
};

// Initialize Supabase client
// Note: This assumes the Supabase JS library is loaded via CDN
if (typeof supabase !== 'undefined') {
    window.supabaseClient = supabase.createClient(
        SUPABASE_CONFIG.URL, 
        SUPABASE_CONFIG.ANON_KEY
    );
    console.log('Supabase client initialized successfully');
} else {
    console.error('Supabase library not loaded. Please include the Supabase JS CDN.');
}

// Export for module usage (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = SUPABASE_CONFIG;
}