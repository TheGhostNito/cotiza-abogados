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
    specialty: 'Derecho de familia y derecho civil',
    experience: 12,
    description: 'Acompaña a familias en procesos de separación, acuerdos de cuidado personal y pensiones de alimentos. También asesora en herencias y acuerdos civiles.',
    portrait: 'assets/abogados/camila-rojas.webp',
    keywords: 'divorcio alimentos custodia herencias deudas',
    modes: ['online', 'presencial'],
  },
  {
    title: 'Nicolás Herrera',
    specialty: 'Derecho laboral y derecho comercial',
    experience: 8,
    description: 'Asesora a trabajadores en la revisión de finiquitos y consultas por despido. También apoya a pequeñas empresas en la constitución de sociedades y la revisión de contratos.',
    portrait: 'assets/abogados/nicolas-herrera.webp',
    keywords: 'despido finiquito trabajo empresa sociedades contratos',
    modes: ['online'],
  },
  {
    title: 'Valentina Soto',
    specialty: 'Derecho inmobiliario y derecho migratorio',
    experience: 15,
    description: 'Revisa contratos de arriendo y antecedentes para la compraventa de propiedades. También orienta a personas extranjeras en trámites de residencia y nacionalidad.',
    portrait: 'assets/abogados/valentina-soto.webp',
    keywords: 'arriendo compraventa propiedades visas residencia extranjería',
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
const directoryTitle = document.querySelector('#directory-title');
const directoryGrid = document.querySelector('#directory-grid');
const directoryButtons = document.querySelectorAll('[data-directory]');
const filterSummary = document.querySelector('#filter-summary');
const searchStatus = document.querySelector('#search-status');
const clearSearch = document.querySelector('#clear-search');
const searchEmpty = document.querySelector('#search-empty');
const searchEmptyTitle = document.querySelector('#search-empty-title');
const searchEmptyHelp = document.querySelector('#search-empty-help');
const recoverSearch = document.querySelector('#recover-search');

let activeDirectory = 'services';
let activeQuery = '';
let activeMode = '';

function normalizeSearch(text) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLocaleLowerCase('es-CL');
}

