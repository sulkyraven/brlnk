import Biaya from "./Biaya.js";
import Barang from "./Barang.js";

export default [
  { id:'biaya', name: 'biaya', run() {new Biaya().run()} },
  { id:'rokok', name: 'rokok', run() {new Barang({tyfilter:[0],name:this.name}).run()} }
]