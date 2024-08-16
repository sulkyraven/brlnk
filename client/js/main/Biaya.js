import db from "../helper/db.js";
import elman from "../helper/elman.js";
import { waittime } from "../helper/modal.js";
import nav from "./nav.js";

export default class Biaya {
  constructor() {
    this.name = 'biaya';
    this.type = 'tarik';
  }
  createElement() {
    this.element = document.createElement('section');
    this.element.classList.add('sect', '_biaya');
    this.element.innerHTML = `
    <div class="content">
      <div class="field"><p>Tipe Transaksi:</p></div>
      <div class="tr-types">
        <div class="tr-type">
          <label for="tr-type-1">
            <input type="radio" name="tr-type" id="tr-type-1" value="tarik" checked />
            <p>Tarik Tunai</p>
          </label>
        </div>
        <div class="tr-type">
          <label for="tr-type-2">
            <input type="radio" name="tr-type" id="tr-type-2" value="tf" />
            <p>TF Sesama BRI</p>
          </label>
        </div>
        <div class="tr-type">
          <label for="tr-type-3">
            <input type="radio" name="tr-type" id="tr-type-3" value="ab" />
            <p>TF Antar Bank</p>
          </label>
        </div>
      </div>
      <div class="field">
        <p>Nominal Transaksi:</p>
      </div>
      <div class="field">
        <input type="number" name="tr-amount" id="tr-amount" autocomplete="off" placeholder="Ketik Nominal Transaksi"/>
      </div>
      <div class="field trans2">
        <div class="card">
          <p>Jumlah Transaksi</p>
          <p><b data-amount="biaya">Rp0</b></p>
        </div>
        <div class="card">
          <p>Biaya Transaksi</p>
          <p><b data-fee="biaya">Rp5.000</b></p>
        </div>
      </div>
    </div>`;
  }
  getFeePrint(input) {
    let tfee = db.fees[this.type].find(k => input.value >= k.tr);
    const eamount = this.element.querySelector('[data-amount]');
    eamount.innerHTML = 'Rp'+(input.value || 0).toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");;
    const efee = this.element.querySelector('[data-fee]');
    efee.innerHTML = 'Rp'+tfee.fee.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }
  nominalListener() {
    const input = this.element.querySelector('#tr-amount');
    input.oninput = () => this.getFeePrint(input);

    const trTypeRadios = document.querySelectorAll('input[name="tr-type"]');
    let trTypePrev = 'tarik';
    for(let i = 0; i < trTypeRadios.length;i++) {
      trTypeRadios[i].onchange = () => {
        (trTypePrev) ? trTypePrev.value : null;
        if(trTypeRadios[i] !== trTypePrev) {
          trTypePrev = trTypeRadios[i];
        }
        this.type = trTypePrev.value;
        this.getFeePrint(input);
      };
    }
  }
  async destroy() {
    if(this.element) {
      this.element.classList.add('out');
      await waittime();
      this.element.remove();
    }
    elman.classOpened = null;
  }
  run() {
    elman.classOpened = this;
    this.createElement();
    document.querySelector('main').appendChild(this.element);
    nav.setTitle(this.name);
    this.nominalListener();
  }
}

// input.value = input.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");