function findEntries(view, mode = activeMode) {
  const terms = normalizeSearch(activeQuery).split(/\s+/).filter(Boolean);
  return directories[view].entries.filter((entry) => {
    const searchable = normalizeSearch([entry.title, entry.specialty, entry.description, entry.keywords].join(' '));
    return (!mode || entry.modes.includes(mode)) && terms.every((term) => searchable.includes(term));
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

function createServiceCard(entry) {
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

  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'card-action text-button';
  button.setAttribute('aria-label', `Solicitar cotización: ${entry.title}`);
  button.append('Solicitar cotización', createIcon('up-right'));
  button.addEventListener('click', () => openQuote(entry));
  card.append(button);

  return card;
}

const lawyerCardTemplate = document.querySelector('#lawyer-card-template');

function formatModes(modes) {
  return modes.length === 2 ? 'En línea y presencial' : modeNames[modes[0]];
}

function createLawyerCard(lawyer) {
  const card = lawyerCardTemplate.content.firstElementChild.cloneNode(true);
  card.querySelector('img').src = lawyer.portrait;
  card.querySelector('h3').textContent = lawyer.title;
  card.querySelector('.lawyer-specialty').textContent = lawyer.specialty;
  card.querySelector('.lawyer-card-meta').textContent = formatModes(lawyer.modes);

  const button = card.querySelector('button');
  button.setAttribute('aria-label', `Ver perfil de ${lawyer.title}`);
  button.addEventListener('click', () => openLawyerProfile(lawyer));
  return card;
}

function renderEmptySearch(isLawyer) {
  const hasUnfilteredMatches = activeMode && findEntries(activeDirectory, '').length > 0;
  searchEmptyTitle.textContent = isLawyer ? 'No encontramos perfiles' : 'No encontramos especialidades';

  if (hasUnfilteredMatches) {
    searchEmptyHelp.textContent = 'Hay coincidencias en otra modalidad. Quita el filtro para verlas sin cambiar el término de búsqueda.';
    recoverSearch.textContent = 'Quitar filtro de modalidad';
    recoverSearch.onclick = removeSearchMode;
    return;
  }

  searchEmptyHelp.textContent = isLawyer
    ? 'Prueba con un nombre o un tema más general, como «Camila Rojas» o «familia».'
    : 'Prueba con una palabra más general, como «familia», «despido» o «arriendo».';
  recoverSearch.textContent = isLawyer ? 'Ver todos los perfiles' : 'Ver todas las especialidades';
  recoverSearch.onclick = resetSearch;
}

function renderDirectory() {
  const view = directories[activeDirectory];
  const isLawyer = activeDirectory === 'lawyers';
  const entries = findEntries(activeDirectory);
  const hasResults = entries.length > 0;
  const isFiltered = Boolean(activeQuery || activeMode);

  directoryTitle.textContent = view.title;
  directory.querySelector('.directory-head p').textContent = view.description;
  directory.querySelector('#directory-note').hidden = !isLawyer || !hasResults;
  directoryButtons.forEach((button) => {
    button.setAttribute('aria-pressed', String(button.dataset.directory === activeDirectory));
  });

  filterSummary.hidden = !isFiltered;
  clearSearch.hidden = !hasResults;
  const resultCount = `${entries.length} ${entries.length === 1 ? view.singular : view.plural}`;
  const querySummary = activeQuery ? ` para «${activeQuery}»` : '';
  const modeSummary = activeMode ? ` · ${modeNames[activeMode]}` : '';
  searchStatus.textContent = isFiltered ? `${resultCount}${querySummary}${modeSummary}` : '';

  directoryGrid.replaceChildren(...entries.map(isLawyer ? createLawyerCard : createServiceCard));
  searchEmpty.hidden = hasResults;
  if (!hasResults) renderEmptySearch(isLawyer);
}

function focusSearchResults() {
  const target = searchEmpty.hidden ? directoryTitle : searchEmptyTitle;
  target.focus({ preventScroll: true });
  directory.scrollIntoView();
}

searchForm.addEventListener('submit', (event) => {
  event.preventDefault();
  activeQuery = searchInput.value.trim();
  activeMode = searchMode.value;

  if (findEntries(activeDirectory).length === 0) {
    const otherView = activeDirectory === 'services' ? 'lawyers' : 'services';
    const otherHasResults = findEntries(otherView).length > 0;
    const otherHasResultsWithoutMode = activeMode && findEntries(activeDirectory, '').length === 0 && findEntries(otherView, '').length > 0;
    if (otherHasResults || otherHasResultsWithoutMode) activeDirectory = otherView;
  }

  renderDirectory();
  focusSearchResults();
});

directoryButtons.forEach((button) => {
  button.addEventListener('click', () => {
    activeDirectory = button.dataset.directory;
    renderDirectory();
  });
});

function resetSearch() {
  searchForm.reset();
  activeQuery = '';
  activeMode = '';
  renderDirectory();
  focusSearchResults();
}

function removeSearchMode() {
  searchInput.value = activeQuery;
  searchMode.value = '';
  activeMode = '';
  renderDirectory();
  focusSearchResults();
}

clearSearch.addEventListener('click', resetSearch);
document.querySelector('#edit-search').addEventListener('click', () => {
  searchInput.focus({ preventScroll: true });
  searchForm.scrollIntoView({ block: 'center' });
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

function dismissMenuOutside(event) {
  if (menuButton.getAttribute('aria-expanded') === 'true' && !event.target.closest('.header-inner, dialog')) {
    setMenu(false);
  }
}

document.addEventListener('click', dismissMenuOutside);
document.addEventListener('focusin', dismissMenuOutside);

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
  accountDialog.scrollTop = 0;
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

function showConfirmation(form, panel) {
  form.hidden = true;
  panel.hidden = false;
  panel.querySelector('h3').focus();
}

function finishAccount(event, title, message) {
  event.preventDefault();
  resetAccountForms();
  accountFooter.hidden = true;
  accountDialog.querySelector('.dialog-description').hidden = true;
  accountResult.querySelector('h3').textContent = title;
  accountResult.querySelector('#account-status').textContent = message;
  showConfirmation(event.currentTarget, accountResult);
}

loginForm.addEventListener('submit', (event) => {
  finishAccount(event, 'Inicio de sesión simulado', 'La demo no abrió una sesión. Puedes seguir explorando sin una cuenta.');
});
registerForm.addEventListener('submit', (event) => {
  finishAccount(event, 'Prueba de registro completada', 'La demo descartó los datos ingresados sin crear una cuenta.');
});
accountDialog.addEventListener('close', resetAccountForms);

const lawyerDialog = document.querySelector('#lawyer-dialog');
const lawyerTitle = document.querySelector('#lawyer-title');
const lawyerPortrait = document.querySelector('#lawyer-portrait');
const lawyerQuote = document.querySelector('#lawyer-quote');

function openLawyerProfile(lawyer) {
  lawyerTitle.textContent = lawyer.title;
  lawyerPortrait.alt = `Retrato ficticio de ${lawyer.title}`;
  lawyerPortrait.src = lawyer.portrait;
  lawyerDialog.querySelector('#lawyer-specialty').textContent = lawyer.specialty;
  lawyerDialog.querySelector('#lawyer-experience').textContent = `${lawyer.experience} años de experiencia`;
  lawyerDialog.querySelector('#lawyer-modes').textContent = formatModes(lawyer.modes);
  lawyerDialog.querySelector('#lawyer-bio').textContent = lawyer.description;
  lawyerQuote.onclick = () => openQuote(lawyer, true);

  lawyerDialog.showModal();
  lawyerDialog.scrollTop = 0;
  lawyerTitle.focus({ preventScroll: true });
}

const quoteDialog = document.querySelector('#quote-dialog');
const quoteForm = document.querySelector('#quote-form');
const quoteMode = document.querySelector('#quote-mode');
const quoteRecipientLabel = document.querySelector('#quote-recipient-label');
const quoteRecipient = document.querySelector('#quote-recipient');
const quoteResult = document.querySelector('#quote-result');
const quoteResultMode = document.querySelector('#quote-result-mode');

function openQuote(entry, fromLawyerProfile = false) {
  quoteForm.reset();
  quoteRecipientLabel.textContent = fromLawyerProfile ? 'Solicitud para' : 'Especialidad';
  quoteRecipient.textContent = entry.title;
  [...quoteMode.options].forEach((option) => {
    option.disabled = Boolean(option.value) && !entry.modes.includes(option.value);
  });
  quoteMode.value = entry.modes.length === 1 ? entry.modes[0] : activeMode;
  quoteResult.querySelector('button').textContent = fromLawyerProfile ? 'Volver al perfil' : 'Volver a explorar';
  quoteForm.hidden = false;
  quoteResult.hidden = true;
  quoteDialog.showModal();
  quoteDialog.scrollTop = 0;
  quoteForm.querySelector('input').focus();
}

quoteForm.addEventListener('submit', (event) => {
  event.preventDefault();
  quoteResultMode.textContent = `Modalidad seleccionada: ${modeNames[quoteMode.value]}`;
  quoteForm.reset();
  showConfirmation(quoteForm, quoteResult);
});

quoteDialog.addEventListener('close', () => quoteForm.reset());

document.querySelectorAll('[data-close]').forEach((button) => {
  button.addEventListener('click', () => button.closest('dialog').close());
});

const contactForm = document.querySelector('#contact-form');
const contactResult = document.querySelector('#contact-result');

contactForm.addEventListener('submit', (event) => {
  event.preventDefault();
  contactForm.reset();
  showConfirmation(contactForm, contactResult);
});

document.querySelector('#restart-contact').addEventListener('click', () => {
  contactResult.hidden = true;
  contactForm.hidden = false;
  contactForm.querySelector('input').focus();
});

renderDirectory();
