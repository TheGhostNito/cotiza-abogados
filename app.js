const services = [
  {
    title: 'Derecho de familia',
    description: 'Divorcio, pensión de alimentos y acuerdos de cuidado personal.',
    keywords: 'separación tuición custodia visitas matrimonio',
    icon: 'family',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Derecho laboral',
    description: 'Despidos, finiquitos y conflictos en el trabajo.',
    keywords: 'empleo contratos remuneraciones sueldo',
    icon: 'briefcase',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Derecho civil',
    description: 'Contratos, herencias, deudas e indemnizaciones.',
    keywords: 'testamento sucesión demanda acuerdos',
    icon: 'file',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Derecho inmobiliario',
    description: 'Compraventa, arriendos y conflictos sobre propiedades.',
    keywords: 'arrendamiento vivienda casa departamento contratos',
    icon: 'home',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Derecho comercial',
    description: 'Constitución de empresas, sociedades y contratos comerciales.',
    keywords: 'negocio emprendimiento empresa societario',
    icon: 'building',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Derecho migratorio',
    description: 'Residencia, visas y trámites de nacionalidad.',
    keywords: 'migración extranjería permanencia',
    icon: 'globe',
    modes: ['online', 'presencial'],
  },
];

const lawyers = [
  {
    title: 'Camila Rojas',
    description: 'Derecho de familia y derecho civil',
    keywords: 'divorcio alimentos custodia herencias deudas',
    icon: 'user',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Nicolás Herrera',
    description: 'Derecho laboral y derecho comercial',
    keywords: 'despido finiquito trabajo empresa sociedades contratos',
    icon: 'user',
    modes: ['online'],
  },
  {
    title: 'Valentina Soto',
    description: 'Derecho inmobiliario y derecho migratorio',
    keywords: 'arriendo compraventa propiedades visas residencia extranjería',
    icon: 'user',
    modes: ['presencial'],
  },
];

const modeNames = { online: 'En línea', presencial: 'Presencial' };
const directories = {
  services: {
    entries: services,
    title: 'Explora por especialidad',
    description: 'Encuentra el área que mejor se ajusta a tu consulta.',
    singular: 'especialidad',
    plural: 'especialidades',
  },
  lawyers: {
    entries: lawyers,
    title: 'Explora perfiles de abogados',
    description: 'Encuentra perfiles por nombre, especialidad o modalidad.',
    singular: 'perfil',
    plural: 'perfiles',
  },
};

const searchForm = document.querySelector('#search-form');
const searchInput = document.querySelector('#search-query');
const searchMode = document.querySelector('#search-mode');
const directory = document.querySelector('#explorar');
const directoryGrid = document.querySelector('#directory-grid');
const directoryButtons = document.querySelectorAll('[data-directory]');
const filterSummary = document.querySelector('#filter-summary');
const searchStatus = document.querySelector('#search-status');
const clearSearch = document.querySelector('#clear-search');

let activeDirectory = 'services';
let activeQuery = '';
let activeMode = '';

function normalizeSearch(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es-CL');
}

function findEntries(view) {
  const terms = normalizeSearch(activeQuery).split(/\s+/).filter(Boolean);
  return directories[view].entries.filter((entry) => {
    const searchable = normalizeSearch(`${entry.title} ${entry.description} ${entry.keywords}`);
    return (!activeMode || entry.modes.includes(activeMode)) && terms.every((term) => searchable.includes(term));
  });
}

function createIcon(name) {
  const namespace = 'http://www.w3.org/2000/svg';
  const icon = document.createElementNS(namespace, 'svg');
  const use = document.createElementNS(namespace, 'use');
  icon.setAttribute('class', 'icon');
  icon.setAttribute('aria-hidden', 'true');
  use.setAttribute('href', `#icon-${name}`);
  icon.append(use);
  return icon;
}

