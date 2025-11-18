/* ========== SUPABASE CONFIG ========== */
const SUPABASE_URL = 'https://hwsrzedradgvmqyqamap.supabase.co';        // ← CHANGE THIS
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3c3J6ZWRyYWRndm1xeXFhbWFwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjM0NDQ1NjgsImV4cCI6MjA3OTAyMDU2OH0.MtiTUTHjCiIDTVasEV7Gks7K8uodpkYDfjhCjGC-iIA'; // ← CHANGE THIS

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/* ========== VALID ID FILE HANDLER (unchanged) ========== */
(function () {
  const form = document.getElementById('appointmentForm');
  const fileInput = document.getElementById('validId');
  const errorEl = document.getElementById('validIdError');
  const previewWrap = document.getElementById('validIdPreviewWrap');
  const previewImg = document.getElementById('validIdPreview');

  if (!form || !fileInput || !errorEl || !previewWrap || !previewImg) {
    console.error('Form or file input elements not found');
    return;
  }

  const MAX_BYTES = 5 * 1024 * 1024; // 5 MB
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

  function clearError() {
    errorEl.textContent = '';
    fileInput.classList.remove('is-invalid');
  }

  function showError(msg) {
    errorEl.textContent = msg;
    fileInput.classList.add('is-invalid');
  }

  function updatePreview(file) {
    if (!file || !file.type.startsWith('image/')) {
      previewWrap.style.display = 'none';
      previewImg.src = '';
      return;
    }
    const reader = new FileReader();
    reader.onload = e => {
      previewImg.src = e.target.result;
      previewWrap.style.display = 'block';
    };
    reader.readAsDataURL(file);
  }

  fileInput.addEventListener('change', () => {
    clearError();
    const file = fileInput.files?.[0];
    if (!file) {
      previewWrap.style.display = 'none';
      return;
    }

    if (file.size > MAX_BYTES) {
      showError('File is too large. Please upload an image up to 5 MB.');
      fileInput.value = '';
      previewWrap.style.display = 'none';
      return;
    }

    if (!allowedTypes.includes(file.type) && !file.type.startsWith('image/')) {
      showError('Unsupported file type. Please upload JPG, PNG, WebP, or HEIC.');
      fileInput.value = '';
      previewWrap.style.display = 'none';
      return;
    }

    updatePreview(file);
  });

  form.addEventListener('submit', (e) => {
    clearError();
    if (!form.checkValidity()) {
      e.preventDefault();
      e.stopPropagation();
      form.classList.add('was-validated');
      return;
    }

    const file = fileInput.files?.[0];
    if (!file) {
      e.preventDefault();
      showError('Please upload a photo of your valid ID.');
      return;
    }
    if (file.size > MAX_BYTES) {
      e.preventDefault();
      showError('File is too large. Please upload an image up to 5 MB.');
      return;
    }
  });
})();

/* ========== APPOINTMENT FORM SUBMIT (Supabase) ========== */
const appointmentForm = document.getElementById('appointmentForm');
if (appointmentForm) {
  appointmentForm.addEventListener('submit', function (e) {
    e.preventDefault();
    const fd = new FormData(this);
    const fileInput = document.getElementById('validId');
    const file = fileInput.files?.[0];

    if (!file) {
      alert('Please upload a valid ID.');
      return;
    }

    const reader = new FileReader();
    reader.onload = async function (event) {
      const base64Image = event.target.result;

      const appointmentData = {
        name: fd.get('name').trim(),
        phone: fd.get('phone').trim(),
        email: fd.get('email').trim() || null,
        service: fd.get('service'),
        datetime: `${fd.get('date')} ${fd.get('time')}`,
        notes: fd.get('notes').trim() || null,
        validId: base64Image,
        status: 'pending'
      };

      const { error } = await supabase
        .from('appointments')
        .insert(appointmentData);

      if (error) {
        console.error('Supabase insert error:', error);
        alert('Submission failed. Please try again later.');
      } else {
        alert('Appointment request sent! The parish admin will review it shortly.');
        bootstrap.Modal.getInstance(document.getElementById('appointmentModal')).hide();
        appointmentForm.reset();
        document.getElementById('validIdPreviewWrap').style.display = 'none';
      }
    };

    reader.readAsDataURL(file);
  });
}

/* ========== FULL IMAGE MODAL ========== */
function showFullImage(base64Image) {
  const modal = document.createElement('div');
  modal.className = 'modal fade';
  modal.innerHTML = `
    <div class="modal-dialog modal-dialog-centered">
      <div class="modal-content">
        <div class="modal-header">
          <h5 class="modal-title">Valid ID</h5>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body text-center">
          <img src="${base64Image}" alt="Valid ID" class="img-fluid" style="max-height: 80vh; object-fit: contain;">
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);
  const bsModal = new bootstrap.Modal(modal);
  bsModal.show();
  modal.addEventListener('hidden.bs.modal', () => modal.remove());
}
window.showFullImage = showFullImage;

/* ========== ADMIN LOGIN (Supabase Auth) ========== */
const adminLoginForm = document.getElementById('adminLoginForm');
const loginError = document.getElementById('loginError');

if (adminLoginForm && loginError) {
  adminLoginForm.addEventListener('submit', async function (e) {
    e.preventDefault();

    const email = document.getElementById('adminEmail')?.value.trim() || document.getElementById('adminUsername')?.value.trim();
    const password = document.getElementById('adminPassword').value;

    if (!email || !password) {
      loginError.textContent = 'Please fill in both fields.';
      loginError.style.display = 'block';
      return;
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password
    });

    if (error) {
      loginError.textContent = 'Invalid email or password.';
      loginError.style.display = 'block';
    } else {
      window.location.href = 'admin.html';
    }
  });
}