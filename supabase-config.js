// Supabase Configuration
// Replace these with your actual Supabase project URL and anon key
const SUPABASE_URL = 'https://tbkwbbfeahbmxtjusrcm.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRia3diYmZlYWhibXh0anVzcmNtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUzMDA4NTUsImV4cCI6MjA3MDg3Njg1NX0.1iRTX1MM8uw-HURdX-ORTnqMNyXK8N1CsEmUS3mfD2c';

// Initialize Supabase client
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// Authentication service
class AuthService {
  constructor() {
    this.user = null;
    this.session = null;
    this.init();
  }

  async init() {
    // Get initial session
    const { data: { session } } = await supabase.auth.getSession();
    this.session = session;
    this.user = session?.user || null;

    // Update UI immediately if user is signed in
    if (this.user) {
      this.updateUIForSignedInUser(this.user);
    }

    // Listen for auth changes
    supabase.auth.onAuthStateChange((event, session) => {
      this.session = session;
      this.user = session?.user || null;
      this.handleAuthStateChange(event, session);
    });
  }

  handleAuthStateChange(event, session) {
    if (event === 'SIGNED_IN') {
      // User signed in
      this.updateUIForSignedInUser(session.user);
    } else if (event === 'SIGNED_OUT') {
      // User signed out
      this.updateUIForSignedOutUser();
    }
  }

  async signUp(email, password, fullName) {
    try {
      // First, create the user account
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: email,
        password: password,
        options: {
          data: {
            full_name: fullName
          }
        }
      });

      if (authError) throw authError;

      // If user creation is successful, save data to your custom table
      if (authData.user) {
        console.log('🔄 Attempting to save user data to table...');
        console.log('📧 Email:', email);
        console.log('👤 Name:', fullName);

        // Insert data into your "Data of Users" table
        // Note: id and created_at should be auto-generated
        const { data: tableData, error: tableError } = await supabase
          .from('Data of Users')
          .insert({
            email: email,
            name: fullName
          })
          .select(); // This returns the inserted data

        if (tableError) {
          console.error('❌ Error saving to Data of Users table:', tableError);
          console.error('Full error details:', JSON.stringify(tableError, null, 2));
          // Show user-friendly error message
          alert(`⚠️ Account created successfully, but there was an issue saving your profile data. Error: ${tableError.message}`);
        } else {
          console.log('✅ User data saved to table successfully:', tableData);
          alert('✅ Account created and profile data saved successfully!');
        }
      }

      return { success: true, data: authData };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signIn(email, password) {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password
      });

      if (error) throw error;

      return { success: true, data };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  async resetPassword(email) {
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password.html`
      });

      if (error) throw error;

      return { success: true };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }

  isSignedIn() {
    return this.user !== null;
  }

  getCurrentUser() {
    return this.user;
  }

  async getUserDataFromTable(email) {
    try {
      // Use a timeout to prevent hanging
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Timeout')), 2000)
      );

      const queryPromise = supabase
        .from('Data of Users')
        .select('name, email')  // Only select what we need
        .eq('email', email)
        .single();

      const { data, error } = await Promise.race([queryPromise, timeoutPromise]);

      if (error) {
        console.log('Error fetching user data from table:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.log('Error in getUserDataFromTable:', error);
      return null;
    }
  }

  updateUIForSignedInUser(user) {
    // Update navigation immediately
    const navSignIn = document.getElementById('nav-signin');
    const navSignUp = document.getElementById('nav-signup');
    const profileBox = document.getElementById('profile-box');

    if (navSignIn) navSignIn.style.display = 'none';
    if (navSignUp) navSignUp.style.display = 'none';

    if (profileBox) {
      // Show profile immediately with auth data (fast)
      const fullName = user.user_metadata?.full_name || user.email.split('@')[0];

      profileBox.innerHTML = `
        <div class="profile-info">
          <div class="profile-avatar">
            <i class="fas fa-user"></i>
          </div>
          <div class="profile-details">
            <span class="profile-name">${fullName}</span>
            <span class="profile-status">Online</span>
          </div>
          <div class="profile-actions">
            <button id="logout-btn" title="Log out" class="logout-btn">
              <i class="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      `;
      profileBox.style.display = 'flex';

      // Add logout event listener
      const logoutBtn = document.getElementById('logout-btn');
      if (logoutBtn) {
        logoutBtn.onclick = async () => {
          await this.signOut();
        };
      }

      // Optionally update with table data in background (slower but more accurate)
      this.updateProfileWithTableData(user.email, profileBox);
    }

    // Hide suggestion modal if visible
    const modal = document.getElementById('suggest-modal');
    if (modal) {
      modal.style.display = 'none';
    }
  }

  async updateProfileWithTableData(email, profileBox) {
    try {
      const userData = await this.getUserDataFromTable(email);
      if (userData && userData.name) {
        // Update only the name if we got better data from table
        const nameElement = profileBox.querySelector('.profile-name');

        if (nameElement && userData.name !== nameElement.textContent) {
          nameElement.textContent = userData.name;
        }
      }
    } catch (error) {
      // Silently fail - we already have the profile showing
      console.log('Could not update profile with table data:', error);
    }
  }

  updateUIForSignedOutUser() {
    // Update navigation
    const navSignIn = document.getElementById('nav-signin');
    const navSignUp = document.getElementById('nav-signup');
    const profileBox = document.getElementById('profile-box');

    if (navSignIn) navSignIn.style.display = 'block';
    if (navSignUp) navSignUp.style.display = 'block';
    if (profileBox) profileBox.style.display = 'none';

    // Redirect to home if on a protected page
    if (window.location.pathname !== '/index.html' && window.location.pathname !== '/') {
      window.location.href = 'index.html';
    }
  }
}

// Initialize auth service
const authService = new AuthService();

// Test function to check table access
window.testTableAccess = async function() {
  try {
    console.log('🧪 Testing table access...');

    // Test 1: Try to read from table
    const { data: readData, error: readError } = await supabase
      .from('Data of Users')
      .select('*')
      .limit(1);

    if (readError) {
      console.error('❌ Read test failed:', readError);
    } else {
      console.log('✅ Read test successful:', readData);
    }

    // Test 2: Try to insert test data (only if user is authenticated)
    if (authService.isSignedIn()) {
      const testEmail = `test-${Date.now()}@example.com`;
      const { data: insertData, error: insertError } = await supabase
        .from('Data of Users')
        .insert([
          {
            email: testEmail,
            name: 'Test User'
          }
        ]);

      if (insertError) {
        console.error('❌ Insert test failed:', insertError);
      } else {
        console.log('✅ Insert test successful:', insertData);
      }
    } else {
      console.log('ℹ️ Not authenticated, skipping insert test');
    }

  } catch (error) {
    console.error('❌ Table test error:', error);
  }
};

// Make it globally available
window.authService = authService;

// Initialize auth service only if not on cart page
if (!window.CART_PAGE_MODE) {
  // Auto-initialize auth service for other pages
  document.addEventListener('DOMContentLoaded', function() {
    if (window.authService) {
      // Check current auth state without triggering changes
      const currentUser = window.authService.getCurrentUser();
      if (currentUser) {
        console.log('User already signed in:', currentUser.email);
      }
    }
  });
}
