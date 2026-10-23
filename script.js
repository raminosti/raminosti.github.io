const $ = (s, root=document) => root.querySelector(s);
const $$ = (s, root=document) => [...root.querySelectorAll(s)];

$('#year').textContent = new Date().getFullYear();

// Mobile navigation
const menuToggle = $('#menuToggle');
const navLinks = $('#navLinks');
menuToggle.addEventListener('click', () => {
  const open = navLinks.classList.toggle('open');
  menuToggle.setAttribute('aria-expanded', String(open));
  menuToggle.setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
});
$$('#navLinks a').forEach(a => a.addEventListener('click', () => {
  navLinks.classList.remove('open');
  menuToggle.setAttribute('aria-expanded', 'false');
}));

// Theme toggle, persisted for the current browser session only.
const themeToggle = $('#themeToggle');
themeToggle.addEventListener('click', () => {
  document.body.classList.toggle('light');
  themeToggle.textContent = document.body.classList.contains('light') ? '☼' : '◐';
});

// Experience rows: concise overview by default; toggle details.
$$('.experience-card').forEach(card => {
  const toggle = $('.exp-toggle', card);
  const list = $('ul', card);
  if (!list) return;
  list.dataset.originalDisplay = 'block';
  toggle.addEventListener('click', () => {
    const expanded = card.classList.toggle('expanded');
    toggle.setAttribute('aria-expanded', String(expanded));
    list.style.display = expanded ? 'block' : 'none';
    toggle.textContent = expanded ? '×' : '↗';
  });
  // Show first role details, keep other rows compact until requested.
  if (!card.classList.contains('experience-card:first-child')) {
    list.style.display = 'none';
  }
});
// The first role starts open.
const firstExperience = $('.experience-card');
if (firstExperience) {
  firstExperience.classList.add('expanded');
  $('.exp-toggle', firstExperience).setAttribute('aria-expanded', 'true');
  $('.exp-toggle', firstExperience).textContent = '×';
}

// Skills panel
const skillData = {
  engineering: {
    title: 'Engineering & analysis',
    desc: 'Core civil and structural engineering knowledge developed through academic training and field experience.',
    count: '01 / 04',
    label: 'FOUNDATION',
    end: 'APPLIED ENGINEERING',
    skills: ['Structural Analysis','Reinforced Concrete','Seismic Analysis','Infrastructure Risk','Site Supervision','Quality & Safety','Roads & Bridges','Cost Estimation']
  },
  digital: {
    title: 'Digital engineering & BIM',
    desc: 'Design, modelling, drafting, and visualization tools used across engineering and construction work.',
    count: '02 / 04',
    label: 'MODELLING',
    end: 'DIGITAL WORKFLOWS',
    skills: ['AutoCAD','Civil 3D','Revit','Dynamo','Lumion','SketchUp','BIM Integration','Digital Twin Research']
  },
  ai: {
    title: 'AI & data-driven research',
    desc: 'Research interests and technical foundations for exploring data-assisted infrastructure inspection.',
    count: '03 / 04',
    label: 'RESEARCH FOCUS',
    end: 'INTELLIGENT INFRASTRUCTURE',
    skills: ['Python','Convolutional Neural Networks','AI-based Bridge Inspection','Computer Vision Research','Data Integration','Structural Health Monitoring','Thermal Imaging Research','Multimodal Data Fusion']
  },
  management: {
    title: 'Project delivery & planning',
    desc: 'Practical methods and tools supporting construction coordination, supervision, cost planning, and project delivery.',
    count: '04 / 04',
    label: 'FIELD PRACTICE',
    end: 'PROJECT DELIVERY',
    skills: ['MS Project','Primavera P6','Construction Supervision','Cost Estimation','Quality & Safety','Procurement','Site Assessment','Risk Evaluation']
  }
};
$$('.skill-tab').forEach(tab => tab.addEventListener('click', () => {
  $$('.skill-tab').forEach(t => { t.classList.remove('active'); t.setAttribute('aria-selected','false'); });
  tab.classList.add('active'); tab.setAttribute('aria-selected','true');
  const d = skillData[tab.dataset.skill];
  $('#skillPanel').innerHTML = `<div class="skill-panel-head"><span class="mono">CAPABILITY MAP</span><span class="skill-counter">${d.count}</span></div><h3>${d.title}</h3><p>${d.desc}</p><div class="skill-pills">${d.skills.map(s => `<span>${s}</span>`).join('')}</div><div class="skill-foot"><span class="mono">${d.label}</span><span class="skill-line"></span><span class="mono">${d.end}</span></div>`;
}));

