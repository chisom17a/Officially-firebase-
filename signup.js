import { createClient } from '@supabase/supabase-js';

// Supabase connection
const supabaseUrl = "https://iteybtupurdfahvganlh.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml0ZXlidHVwdXJkZmFodmdhbmxoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzNDgwNTcsImV4cCI6MjA3ODkyNDA1N30.fGC5XRhy7KUta9joCSzCIE1yGM7ywkAN_A12moiSLAQ";

const supabase = createClient(supabaseUrl, supabaseKey);

// --- SIGNUP FUNCTION ---
export async function signupUser(userData) {
  const { email, phone, referral, password, repeatPassword, model } = userData;

  // --- VALIDATION ---
  if (!email || !phone || !password || !repeatPassword || !model) {
    return { success: false, message: "All required fields must be filled." };
  }

  if (password.length < 6) {
    return { success: false, message: "Password must be at least 6 characters long." };
  }

  if (password !== repeatPassword) {
    return { success: false, message: "Passwords do not match." };
  }

  // --- CHECK IF EMAIL EXISTS ---
  const { data: emailExists } = await supabase
    .from("users")
    .select("email")
    .eq("email", email)
    .maybeSingle();

  if (emailExists) {
    return { success: false, message: "Email already exists." };
  }

  // --- CHECK IF PHONE EXISTS ---
  const { data: phoneExists } = await supabase
    .from("users")
    .select("phone")
    .eq("phone", phone)
    .maybeSingle();

  if (phoneExists) {
    return { success: false, message: "Phone number already exists." };
  }

  // --- SAVE NEW USER ---
  const { data, error } = await supabase.from("users").insert([
    {
      email,
      phone,
      referral: referral || null,
      password, // ⚠️ NOT hashed — use bcrypt in production
      model,
      created_at: new Date().toISOString(),
    }
  ]);

  if (error) {
    return { success: false, message: error.message };
  }

  return {
    success: true,
    message: "Signup successful!",
    user: data[0]
  };
}