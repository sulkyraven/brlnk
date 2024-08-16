import nav from './main/nav.js';
import Biaya from './main/Biaya.js';
import db from './helper/db.js';
import { modal } from './helper/modal.js';
import xhr from './helper/xhr.js';

const dinitial = await modal.loading(xhr.get('/uwu/initial'));
Object.keys(dinitial).forEach(key => {
  db[key] = dinitial[key];
});

nav.runListener();
new Biaya().run();