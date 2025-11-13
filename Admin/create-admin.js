// create-admin.js
const { createClient } = require('@supabase/supabase-js');
require('dotenv').config();

// Konfigurasi Supabase
const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase environment variables');
  console.log('Please set:');
  console.log('VITE_SUPABASE_URL in your .env file');
  console.log('SUPABASE_SERVICE_KEY in your .env file');
  console.log('\nGet SERVICE_KEY from: Supabase Dashboard → Settings → API');
  process.exit(1);
}

// Buat client dengan service role key untuk akses admin
const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function createAdminAccount() {
  console.log('🚀 Starting admin account creation...');
  
  const adminEmail = 'admin@smp.com';
  const adminPassword = 'cobadulu123';
  const adminName = 'Administrator Sistem';

  try {
    // Step 1: Cek apakah user sudah ada dan buat profile admin
    console.log('📧 Checking existing admin user...');
    
    // Dapatkan user ID dari email
    const userId = await getUserIdByEmail(adminEmail);
    console.log(`✅ Found existing user ID: ${userId}`);

    // Step 2: Reset password untuk memastikan kita tahu passwordnya
    console.log('🔄 Resetting password...');
    const { error: resetError } = await supabase.auth.admin.updateUserById(
      userId,
      { 
        password: adminPassword,
        user_metadata: {
          nama: adminName,
          role: 'admin'
        }
      }
    );
    
    if (resetError) {
      console.log('⚠️  Could not reset password:', resetError.message);
    } else {
      console.log('✅ Password reset successfully');
    }

    // Step 3: Create admin profile
    await createAdminProfile(userId, adminName, adminEmail);

    console.log('\n🎉 ADMIN ACCOUNT SETUP COMPLETED!');
    console.log('========================================');
    console.log(`📧 Email: ${adminEmail}`);
    console.log(`🔑 Password: ${adminPassword}`);
    console.log(`👤 Name: ${adminName}`);
    console.log(`🎯 Role: admin`);
    console.log(`🆔 User ID: ${userId}`);
    console.log('========================================');
    console.log('\n⚠️  You can now login to your application with these credentials.');

  } catch (error) {
    console.error('❌ Error setting up admin account:', error.message);
    
    if (error.message.includes('JWT')) {
      console.log('\n🔐 Please check your SUPABASE_SERVICE_KEY');
      console.log('Get it from: Supabase Dashboard → Settings → API → service_role key');
    }
    
    process.exit(1);
  }
}

// Helper function untuk mendapatkan user ID by email
async function getUserIdByEmail(email) {
  try {
    const { data: users, error } = await supabase.auth.admin.listUsers();
    if (error) throw error;
    
    const user = users.users.find(u => u.email === email);
    if (!user) {
      throw new Error(`User with email ${email} not found in Auth system`);
    }
    
    return user.id;
  } catch (error) {
    console.error('Error getting user ID:', error.message);
    throw error;
  }
}

// Function untuk membuat/update admin profile
async function createAdminProfile(userId, name, email) {
  console.log('👤 Creating/updating admin profile...');
  
  try {
    // Cek apakah profile sudah ada
    const { data: existingProfile, error: checkError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (existingProfile) {
      // Update existing profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          nama: name,
          email: email,
          role: 'admin',
          updated_at: new Date()
        })
        .eq('id', userId);

      if (updateError) {
        console.log('⚠️  Could not update profile:', updateError.message);
        throw updateError;
      }
      console.log('✅ Admin profile updated');
    } else {
      // Insert new profile
      const { error: insertError } = await supabase
        .from('profiles')
        .insert({
          id: userId,
          nama: name,
          email: email,
          role: 'admin',
          created_at: new Date(),
          updated_at: new Date()
        });

      if (insertError) {
        // Jika tabel profiles belum ada, beri instruksi
        if (insertError.code === '42P01') {
          console.log('❌ Profiles table does not exist!');
          console.log('Please run this SQL in Supabase SQL Editor first:');
          console.log(`
            CREATE TABLE profiles (
              id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
              nama VARCHAR NOT NULL,
              email VARCHAR NOT NULL,
              role VARCHAR NOT NULL CHECK (role IN ('admin', 'guru', 'siswa')),
              avatar_url TEXT,
              created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
              updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
            );
            
            ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
            
            CREATE POLICY "Users can view own profile" ON profiles
              FOR SELECT USING (auth.uid() = id);
              
            CREATE POLICY "Users can update own profile" ON profiles
              FOR UPDATE USING (auth.uid() = id);
              
            CREATE POLICY "Admin can manage all profiles" ON profiles
              FOR ALL USING (
                EXISTS (
                  SELECT 1 FROM profiles 
                  WHERE id = auth.uid() AND role = 'admin'
                )
              );
          `);
          throw new Error('Profiles table does not exist');
        }
        console.log('⚠️  Could not create profile:', insertError.message);
        throw insertError;
      }
      console.log('✅ Admin profile created');
    }

  } catch (profileError) {
    console.log('❌ Profile creation failed:', profileError.message);
    throw profileError;
  }
}

// Jalankan script
createAdminAccount();