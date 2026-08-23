const navbar = document.getElementById('navbar');
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
const scrollProgress = document.getElementById('scrollProgress');
const typedText = document.getElementById('typedText');
const TYPED_STRING = 'Software Engineering Undergraduate';

document.querySelectorAll('.animate-hero').forEach(el => {
  el.style.setProperty('--delay', el.dataset.delay || '0');
});

document.querySelectorAll('[data-stagger]').forEach(el => {
  el.style.setProperty('--stagger', el.dataset.stagger);
});

window.addEventListener('load', () => {
  document.body.classList.add('loaded');
  startTyping();
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);

  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  scrollProgress.style.width = `${progress}%`;

  updateActiveNav();
});

navToggle.addEventListener('click', () => {
  navToggle.classList.toggle('active');
  navLinks.classList.toggle('active');
});

navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    navLinks.classList.remove('active');
    navToggle.classList.remove('active');
  });
});

const revealObserver = new IntersectionObserver(
  entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -50px 0px' }
);

document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

const timeline = document.querySelector('.timeline');
if (timeline) revealObserver.observe(timeline);

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    e.preventDefault();
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) target.scrollIntoView({ behavior: 'smooth' });
  });
});

function updateActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const scrollPos = window.scrollY + 120;

  sections.forEach(section => {
    const id = section.getAttribute('id');
    const top = section.offsetTop;
    const height = section.offsetHeight;
    const link = document.querySelector(`.nav-links a[data-section="${id}"]`);

    if (link) {
      link.classList.toggle('active', scrollPos >= top && scrollPos < top + height);
    }
  });
}

function startTyping() {
  if (!typedText || window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    if (typedText) typedText.textContent = TYPED_STRING;
    return;
  }

  let i = 0;
  const speed = 45;

  function type() {
    if (i <= TYPED_STRING.length) {
      typedText.textContent = TYPED_STRING.slice(0, i);
      i++;
      setTimeout(type, speed);
    }
  }

  setTimeout(type, 900);
}

const heroImage = document.querySelector('.hero-image');
if (heroImage && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  const wrapper = document.querySelector('.hero-image-wrapper');

  wrapper.addEventListener('mousemove', e => {
    const rect = wrapper.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
    const y = (e.clientY - rect.top - rect.height / 2) / rect.height;
    heroImage.style.transform = `scale(1.02) perspective(800px) rotateY(${x * 5}deg) rotateX(${-y * 5}deg)`;
  });

  wrapper.addEventListener('mouseleave', () => {
    heroImage.style.transform = '';
  });
}
