// RealAdaptivity — script.js

// Navbar scroll effect
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
});

// Hamburger / mobile menu
const hamburger = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  mobileMenu.classList.toggle('open');
  document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
});

document.querySelectorAll('.mobile-link').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  });
});

// Scroll-triggered fade-in
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

document.querySelectorAll(
  '.service-card, .why-card, .process-step, .about-text, .about-visual, .portfolio-card'
).forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(24px)';
  el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
  observer.observe(el);
});

// Stagger cards
document.querySelectorAll('.service-card, .why-card').forEach((el, i) => {
  el.style.transitionDelay = `${(i % 3) * 80}ms`;
});

// Nhost config
const NHOST_GRAPHQL_URL =
  'https://vkqjlqnxtlgpmyqtirwk.hasura.us-east-1.nhost.run/v1/graphql';

const INSERT_SUBMISSION = `
  mutation InsertContactSubmission(
    $name: String!
    $email: String!
    $project_type: String
    $message: String!
  ) {
    insert_contact_submissions_one(object: {
      name: $name
      email: $email
      project_type: $project_type
      message: $message
    }) {
      id
    }
  }
`;

// Contact form — Nhost handler
const form = document.getElementById('contactForm');
form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const btn = form.querySelector('button[type="submit"]');
  btn.textContent = 'Sending...';
  btn.disabled = true;

  const variables = {
    name:         form.name.value.trim(),
    email:        form.email.value.trim(),
    project_type: form.project.value || null,
    message:      form.message.value.trim(),
  };

  try {
    const res = await fetch(NHOST_GRAPHQL_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ query: INSERT_SUBMISSION, variables }),
    });

    const { data, errors } = await res.json();

    if (errors && errors.length) throw new Error(errors[0].message);

    form.innerHTML = `
      <div class="form-success">
        <h3>Message Sent!</h3>
        <p>Thanks for reaching out. We'll get back to you within 24 hours.</p>
      </div>
    `;
  } catch (err) {
    btn.textContent = 'Send Message';
    btn.disabled = false;
    const errEl = form.querySelector('.form-error') || document.createElement('p');
    errEl.className = 'form-error';
    errEl.textContent = 'Something went wrong — please try again or email us directly.';
    if (!form.querySelector('.form-error')) btn.insertAdjacentElement('afterend', errEl);
  }
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', (e) => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});
