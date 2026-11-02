const REPO = 'VlV-515/Angular-Dojo-VlV';
const PROGRESS_KEY = 'dojo-solved';

const BELTS = [
  { level: 'junior', name: 'Cinturón blanco', subtitle: 'junior' },
  { level: 'mid', name: 'Cinturón azul', subtitle: 'mid' },
  { level: 'senior', name: 'Cinturón negro', subtitle: 'senior' },
];

const VERIFY_LABELS = { unit: 'Jest', e2e: 'Playwright', build: 'ng build' };

function readSolved() {
  try {
    return new Set(JSON.parse(localStorage.getItem(PROGRESS_KEY) ?? '[]'));
  } catch {
    return new Set();
  }
}

function writeSolved(solved) {
  try {
    localStorage.setItem(PROGRESS_KEY, JSON.stringify([...solved]));
  } catch {
    // Sin storage el checkbox solo dura la sesión; no pasa nada.
  }
}

function el(tag, attrs = {}, ...children) {
  const node = document.createElement(tag);
  for (const [key, value] of Object.entries(attrs)) {
    if (key === 'class') node.className = value;
    else node.setAttribute(key, value);
  }
  node.append(...children);
  return node;
}

function codespacesUrl(branch) {
  return `https://codespaces.new/${REPO}?ref=${encodeURIComponent(branch)}&quickstart=1`;
}

function renderCard(entry, solved) {
  const id = `solved-${entry.id}`;
  const checkbox = el('input', { type: 'checkbox', id });
  checkbox.checked = solved.has(entry.id);
  checkbox.addEventListener('change', () => {
    if (checkbox.checked) solved.add(entry.id);
    else solved.delete(entry.id);
    writeSolved(solved);
    card.classList.toggle('is-solved', checkbox.checked);
  });

  const verifies = Object.entries(entry.verify)
    .filter(([, enabled]) => enabled)
    .map(([kind]) => el('span', { class: 'badge' }, VERIFY_LABELS[kind] ?? kind));

  const solution = el(
    'a',
    { class: 'link-muted', href: `https://github.com/${REPO}/tree/${entry.branch.solution}` },
    'Ver solución',
  );
  solution.addEventListener('click', (event) => {
    if (!confirm('¿Ya lo intentaste en serio? La solución se mira después de pelear un rato.')) {
      event.preventDefault();
    }
  });

  const card = el(
    'article',
    { class: `card${checkbox.checked ? ' is-solved' : ''}` },
    el('p', { class: 'topic' }, entry.topic),
    el('h4', {}, entry.title),
    el('p', { class: 'symptom' }, `“${entry.symptom}”`),
    el(
      'p',
      { class: 'meta' },
      `${entry.timeMinutes} min · ${entry.bugs} bugs · `,
      ...verifies,
    ),
    el(
      'div',
      { class: 'actions' },
      el(
        'a',
        { class: 'btn', href: codespacesUrl(entry.branch.challenge), target: '_blank', rel: 'noopener' },
        'Abrir en Codespaces',
      ),
      el(
        'a',
        { class: 'link', href: `https://github.com/${REPO}/blob/${entry.branch.challenge}/CHALLENGE.md` },
        'Ver brief',
      ),
      solution,
    ),
    el('label', { class: 'solved', for: id }, checkbox, ' Lo resolví'),
  );
  return card;
}

async function main() {
  const status = document.getElementById('catalog-status');
  const root = document.getElementById('catalog');
  let catalog;
  try {
    const response = await fetch('challenges.json');
    if (!response.ok) throw new Error(String(response.status));
    catalog = await response.json();
  } catch {
    status.textContent = 'No pude cargar el catálogo. Recarga la página.';
    return;
  }

  const ready = catalog.filter((entry) => entry.status === 'ready');
  const solved = readSolved();
  status.textContent = `${ready.length} retos disponibles. Tu avance se guarda solo en este navegador.`;

  for (const belt of BELTS) {
    const entries = ready
      .filter((entry) => entry.level === belt.level)
      .sort((a, b) => a.order - b.order);
    if (entries.length === 0) continue;
    root.append(
      el(
        'section',
        { class: `belt belt-${belt.level}` },
        el('h3', {}, belt.name, el('span', { class: 'belt-sub' }, ` · ${belt.subtitle}`)),
        el('div', { class: 'grid' }, ...entries.map((entry) => renderCard(entry, solved))),
      ),
    );
  }
}

main();
