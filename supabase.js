
const SUPABASE_URL = "https://usnafrdealnkxcbhthts.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_fXuHEc0s0wHRzyiGmNnyzA_sJL3PPIb";

window.sb = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);

window.supabaseConnectionTest = async function () {
  const { error } = await window.sb
    .from("tasks")
    .select("id")
    .limit(1);

  if (error) {
    console.error("Supabase connection error:", error.message);
    return;
  }

  console.log("Supabase connection successful!");
};

window.addEventListener("load", window.supabaseConnectionTest);

