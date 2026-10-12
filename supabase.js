// Supabase connection configuration
const SUPABASE_URL ="https://usnafrdealnkxcbhthts.supabase.co/rest/v1/";
const SUPABASE_PUBLISHABLE_KEY ="sb_publishable_fXuHEc0s0wHRzyiGmNnyzA_sJL3PPIb";
window.supabaseConnectionTest = async function () {
  try {
    const client = window.supabase.createClient(
      SUPABASE_URL,
      SUPABASE_PUBLISHABLE_KEY
    );

    const { data, error } = await client
      .from("tasks")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Supabase connection error:", error.message);
      return;
    }

    console.log("Supabase connection successful!");
  } catch (err) {
    console.error("Connection failed:", err.message);
  }
};
