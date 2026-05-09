// ============================================================
//  data.js — Données initiales du stock Phonetronics
//  Modifiez ce fichier pour changer les produits par défaut.
//  En production, les données sont sauvegardées dans localStorage.
// ============================================================

const DEFAULT_PRODUCTS = [
  { id: 1,  name: 'Samsung Galaxy A55',       cat: 'Smartphone',      price: 349,  stock: 12 },
  { id: 2,  name: 'iPhone 15',                cat: 'Smartphone',      price: 799,  stock: 5  },
  { id: 3,  name: 'Tecno Spark 20',           cat: 'Smartphone',      price: 149,  stock: 18 },
  { id: 4,  name: 'HP Laptop 15',             cat: 'Ordinateur',      price: 549,  stock: 7  },
  { id: 5,  name: 'Lenovo IdeaPad 3',         cat: 'Ordinateur',      price: 479,  stock: 4  },
  { id: 6,  name: 'Samsung Tab A9',           cat: 'Tablette',        price: 299,  stock: 3  },
  { id: 7,  name: 'Coque silicone Samsung',   cat: 'Accessoire',      price: 9,    stock: 45 },
  { id: 8,  name: 'Chargeur rapide 65W',      cat: 'Accessoire',      price: 19,   stock: 30 },
  { id: 9,  name: 'Verre trempé iPhone',      cat: 'Accessoire',      price: 5,    stock: 0  },
  { id: 10, name: 'Écouteurs Bluetooth',      cat: 'Audio',           price: 29,   stock: 8  },
  { id: 11, name: 'Écran iPhone 13',          cat: 'Pièce détachée',  price: 79,   stock: 6  },
  { id: 12, name: 'Batterie Samsung S21',     cat: 'Pièce détachée',  price: 29,   stock: 10 },
  { id: 13, name: 'Connecteur charge USB-C',  cat: 'Pièce détachée',  price: 12,   stock: 20 },
];

// Identifiants admin — CHANGEZ CES VALEURS avant de déployer !
const ADMIN_USER = 'badr';
const ADMIN_PASS = 'Haytem2504@';
