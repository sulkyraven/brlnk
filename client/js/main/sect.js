import Akun from "./Akun.js";
import Biaya from "./Biaya.js";
import Barang from "./Barang.js";
import Catatan from "./Catatan.js";

export default [
  { id:'akun', name: 'akun', run() {new Akun().run()} },
  { id:'biaya', name: 'biaya', run() {new Biaya().run()} },
  { id:'rokok', name: 'rokok', run() {new Barang({tyfilter:[0],name:this.name}).run()} },
  { id:'catatan', name: 'catatan', run() {new Catatan().run()} },
]