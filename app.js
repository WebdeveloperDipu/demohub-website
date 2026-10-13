(()=>{"use strict";const $=s=>document.querySelector(s),$$=s=>[...document.querySelectorAll(s)];let user=null,cat=1,balance=0,profit=0,done=new Set(),reports=[];const toast=m=>{const t=$("#toast");t.textContent=m;t.classList.add("show");setTimeout(()=>t.classList.remove("show"),3000)},bn=n=>Number(n||0).toLocaleString("bn-BD"),read=()=>{try{return JSON.parse(localStorage.getItem("dpbd_users")||"{}")}catch{return{}}},save=u=>localStorage.setItem("dpbd_users",JSON.stringify(u));const cats=Array.from({length:6},(_,i)=>({id:i+1,name:`টাস্ক ${i+1}`,tasks:Array.from({length:15},(_,j)=>({id:`${i+1}-${j+1}`,name:`নমুনা পণ্য টাস্ক ${j+1}`,reward:15,icon:["▣","◇","✦","◈","⬡","◎"][i]}))}));let enabled={};try{enabled=JSON.parse(localStorage.getItem("dpbd_enabled")||"{}")}catch{}function tab(t){$("#loginForm").hidden=t!=="login";$("#registerForm").hidden=t!=="register";$$("[data-tab]").forEach(b=>b.classList.toggle("active",b.dataset.tab===t))}$$("[data-tab]").forEach(b=>b.onclick=()=>tab(b.dataset.tab));$$("[data-auth]").forEach(b=>b.onclick=()=>{tab(b.dataset.auth);$("#auth").scrollIntoView({behavior:"smooth"})});$("#menu").onclick=()=>$("#nav").classList.toggle("open");

$("#registerForm").onsubmit = async e => {
  e.preventDefault();

  const f = new FormData(e.target);
  const name = String(f.get("name") || "").trim();
  const password = String(f.get("password") || "");
  const confirmPassword = String(f.get("confirmPassword") || "");

  if (password.length < 8) {
    return toast("পাসওয়ার্ড কমপক্ষে ৮ অক্ষরের হতে হবে।");
  }

  if (password !== confirmPassword) {
    return toast("দুটি পাসওয়ার্ড মেলেনি।");
  }

 
try {
  const email = String(f.get("email") || "").trim().toLowerCase();

  const { data, error } = await window.sb.auth.signUp({
    email,
    password,
    options: {
      data: { name }
    }
  });

  if (error) throw error;

  if (!data.session) {
    toast("আপনার ইমেইল যাচাই করুন, তারপর Login করুন।");
    return;
  }

  e.target.reset();
  tab("login");
  toast("Registration সফল হয়েছে। এখন Login করুন।");
} catch (err) {
  toast(err.message || "Registration করা যায়নি।");
}
};

$("#loginForm").onsubmit = async e => {
  e.preventDefault();

  const f = new FormData(e.target);

 
try {
  const email = String(f.get("email") || "").trim().toLowerCase();
  const password = String(f.get("password") || "");

  const { data, error } = await window.sb.auth.signInWithPassword({
    email,
    password
  });

  if (error) throw error;

  user = {
    id: data.user.id,
    name: data.user.user_metadata?.name || "সদস্য"
  };

  openDash();
} catch (err) {
  toast(err.message || "Login করা যায়নি। ইমেইল ও পাসওয়ার্ড যাচাই করুন।");
}
};  
async function restoreSession() {
  try {
    const { data, error } = await window.sb.auth.getSession();

    if (error) throw error;

    if (data.session) {
      const currentUser = data.session.user;

      user = {
        id: currentUser.id,
        name: currentUser.user_metadata?.name || "সদস্য"
      };

      openDash();
    }
  } catch (err) {
    console.error("Session restore error:", err.message);
  }
}

function openDash(){$(".hero").hidden=$("#auth").hidden=$("#products").hidden=$("#about").hidden=true;$("#dashboard").hidden=false;$("#dock").hidden=false;document.body.classList.add("docked");$("#dashName").textContent=$("#profileName").textContent=user.name;$("#profileId").textContent=user.id;$("#summaryUserId").textContent=user.id;$("#avatar").textContent=user.name[0].toUpperCase();time();renderCats();renderReports();renderAdmin();metrics();scrollTo({top:0,behavior:"smooth"});toast("ডেমো ড্যাশবোর্ড খোলা হয়েছে; বাস্তব লেনদেন নেই।")}function time(){let d=new Date();$("#bdtime").textContent="বাংলাদেশ সময়: "+d.toLocaleString("bn-BD",{timeZone:"Asia/Dhaka",dateStyle:"medium",timeStyle:"short"})}
function metrics(){
  if($("#balance")) $("#balance").textContent="৳ "+bn(balance);
  if($("#profit")) $("#profit").textContent="৳ "+bn(profit);
  if($("#done")) $("#done").textContent=bn(done.size);
}
function renderCats(){$("#categories").innerHTML=cats.map(c=>`<button class="cat ${c.id===cat?"active":""}" data-cat="${c.id}">${c.name}</button>`).join("");$$("[data-cat]").forEach(b=>b.onclick=()=>{cat=+b.dataset.cat;renderCats()});let c=cats[cat-1];if(enabled[c.id]===false){$("#tasks").innerHTML="<p class='foot'>এই বিভাগটি অ্যাডমিন প্রিভিউ থেকে বন্ধ করা হয়েছে।</p>";return}let firstPending=c.tasks.find(t=>!done.has(t.id));$("#tasks").innerHTML=c.tasks.map(t=>{let locked=done.has(t.id)===false&&t!==firstPending;return `<article class="task ${locked?"locked":""}"><div class="task-icon">${t.icon}</div><div class="task-copy"><b>অর্ডার #${String(t.id.split("-")[1]).padStart(2,"0")}</b><small>${t.name} · নমুনা অর্ডার</small><strong>+৳ ${bn(t.reward)} কাল্পনিক পয়েন্ট</strong></div><button class="btn" data-task="${t.id}" ${done.has(t.id)||locked?"disabled":""}>${done.has(t.id)?"সম্পন্ন ✓":locked?"লকড":"অর্ডার খুলুন"}</button></article>`}).join("");$$("[data-task]").forEach(b=>b.onclick=()=>{if(done.has(b.dataset.task))return;done.add(b.dataset.task);profit+=15;reports.unshift({name:user.name,id:"ORDER-"+b.dataset.task,amount:15,own:true});metrics();renderCats();renderReports();toast("ডেমো অর্ডার সম্পন্ন। পরের সিরিয়াল অর্ডার আনলক হয়েছে; বাস্তব আয় নয়।")})}function renderReports(){let sample=[["Demo User A","SAMPLE-1001",400],["Demo User B","SAMPLE-1002",1250],["Demo User C","SAMPLE-1003",800],["Demo User D","SAMPLE-1004",2300],["Demo User E","SAMPLE-1005",650],["Demo User F","SAMPLE-1006",1450]].map(x=>({name:x[0],id:x[1],amount:x[2],own:false}));let rows=[...reports,...sample].slice(0,8).map(r=>`<div class="report"><div class="avatar">${r.name[0]}</div><div class="person"><b>${r.name}</b><small>${r.id} · ${r.own?"আপনার ডেমো কার্যক্রম":"কাল্পনিক নমুনা—বাস্তব উত্তোলন নয়"}</small></div><strong>${r.own?"+":"DEMO ৳"}${bn(r.amount)} ${r.own?"পয়েন্ট":"উদাহরণ"}</strong></div>`).join("");$("#reports").innerHTML=`<div class="report-track">${rows}${rows}</div>`}function renderAdmin(){$("#admin").innerHTML=cats.map(c=>`<label>${c.name} চালু রাখুন <input type="checkbox" data-enable="${c.id}" ${enabled[c.id]===false?"":"checked"}></label>`).join("");$$("[data-enable]").forEach(ch=>ch.onchange=()=>{enabled[ch.dataset.enable]=ch.checked;localStorage.setItem("dpbd_enabled",JSON.stringify(enabled));renderCats();toast("লোকাল ডেমো সেটিং বদলেছে।")})}let walletType="recharge";$$("[data-wallet]").forEach(b=>b.onclick=()=>{walletType=b.dataset.wallet;$("#wallet").hidden=false;$("#walletTitle").textContent=walletType==="recharge"?"রিচার্জ ডেমো":"উত্তোলন ডেমো";$("#trxLabel").hidden=walletType!=="recharge";$("#walletForm [name=trx]").required=walletType==="recharge";$("#wallet").scrollIntoView({behavior:"smooth"})});$$('.pay-card input[name="method"]').forEach(r=>r.addEventListener("change",()=>{$$(".pay-card").forEach(c=>c.classList.toggle("active",c.contains(r)&&r.checked))}));$("#walletForm").onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),amount=Number(f.get("amount"));reports.unshift({name:user.name,id:walletType==="recharge"?"DEMO-RECHARGE":"DEMO-WITHDRAW",amount,own:true});renderReports();e.target.reset();toast("ডেমো অনুরোধ দেখানো হয়েছে। কোনো টাকা পাঠানো হয়নি বা ব্যালেন্স বদলায়নি।")};
$("#logout").onclick = async () => {
  try {
    const { error } = await window.sb.auth.signOut();

    if (error) throw error;

    user = null;
    $("#dashboard").hidden = true;
    $("#dock").hidden = true;
    document.body.classList.remove("docked");

    $(".hero").hidden = false;
    $("#auth").hidden = false;
    $("#products").hidden = false;
    $("#about").hidden = false;

    scrollTo({ top: 0, behavior: "smooth" });
    toast("সফলভাবে Logout হয়েছে।");
  } catch (err) {
    console.error("Logout error:", err.message);
    toast("Logout করা যায়নি। আবার চেষ্টা করুন।");
  }
};
;$$ ("[data-dock]").forEach(b=>b.onclick=()=>{let k=b.dataset.dock;$$ ("[data-dock]").forEach(x=>x.classList.toggle("active",x===b));if(k==="home"){ $("#dashboard").hidden=true;$(".hero").hidden=$("#auth").hidden=$("#products").hidden=$("#about").hidden=false;scrollTo({top:0,behavior:"smooth"});return}$(".hero").hidden=$("#auth").hidden=$("#products").hidden=$("#about").hidden=true;$("#dashboard").hidden=false;$("#orderPanel").hidden=k!=="orders";if(k==="wallet"){$("#wallet").hidden=false;$("#wallet").scrollIntoView({behavior:"smooth"})}else if(k==="orders")$("#orderPanel").scrollIntoView({behavior:"smooth"});else if(k==="profile")$(".profile").scrollIntoView({behavior:"smooth"});else scrollTo({top:0,behavior:"smooth"})});
window.sb.auth.onAuthStateChange((event, session) => {
  if (event === "SIGNED_OUT" || !session) {
    user = null;
    $("#dashboard").hidden = true;
    $("#dock").hidden = true;
    document.body.classList.remove("docked");

    $(".hero").hidden = false;
    $("#auth").hidden = false;
    $("#products").hidden = false;
    $("#about").hidden = false;
    return;
  }

  if (event === "INITIAL_SESSION" && session) {
    user = {
      id: session.user.id,
      name: session.user.user_metadata?.name || "সদস্য"
    };
    openDash();
  }
});

  ;$("#track").innerHTML+=$("#track").innerHTML;setInterval(time,60000)})();
