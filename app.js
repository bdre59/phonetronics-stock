// ============================================================
//  app.js — Logique principale Phonetronics Stock
// ============================================================

const STORAGE_KEY = 'phonetronics_products';
const CATEGORIES = ['Smartphone', 'Ordinateur', 'Tablette', 'Accessoire', 'Audio', 'Pièce détachée'];

const CAT_CLASS = {
  'Smartphone':     'cat-Smartphone',
  'Ordinateur':     'cat-Ordinateur',
  'Tablette':       'cat-Tablette',
  'Accessoire':     'cat-Accessoire',
  'Audio':          'cat-Audio',
  'Pièce détachée': 'cat-PD',
};

let products = [];
let nextId = 100;
let isAdmin = false;
let currentUrl = window.location.href;

// ── Storage ──────────────────────────────────────────────────
function loadProducts() {
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved) {
    products = JSON.parse(saved);
    nextId = Math.max(...products.map(p => p.id)) + 1;
  } else {
    products = JSON.parse(JSON.stringify(DEFAULT_PRODUCTS));
    nextId = DEFAULT_PRODUCTS.length + 1;
    saveProducts();
  }
}

function saveProducts() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(products));
}

// ── Helpers ───────────────────────────────────────────────────
function stockInfo(q) {
  if (q === 0) return { color: 'var(--red)',    dot: 'var(--red)',    label: 'Rupture de stock' };
  if (q <= 5)  return { color: 'var(--orange)', dot: 'var(--orange)', label: `${q} restants` };
  return              { color: 'var(--green)',  dot: 'var(--green)',  label: `${q} en stock` };
}

function fmtPrice(p) {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(p);
}

// ── Catalogue public ──────────────────────────────────────────
function renderCatalog() {
  const search = document.getElementById('search').value.toLowerCase();
  const cat    = document.getElementById('filter-cat').value;
  const grid   = document.getElementById('catalog-grid');

  const filtered = products.filter(p =>
    (!search || p.name.toLowerCase().includes(search)) &&
    (!cat    || p.cat === cat)
  );

  if (!filtered.length) {
    grid.innerHTML = '<div class="empty">Aucun produit trouvé.</div>';
    return;
  }

  grid.innerHTML = filtered.map(p => {
    const s  = stockInfo(p.stock);
    const cc = CAT_CLASS[p.cat] || 'cat-Accessoire';
    return `
      <div class="product-card">
        <span class="cat-badge ${cc}">${p.cat}</span>
        <h3>${p.name}</h3>
        <p class="price">${fmtPrice(p.price)}</p>
        <p class="stock-label" style="color:${s.color}">
          <span class="dot" style="background:${s.dot}"></span>
          ${s.label}
        </p>
      </div>`;
  }).join('');

  document.getElementById('header-badge').textContent =
    `${products.filter(p => p.stock > 0).length} produits disponibles`;
}

// ── Stats admin ───────────────────────────────────────────────
function renderStats() {
  const total   = products.length;
  const inStock = products.filter(p => p.stock > 0).length;
  const rupture = products.filter(p => p.stock === 0).length;
  const valeur  = products.reduce((s, p) => s + p.price * p.stock, 0);

  document.getElementById('stats-row').innerHTML = `
    <div class="stat-card">
      <div class="s-label">Total produits</div>
      <div class="s-val">${total}</div>
    </div>
    <div class="stat-card">
      <div class="s-label">En stock</div>
      <div class="s-val" style="color:var(--green)">${inStock}</div>
    </div>
    <div class="stat-card">
      <div class="s-label">Rupture</div>
      <div class="s-val" style="color:var(--red)">${rupture}</div>
    </div>
    <div class="stat-card">
      <div class="s-label">Valeur stock</div>
      <div class="s-val" style="font-size:20px">${fmtPrice(valeur)}</div>
    </div>
  `;
}

