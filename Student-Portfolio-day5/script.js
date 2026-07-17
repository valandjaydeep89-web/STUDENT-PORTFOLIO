// Mobile tab-menu toggle
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navLinks.classList.toggle('open');
});
document.querySelectorAll('.tab').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    navLinks.classList.remove('open');
  });
});

// Scroll reveal
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('active');
  });
}, { threshold: 0.15 });
revealEls.forEach(el => revealObserver.observe(el));

// Animate skill bars into view
const bars = document.querySelectorAll('.bar-fill');
const barObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const bar = entry.target;
      bar.style.width = bar.dataset.width + '%';
      barObserver.unobserve(bar);
    }
  });
}, { threshold: 0.4 });
bars.forEach(bar => barObserver.observe(bar));

// Active tab highlighting based on scroll position
const sections = document.querySelectorAll('section[id]');
const tabAnchors = document.querySelectorAll('.tab');
const spyObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      tabAnchors.forEach(a => a.classList.remove('active-tab'));
      const activeTab = document.querySelector(`.tab[href="#${entry.target.id}"]`);
      if (activeTab) activeTab.classList.add('active-tab');
    }
  });
}, { rootMargin: '-40% 0px -50% 0px' });
sections.forEach(section => spyObserver.observe(section));

// Back to top
const backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', () => {
  if (window.scrollY > 400) backToTop.classList.add('show');
  else backToTop.classList.remove('show');
});
backToTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Line-number gutter — fills the left rail with numbers for the page's scroll height
const gutterInner = document.getElementById('gutterInner');
function buildGutter(){
  const lineHeight = 22; // px, matches gutter-inner line-height at 11px font
  const total = Math.ceil(document.body.scrollHeight / lineHeight);
  let html = '';
  for (let i = 1; i <= total; i++) html += i + '\n';
  gutterInner.textContent = html;
}
window.addEventListener('load', buildGutter);
window.addEventListener('resize', buildGutter);

// Typed hero code snippet
const typedEl = document.getElementById('typedCode');
const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const codeLines = [
  { text: 'const developer = {', tokens: [['const ', 'tok-kw'], ['developer', 'tok-key'], [' = {', 'tok-punc']] },
  { text: '  name: "Jaydip Valand",', tokens: [['  name', 'tok-key'], [': ', 'tok-punc'], ['"Jaydip Valand"', 'tok-str'], [',', 'tok-punc']] },
  { text: '  role: "Frontend Developer",', tokens: [['  role', 'tok-key'], [': ', 'tok-punc'], ['"Frontend Developer"', 'tok-str'], [',', 'tok-punc']] },
  { text: '  status: "available_for_projects",', tokens: [['  status', 'tok-key'], [': ', 'tok-punc'], ['"available_for_projects"', 'tok-str'], [',', 'tok-punc']] },
  { text: '  learning: ["HTML", "CSS", "JS"],', tokens: [['  learning', 'tok-key'], [': [', 'tok-punc'], ['"HTML"', 'tok-str'], [', ', 'tok-punc'], ['"CSS"', 'tok-str'], [', ', 'tok-punc'], ['"JS"', 'tok-str'], ['],', 'tok-punc']] },
  { text: '};', tokens: [['};', 'tok-punc']] },
];

function renderStaticCode(){
  typedEl.innerHTML = '';
  codeLines.forEach(line => {
    const div = document.createElement('div');
    line.tokens.forEach(([text, cls]) => {
      const span = document.createElement('span');
      span.className = cls;
      span.textContent = text;
      div.appendChild(span);
    });
    typedEl.appendChild(div);
  });
}

function typeCode(){
  typedEl.innerHTML = '';
  let lineIndex = 0;

  function typeNextLine(){
    if (lineIndex >= codeLines.length) {
      const cursor = document.createElement('span');
      cursor.className = 'type-cursor';
      typedEl.appendChild(cursor);
      return;
    }
    const line = codeLines[lineIndex];
    const div = document.createElement('div');
    typedEl.appendChild(div);
    let tokenIndex = 0;

    function typeNextToken(){
      if (tokenIndex >= line.tokens.length) {
        lineIndex++;
        setTimeout(typeNextLine, 90);
        return;
      }
      const [text, cls] = line.tokens[tokenIndex];
      const span = document.createElement('span');
      span.className = cls;
      div.appendChild(span);
      let charIndex = 0;

      function typeChar(){
        if (charIndex >= text.length) {
          tokenIndex++;
          typeNextToken();
          return;
        }
        span.textContent += text[charIndex];
        charIndex++;
        setTimeout(typeChar, 14);
      }
      typeChar();
    }
    typeNextToken();
  }
  typeNextLine();
}

if (reduceMotion) {
  renderStaticCode();
} else {
  typeCode();
}