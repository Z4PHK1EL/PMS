/* ========== SUPABASE CONFIG ========== */
const SUPABASE_URL = 'https://hwsrzedradgvmqyqamap.supabase.co';        // ← CHANGE THIS
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3c3J6ZWRyYWRndm1xeXFhbWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDQ1NjgsImV4cCI6MjA3OTAyMDU2OH0.MtiTUTHjCiIDTVasEV7Gks7K8uodpkYDfjhCjGC-iIA'; // ← CHANGE THIS

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ========== EMAILJS + SEMAPHORE CONFIG (Keep your keys) ========== */
const EMAILJS_PUBLIC_KEY   = "eU-xPATZn_z0wgAY5";
const EMAILJS_SERVICE_ID   = "Appointment_Service";
const TEMPLATE_CONFIRMED   = "template_Confirmed";
const TEMPLATE_REJECTED    = "template_rejected";

const SEMAPHORE_API_KEY    = "350c8088b0def041faee51f4be8bb7b9";
const SEMAPHORE_SENDERNAME = "HolyCross";

if (typeof emailjs !== 'undefined') emailjs.init(EMAILJS_PUBLIC_KEY);

let appointments = [];

/* ========== LOAD APPOINTMENTS + REALTIME ========== */
async function loadAppointments() {
  const { data, error } = await supabase
    .from('appointments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Load error:', error);
    alert('Failed to load appointments.');
    return;
  }

  appointments = data || [];
  renderTable();
}

/* Realtime listener */
supabase
  .channel('appointments')
  .on('postgres_changes', { event: '*', schema: 'public', table: 'appointments' }, () => {
    loadAppointments();
  })
  .subscribe();

/* Check auth on load */
window.addEventListener('load', async () => {
  const { data: { session } } = await supabase.auth.getSession();
  if (!session) {
    alert('You must be logged in as admin.');
    window.location.href = 'index.html';
  } else {
    loadAppointments();
    // Add this inside the window.load event, after getSession()
console.log("Current user:", session?.user?.email || "Not logged in");
  }
});

/* ========== RENDER TABLE ========== */
function renderTable() {
  const tbody = document.querySelector('#appointmentsTable tbody');
  const noApp = document.getElementById('noAppointments');
  if (!tbody) return;

  tbody.innerHTML = '';
  if (appointments.length === 0) {
    noApp.style.display = 'block';
    return;
  }
  noApp.style.display = 'none';

  appointments.forEach(app => {
    const tr = document.createElement('tr');
    tr.dataset.id = app.id;

    const isPending = app.status === 'pending';
    const statusBadge = isPending
      ? `<span class="badge bg-warning text-dark">Pending</span>`
      : app.status === 'confirmed'
        ? `<span class="badge bg-success">Confirmed</span>`
        : `<span class="badge bg-danger">Rejected</span>`;

    const actions = isPending
      ? `<button class="btn btn-success btn-sm confirm-btn me-1">Confirm</button>
         <button class="btn btn-danger btn-sm reject-btn">Reject</button>`
      : `<button class="btn btn-info btn-sm btn-resend">Resend</button>`;

    const img = app.validId
      ? `<img src="${app.validId}" class="img-thumbnail" style="height:60px;cursor:pointer;" onclick="showFullImage('${app.validId}')">`
      : '—';

    tr.innerHTML = `
      <td>${app.id}</td>
      <td>${app.name}</td>
      <td>${app.phone}</td>
      <td>${app.email || '—'}</td>
      <td>${app.service}</td>
      <td>${app.datetime}</td>
      <td>${app.notes || '—'}</td>
      <td>${img}</td>
      <td>${statusBadge}</td>
      <td>${actions}</td>
    `;
    tbody.appendChild(tr);
  });
}

/* ========== SEND EMAIL & SMS (unchanged) ========== */
async function sendEmail(app, status) {
  if (!app.email || !app.email.includes('@')) return false;

  const params = {
    to_name: app.name,
    to_email: app.email,
    appointment_id: app.id,
    service: app.service,
    datetime: app.datetime,
    status: status === 'confirmed' ? 'CONFIRMED' : 'REJECTED'
  };

  const templateId = status === 'confirmed' ? TEMPLATE_CONFIRMED : TEMPLATE_REJECTED;

  try {
    await emailjs.send(EMAILJS_SERVICE_ID, templateId, params);
    return true;
  } catch (err) {
    console.error("Email failed:", err);
    return false;
  }
}

async function sendSMS(phone, message) {
  let num = phone.replace(/\D/g, '');
  if (num.startsWith('0')) num = '63' + num.slice(1);
  if (!num.startsWith('63')) num = '63' + num;
  if (!/^63\d{10}$/.test(num)) return false;

  const payload = { apikey: SEMAPHORE_API_KEY, number: num, message, sendername: SEMAPHORE_SENDERNAME };

  try {
    const res = await fetch('https://api.semaphore.co/api/v4/messages', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();
    return res.ok && !data.error;
  } catch (err) {
    console.error(err);
    return false;
  }
}

async function resendNotification(app) {
  const statusText = app.status === 'confirmed' ? "CONFIRMED" : "REJECTED";
  const message = `Holy Cross Parish\n\nAppointment #${app.id}\nService: ${app.service}\nDate & Time: ${app.datetime}\nStatus: ${statusText}!\n\nThank you and God bless you!`;

  const [emailOk, smsOk] = await Promise.all([
    sendEmail(app, app.status),
    sendSMS(app.phone, message)
  ]);

  showToast(
    `Notification Sent! ` + 
    (emailOk && smsOk ? "Email + SMS" : emailOk ? "Email only" : smsOk ? "SMS only" : "Failed"),
    emailOk || smsOk
  );
}

function showToast(msg, success = true) {
  const t = document.createElement('div');
  t.textContent = msg;
  t.style.cssText = `position:fixed;bottom:20px;right:20px;padding:16px 28px;background:${success?'#28a745':'#dc3545'};color:white;border-radius:10px;z-index:9999;font-weight:bold;box-shadow:0 6px 20px rgba(0,0,0,0.3);`;
  document.body.appendChild(t);
  setTimeout(() => t.remove(), 5000);
}

/* ========== BUTTON ACTIONS ========== */
document.addEventListener('click', async e => {
  const btn = e.target.closest('button');
  if (!btn) return;

  const row = btn.closest('tr');
  const id = Number(row.dataset.id);
  const app = appointments.find(a => a.id === id);
  if (!app) return;

  if (btn.classList.contains('confirm-btn')) {
    await supabase.from('appointments').update({ status: 'confirmed' }).eq('id', id);
    app.status = 'confirmed';
    renderTable();
    await resendNotification(app);

  } else if (btn.classList.contains('reject-btn')) {
    await supabase.from('appointments').update({ status: 'rejected' }).eq('id', id);
    app.status = 'rejected';
    renderTable();
    await resendNotification(app);

  } else if (btn.classList.contains('btn-resend')) {
    await resendNotification(app);
  }
});

/* ========== LOGOUT ========== */
document.getElementById('adminLogout')?.addEventListener('click', async () => {
  await supabase.auth.signOut();
  window.location.href = 'index.html';
});

/* ========== FULL IMAGE MODAL ========== */
function showFullImage(src) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered modal-lg">
      <div class="modal-content">
        <div class="modal-body text-center">
          <img src="${src}" class="img-fluid" style="max-height:85vh;">
        </div>
      </div>
    </div>`;
  document.body.appendChild(modal);
  new bootstrap.Modal(modal).show();
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}
window.showFullImage = showFullImage;