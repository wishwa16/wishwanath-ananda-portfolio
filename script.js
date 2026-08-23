const header = document.getElementById('header');
const nav = document.querySelector('.nav');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const scrollProgress = document.getElementById('scrollProgress');
const backTop = document.getElementById('backTop');
const themeToggle = document.getElementById('themeToggle');
const typedRoles = document.getElementById('typedRoles');
const contactForm = document.getElementById('contactForm');

const ROLES = [
  'Software Engineer',
  'Flutter Developer',
  'Full-Stack Developer',
  'IoT Enthusiast'
];

document.querySelectorAll('[data-stagger]').forEach(el => {
  el.style.setProperty('--stagger', el.dataset.stagger);
});

/* Scroll */
window.addEventListener('scroll', () => {
  const y = window.scrollY;
  nav.classList.toggle('scrolled', y > 40);
  backTop.classList.toggle('visible', y > 400);

  const docH = document.documentElement.scrollHeight - window.innerHeight;
  scrollProgress.style.width = docH > 0 ? `${(y / docH) * 100}%` : '0%';

  updateActiveNav();
});

/* Nav toggle */
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('open');
});

navLinks.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => navLinks.classList.remove('open'));
});

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const target = document.querySelector(a.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});

/* Active nav */
function updateActiveNav() {
  const scrollPos = window.scrollY + 120;
  document.querySelectorAll('section[id]').forEach(sec => {
    const link = document.querySelector(`.nav-links a[data-section="${sec.id}"]`);
    if (!link) return;
    const top = sec.offsetTop;
    const h = sec.offsetHeight;
    link.classList.toggle('active', scrollPos >= top && scrollPos < top + h);
  });
}

/* Reveal on scroll */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      e.target.querySelectorAll('[data-count]').forEach(el => animateCount(el));
    }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll('.reveal').forEach(el => revealObs.observe(el));

/* Typing animation */
let roleIdx = 0;
let charIdx = 0;
let deleting = false;

function typeRoles() {
  if (!typedRoles) return;
  const current = ROLES[roleIdx];

  if (!deleting) {
    typedRoles.textContent = current.slice(0, charIdx + 1);
    charIdx++;
    if (charIdx === current.length) {
      deleting = true;
      setTimeout(typeRoles, 2000);
      return;
    }
  } else {
    typedRoles.textContent = current.slice(0, charIdx - 1);
    charIdx--;
    if (charIdx === 0) {
      deleting = false;
      roleIdx = (roleIdx + 1) % ROLES.length;
    }
  }
  setTimeout(typeRoles, deleting ? 40 : 80);
}

window.addEventListener('load', () => {
  setTimeout(typeRoles, 600);
  document.querySelectorAll('.hero .reveal').forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), 200 + i * 120);
  });
});

/* Counter animation */
function animateCount(el) {
  if (el.dataset.animated) return;
  const target = parseInt(el.dataset.count, 10);
  if (isNaN(target)) return;
  el.dataset.animated = 'true';
  let current = 0;
  const step = Math.ceil(target / 30);
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      el.textContent = target + '+';
      clearInterval(timer);
    } else {
      el.textContent = current;
    }
  }, 40);
}

/* Theme toggle */
const savedTheme = localStorage.getItem('theme');
if (savedTheme) {
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeToggle.textContent = savedTheme === 'light' ? '🌙' : '☀';
}

themeToggle.addEventListener('click', () => {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  const next = isLight ? 'dark' : 'light';
  if (next === 'dark') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', 'light');
  }
  localStorage.setItem('theme', next);
  themeToggle.textContent = next === 'light' ? '🌙' : '☀';
});

/* Contact form */
contactForm.addEventListener('submit', e => {
  e.preventDefault();
  const fd = new FormData(e.target);
  const name = fd.get('name');
  const email = fd.get('email');
  const subject = fd.get('subject') || 'Portfolio Contact';
  const message = fd.get('message');
  const body = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\n${message}`);
  window.location.href = `mailto:wishwa16ananda@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;
});

/* Photo parallax */
const photoFrame = document.querySelector('.photo-frame');
if (photoFrame && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  document.addEventListener('mousemove', e => {
    const x = (e.clientX / window.innerWidth - 0.5) * 8;
    const y = (e.clientY / window.innerHeight - 0.5) * 8;
    photoFrame.style.transform = `perspective(800px) rotateY(${x}deg) rotateX(${-y}deg)`;
  });
  document.addEventListener('mouseleave', () => {
    photoFrame.style.transform = '';
  });
}