function createCard(entry, isLawyer) {
  const card = document.createElement('article');
  card.className = 'service-card';

  const icon = document.createElement('span');
  icon.className = 'card-icon';
  icon.append(createIcon(entry.icon));

  const title = document.createElement('h3');
  title.textContent = entry.title;

  const description = document.createElement('p');
  description.textContent = entry.description;
  card.append(icon, title, description);

  if (isLawyer) {
    const tag = document.createElement('p');
    tag.className = 'card-tag';
    tag.textContent = `Perfil de ejemplo · ${entry.modes.map((mode) => modeNames[mode]).join(' y ')}`;
    card.append(tag);
  }

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-action text-button';
  button.setAttribute('aria-label', `Solicitar cotización: ${entry.title}`);
  button.append('Solicitar cotización', createIcon('up-right'));
  button.addEventListener('click', () => openQuote(entry, isLawyer));
  card.append(button);

  return card;
}

function renderDirectory() {
  const view = directories[activeDirectory];
  const isLawyer = activeDirectory === 'lawyers';
  const entries = findEntries(activeDirectory);
  const isFiltered = Boolean(activeQuery || activeMode);

  directory.querySelector('#directory-title').textContent = view.title;
  directory.querySelector('.directory-head p').textContent = view.description;
  directory.querySelector('#directory-note').hidden = !isLawyer || entries.length === 0;
  directoryButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.directory === activeDirectory));
  });

  filterSummary.hidden = !isFiltered;
  const resultCount = `${entries.length} ${entries.length === 1 ? view.singular : view.plural}`;
  const querySummary = activeQuery ? ` para «${activeQuery}»` : '';
  const modeSummary = activeMode ? ` · ${modeNames[activeMode]}` : '';
  searchStatus.textContent = isFiltered ? `${resultCount}${querySummary}${modeSummary}` : '';

  directoryGrid.replaceChildren(...entries.map((entry) => createCard(entry, isLawyer)));
  if (entries.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-state';
    empty.textContent = 'Prueba con otro término, cambia la modalidad o revisa la otra vista del directorio.';
    directoryGrid.append(empty);
  }
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  activeQuery = searchInput.value.trim();
  activeMode = searchMode.value;

  const otherView = activeDirectory === 'services' ? 'lawyers' : 'services';
  if (findEntries(activeDirectory).length === 0 && findEntries(otherView).length > 0) {
    activeDirectory = otherView;
  }

  renderDirectory();
  directory.focus({ preventScroll: true });
  directory.scrollIntoView();
});

directoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeDirectory = button.dataset.directory;
    renderDirectory();
  });
});

clearSearch.addEventListener('click', () => {
  searchForm.reset();
  activeQuery = '';
  activeMode = '';
  renderDirectory();
  document.querySelector('[data-directory][aria-pressed="true"]').focus();
});

const menuButton = document.querySelector('.menu-toggle');
const headerPanel = document.querySelector('#header-panel');

function setMenu(open) {
  menuButton.setAttribute('aria-expanded', String(open));
  headerPanel.classList.toggle('is-open', open);
}

menuButton.addEventListener('click', () => setMenu(menuButton.getAttribute('aria-expanded') === 'false'));
headerPanel.querySelectorAll('.site-nav a').forEach((link) => {
  link.addEventListener('click', () => setMenu(false));
});

document.addEventListener('click', (event) => {
  if (!event.target.closest('.header-inner') && !event.target.closest('dialog')) {
    setMenu(false);
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && menuButton.getAttribute('aria-expanded') === 'true' && !document.querySelector('dialog[open]')) {
    setMenu(false);
    menuButton.focus();
  }
});

const accountDialog = document.querySelector('#account-dialog');
const accountTitle = document.querySelector('#account-title');
const accountFooter = document.querySelector('#account-footer');
const accountSwitch = document.querySelector('#account-switch');
const accountPrompt = document.querySelector('#account-switch-prompt');
const accountResult = document.querySelector('#account-result');
const loginForm = document.querySelector('#login-form');
const registerForm = document.querySelector('#register-form');
const photoInput = document.querySelector('#profile-photo');
const photoPreview = document.querySelector('#photo-preview');
const photoError = document.querySelector('#photo-error');
const removePhoto = document.querySelector('#remove-photo');

let photoUrl = null;

function clearPhoto() {
  if (photoUrl) {
    URL.revokeObjectURL(photoUrl);
    photoUrl = null;
  }
  photoPreview.hidden = true;
  photoPreview.removeAttribute('src');
  photoError.textContent = '';
  removePhoto.hidden = true;
}