// Project concept modal
const concepts = {
  ai: {
    title: 'AI bridge inspection assistant',
    desc: 'A proposed workflow for organizing bridge inspection imagery and helping engineers identify observations that may need closer review. A real implementation would require suitable data, transparent evaluation, and expert oversight.',
    steps: ['Collect and document suitable bridge imagery with clear provenance.','Prepare a repeatable image-processing and annotation workflow.','Evaluate candidate computer-vision methods against labelled examples.','Present candidate observations for engineer review—not as automatic certification.'],
    tags: ['Python','Computer Vision','Image Annotation','Inspection Data']
  },
  twin: {
    title: 'Digital twin for structural monitoring',
    desc: 'A proposed model linking a bridge asset representation with component information, inspection records, and sensor data where available. The first version could use simulated data to demonstrate the information flow.',
    steps: ['Define asset components and a consistent data structure.','Create or import a simplified 3D/BIM representation.','Connect example inspection observations and sensor readings.','Visualize changes over time and record data sources and limitations.'],
    tags: ['BIM','Revit','Dynamo','Python','Asset Data']
  },
  risk: {
    title: 'Infrastructure risk dashboard',
    desc: 'A proposed decision-support interface for reviewing condition indicators, inspection findings, and maintenance priorities. Any scoring method must be explicit, validated for its intended use, and reviewed by qualified professionals.',
    steps: ['Define indicators and document their sources and assumptions.','Create a transparent method for comparing condition and risk factors.','Build a dashboard using clearly labelled illustrative or verified data.','Test the presentation with engineers and document limitations.'],
    tags: ['Python','Data Visualization','Reliability','Risk Assessment']
  }
};
const modal = $('#projectModal');
function openModal(key) {
  const d = concepts[key];
  if (!d) return;
  $('#modalTitle').textContent = d.title;
  $('#modalDescription').textContent = d.desc;
  $('#modalSteps').innerHTML = d.steps.map(s => `<li>${s}</li>`).join('');
  $('#modalTags').innerHTML = d.tags.map(s => `<span>${s}</span>`).join('');
  modal.classList.add('open');
  modal.setAttribute('aria-hidden','false');
  document.body.style.overflow = 'hidden';
  $('.modal-close').focus();
}
function closeModal() {
  modal.classList.remove('open');
  modal.setAttribute('aria-hidden','true');
  document.body.style.overflow = '';
}
$$('[data-project]').forEach(btn => btn.addEventListener('click', () => openModal(btn.dataset.project)));
$$('[data-close-modal]').forEach(el => el.addEventListener('click', closeModal));
document.addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

// Contact form: opens a prefilled email draft; no server or data storage.
$('#contactForm').addEventListener('submit', e => {
  e.preventDefault();
  const data = new FormData(e.currentTarget);
  const name = String(data.get('name') || '').trim();
  const email = String(data.get('email') || '').trim();
  const topic = String(data.get('topic') || 'Other').trim();
  const message = String(data.get('message') || '').trim();
  const subject = encodeURIComponent(`${topic} — website contact from ${name}`);
  const body = encodeURIComponent(`Hello Ramin,\n\n${message}\n\nBest regards,\n${name}\n${email}`);
  $('#formMessage').textContent = 'Opening your email application with a prepared message…';
  window.location.href = `mailto:ramin.osti@gmail.com?subject=${subject}&body=${body}`;
});

// Scroll reveal and active nav
const revealTargets = $$('.section, .experience-card, .research-card, .project-card, .featured-research, .contact-card');
revealTargets.forEach(el => el.classList.add('reveal'));
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  revealTargets.forEach(el => observer.observe(el));
} else {
  revealTargets.forEach(el => el.classList.add('visible'));
}
const sectionIds = ['about','experience','research','projects','skills','contact'];
const navObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      $$('#navLinks a').forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${entry.target.id}`));
    }
  });
}, { rootMargin: '-25% 0px -65% 0px' });
sectionIds.forEach(id => { const el = document.getElementById(id); if (el) navObserver.observe(el); });
