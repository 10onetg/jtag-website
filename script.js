document.getElementById('year').textContent = new Date().getFullYear();

const navToggle = document.getElementById('navToggle');
const nav = document.getElementById('nav');

navToggle.addEventListener('click', () => {
  nav.classList.toggle('open');
});

nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => nav.classList.remove('open'));
});

const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (!reduceMotion && 'IntersectionObserver' in window) {
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in-view');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));
} else {
  document.querySelectorAll('.reveal').forEach(el => el.classList.add('in-view'));
}

const openQuoteModal = document.getElementById('openQuoteModal');
const closeQuoteModal = document.getElementById('closeQuoteModal');
const quoteModalOverlay = document.getElementById('quoteModalOverlay');

function openModal() {
  quoteModalOverlay.hidden = false;
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  quoteModalOverlay.hidden = true;
  document.body.style.overflow = '';
}

if (openQuoteModal && quoteModalOverlay) {
  openQuoteModal.addEventListener('click', openModal);
  closeQuoteModal.addEventListener('click', closeModal);
  quoteModalOverlay.addEventListener('click', (e) => {
    if (e.target === quoteModalOverlay) closeModal();
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !quoteModalOverlay.hidden) closeModal();
  });
}

const quoteForm = document.getElementById('quoteForm');
const formStatus = document.getElementById('formStatus');

if (quoteForm) {
  quoteForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = quoteForm.querySelector('button[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = '送信中…';

    try {
      const response = await fetch(quoteForm.action, {
        method: 'POST',
        body: new FormData(quoteForm),
        headers: { Accept: 'application/json' }
      });

      if (response.ok) {
        quoteForm.reset();
        formStatus.textContent = 'お問い合わせを送信しました。ありがとうございます。折り返しご連絡いたします。';
        formStatus.className = 'form-status success';
      } else {
        throw new Error('送信に失敗しました');
      }
    } catch (err) {
      formStatus.textContent = '送信に失敗しました。お手数ですが info.jtag@gmail.com まで直接メールをお送りください。';
      formStatus.className = 'form-status error';
    } finally {
      formStatus.hidden = false;
      submitBtn.disabled = false;
      submitBtn.textContent = '送信する';
    }
  });
}