function resetAccountForms() {
  loginForm.reset();
  registerForm.reset();
  clearPhoto();
}

function openAccount(mode) {
  const isRegister = mode === 'register';
  const currentForm = isRegister ? registerForm : loginForm;
  resetAccountForms();
  accountTitle.textContent = isRegister ? 'Crear cuenta' : 'Iniciar sesión';
  accountDialog.querySelector('.dialog-description').hidden = false;
  loginForm.hidden = isRegister;
  registerForm.hidden = !isRegister;
  accountResult.hidden = true;
  accountFooter.hidden = false;
  accountPrompt.textContent = isRegister ? '¿Ya tienes una cuenta?' : '¿Todavía no tienes una cuenta?';
  accountSwitch.textContent = isRegister ? 'Iniciar sesión' : 'Crear cuenta';
  accountSwitch.dataset.account = isRegister ? 'login' : 'register';

  if (!accountDialog.open) accountDialog.showModal();
  currentForm.querySelector('input').focus();
}

document.querySelectorAll('[data-account]').forEach((button) => {
  button.addEventListener('click', () => openAccount(button.dataset.account));
});

photoInput.addEventListener('change', () => {
  clearPhoto();
  const file = photoInput.files[0];
  if (!file) return;

  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type) || file.size > 5 * 1024 * 1024) {
    photoInput.value = '';
    photoError.textContent = 'Elige una imagen JPG, PNG o WebP de hasta 5 MB.';
    return;
  }

  photoUrl = URL.createObjectURL(file);
  photoPreview.src = photoUrl;
  photoPreview.hidden = false;
  removePhoto.hidden = false;
});

photoPreview.addEventListener('error', () => {
  if (!photoUrl) return;
  photoInput.value = '';
  clearPhoto();
  photoError.textContent = 'No pudimos abrir esa imagen. Puedes elegir otra.';
});

removePhoto.addEventListener('click', () => {
  photoInput.value = '';
  clearPhoto();
  photoInput.focus();
});

function finishAccount(event, message) {
  event.preventDefault();
  resetAccountForms();
  event.currentTarget.hidden = true;
  accountFooter.hidden = true;
  accountDialog.querySelector('.dialog-description').hidden = true;
  accountResult.hidden = false;
  accountResult.querySelector('#account-status').textContent = message;
  accountResult.querySelector('button').focus();
}

loginForm.addEventListener('submit', (event) => finishAccount(event, 'Prueba completada. No se inició una sesión.'));
registerForm.addEventListener('submit', (event) => finishAccount(event, 'Prueba completada. No se creó una cuenta ni se guardaron los datos.'));
accountDialog.addEventListener('close', resetAccountForms);

const quoteDialog = document.querySelector('#quote-dialog');
const quoteForm = document.querySelector('#quote-form');
const quoteMode = document.querySelector('#quote-mode');
const quoteContext = document.querySelector('#quote-context');
const quoteResult = document.querySelector('#quote-result');

function openQuote(entry, isLawyer) {
  quoteForm.reset();
  quoteContext.textContent = isLawyer ? `Perfil de ejemplo de ${entry.title} · ${entry.description}` : entry.title;
  [...quoteMode.options].forEach((option) => {
    option.disabled = Boolean(option.value) && !entry.modes.includes(option.value);
  });
  quoteMode.value = entry.modes.length === 1 ? entry.modes[0] : activeMode;
  quoteForm.hidden = false;
  quoteResult.hidden = true;
  quoteDialog.showModal();
  quoteForm.querySelector('input').focus();
}

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  quoteForm.reset();
  quoteForm.hidden = true;
  quoteResult.hidden = false;
  quoteResult.querySelector('#quote-status').textContent = 'Solicitud de demostración completada. No se envió ni se guardó la información.';
  quoteResult.querySelector('button').focus();
});

quoteDialog.addEventListener('close', () => quoteForm.reset());

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

const contactForm = document.querySelector('#contact-form');
const contactStatus = document.querySelector('#contact-status');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.reset();
  contactStatus.textContent = 'Prueba completada. El mensaje no se envió.';
});

contactForm.addEventListener('input', () => { contactStatus.textContent = ''; });

renderDirectory();
