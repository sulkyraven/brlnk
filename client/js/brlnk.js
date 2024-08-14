import nav from './main/nav.js';
import Biaya from './main/Biaya.js';
import db from './helper/db.js';

const barangList = await fetch('./json/barang.json').then(r=>r.json()).then(r=>r).catch(() => {});
db.barang = barangList;

nav.runListener();
new Biaya().run();