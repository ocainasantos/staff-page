// ── HAMBURGER MENU ──────────────────────────────────────────────
const hamburger = document.getElementById('hamburger');
const navLinks  = document.getElementById('nav-links');

hamburger.addEventListener('click', function() {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});

// Fecha ao clicar num link
navLinks.querySelectorAll('a').forEach(function(link) {
  link.addEventListener('click', function() {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Fecha ao clicar fora
document.addEventListener('click', function(e) {
  if (!e.target.closest('nav')) {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  }
});

// ── SEÇÃO ATIVA (scroll-based) ────────────────────────────────────
var sections = document.querySelectorAll('section[id]');
var navItems = document.querySelectorAll('.nav-links a[href^="#"]');

function updateActiveNav() {
  var scrollY = window.scrollY + 120; // offset da nav fixa
  var current = '';

  sections.forEach(function(section) {
    if (section.offsetTop <= scrollY) {
      current = section.id;
    }
  });

  navItems.forEach(function(a) {
    a.classList.remove('active');
    if (a.getAttribute('href') === '#' + current) {
      a.classList.add('active');
    }
  });
}

window.addEventListener('scroll', updateActiveNav, { passive: true });
updateActiveNav();

// ── BOTÃO VOLTAR AO TOPO ─────────────────────────────────────────
var backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', function() {
  if (window.scrollY > 500) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});

backToTop.addEventListener('click', function() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