// ── Table admin ───────────────────────────────────────────────
function renderAdmin() {
  renderStats();
  const tbody = document.getElementById('admin-tbody');
  tbody.innerHTML = products.map(p => {
    const s    = stockInfo(p.stock);
    const opts = CATEGORIES.map(c =>
      `<option${p.cat === c ? ' selected' : ''}>${c}</option>`
    ).join('');
    return `
      <tr>
        <td><input class="editable" value="${p.name}" onchange="updateField(${p.id},'name',this.value)"></td>
        <td>
          <select class="editable" onchange="updateField(${p.id},'cat',this.value)">${opts}</select>
        </td>
        <td>
          <input class="editable" type="number" value="${p.price}" style="width:80px"
            onchange="updateField(${p.id},'price',+this.value)">
        </td>
        <td>
          <input class="editable" type="number" value="${p.stock}" style="width:70px;color:${s.color}"
            onchange="updateField(${p.id},'stock',+this.value)">
        </td>
        <td>
          <button class="btn btn-sm btn-danger" onclick="deleteProduct(${p.id})">Supprimer</button>
        </td>
      </tr>`;
  }).join('');
}

function updateField(id, field, val) {
  const p = products.find(p => p.id === id);
  if (p) { p[field] = val; saveProducts(); renderCatalog(); renderStats(); }
}

function addProduct() {
  products.push({ id: nextId++, name: 'Nouveau produit', cat: 'Accessoire', price: 10, stock: 1 });
  saveProducts(); renderAdmin(); renderCatalog();
}

function deleteProduct(id) {
  if (!confirm('Supprimer ce produit ?')) return;
  products = products.filter(p => p.id !== id);
  saveProducts(); renderAdmin(); renderCatalog();
}

// ── Auth ──────────────────────────────────────────────────────
function login() {
  const u = document.getElementById('admin-user').value.trim();
  const p = document.getElementById('admin-pass').value;
  if (u === ADMIN_USER && p === ADMIN_PASS) {
    isAdmin = true;
    document.getElementById('login-section').style.display  = 'none';
    document.getElementById('admin-content').style.display  = 'block';
    renderAdmin();
  } else {
    document.getElementById('login-error').style.display = 'block';
  }
}

function logout() {
  isAdmin = false;
  document.getElementById('login-section').style.display  = 'block';
  document.getElementById('admin-content').style.display  = 'none';
  document.getElementById('admin-user').value = '';
  document.getElementById('admin-pass').value = '';
  document.getElementById('login-error').style.display = 'none';
}

// ── Tabs ──────────────────────────────────────────────────────
function switchTab(tab) {
  document.querySelectorAll('.tab').forEach((t, i) => {
    t.classList.toggle('active', ['public', 'qr', 'admin'][i] === tab);
  });
  document.querySelectorAll('.panel').forEach((p, i) => {
    p.classList.toggle('active', ['tab-public', 'tab-qr', 'tab-admin'][i] === 'tab-' + tab);
  });
  if (tab === 'qr') initQR();
}

// ── QR Code ───────────────────────────────────────────────────
let qrInstance = null;

function initQR() {
  const container = document.getElementById('qrcode');
  container.innerHTML = '';
  qrInstance = new QRCode(container, {
    text: currentUrl,
    width: 180, height: 180,
    colorDark: '#6c63ff', colorLight: '#13131a',
    correctLevel: QRCode.CorrectLevel.H
  });
  document.getElementById('share-url').textContent = currentUrl;
}

function applyUrl() {
  const val = document.getElementById('custom-url').value.trim();
  if (val) { currentUrl = val; initQR(); }
}

function copyLink() {
  navigator.clipboard.writeText(currentUrl).then(() => {
    const btn = document.querySelector('.share-actions .btn-accent');
    btn.textContent = '✅ Copié !';
    setTimeout(() => btn.textContent = '📋 Copier le lien', 2000);
  });
}

function downloadQR() {
  const canvas = document.querySelector('#qrcode canvas');
  if (!canvas) return;
  const a = document.createElement('a');
  a.download = 'phonetronics-qrcode.png';
  a.href = canvas.toDataURL('image/png');
  a.click();
}

// ── Events ────────────────────────────────────────────────────
document.getElementById('search').addEventListener('input', renderCatalog);
document.getElementById('filter-cat').addEventListener('change', renderCatalog);

// ── Init ──────────────────────────────────────────────────────
loadProducts();
renderCatalog();
