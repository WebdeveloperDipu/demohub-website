
const SUPABASE_URL ="https://usnafrdealnkxcbhthts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY ="sb_publishable_fXuHEc0s0wHRzyiGmNnyzA_sJL3PPIb";


if (!window.supabase) {
  console.error("Supabase library লোড হয়নি।");
} else {
  window.sb = window.supabase.createClient(
    SUPABASE_URL,
    SUPABASE_PUBLISHABLE_KEY
  );
}

window.supabaseConnectionTest = async function () {
  if (!window.sb) {
    console.error("Supabase client তৈরি হয়নি।");
    return;
  }

  const { error } = await window.sb.auth.getSession();

  if (error) {
    console.error("Supabase auth error:", error.message);
    return;
  }

  console.log("Supabase authentication connection successful!");
};

window.addEventListener("load", window.supabaseConnectionTest);
