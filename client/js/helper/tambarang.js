import { modal, waittime } from "./modal.js";
import xhr from "./xhr.js";

export default class {
  constructor({type=0,brg={}} = {}) {
    this.type = type;
    this.brg = brg;
    this.isLocked = false;
  }
  createElement() {
    this.element = document.createElement('div');
    this.element.classList.add('fuwi', '_tambarang');
    this.element.innerHTML = `
    <form action="/add-item" class="form" data-tambarang="brlnk">
      <div class="field center">
        <p><b>${this.type === 0 ? 'TAMBAH' : 'GANTI'} BARANG</b></p>
      </div>
      <div class="field">
        <label for="item_name">Nama Barang:</label>
        <input type="text" name="item_name" id="item_name" autocomplete="off" maxlength="50" ${this.brg.name ? `value="${this.brg.name}"` : ''} required/>
      </div>
      <p>Tipe Barang:</p>
      <div class="tr-types">
        <div class="tr-type">
          <label for="item_type_1">
            <input type="radio" name="item_type" id="item_type_1" ${this.brg.type===0 ? 'checked': ''} required/>
            <p>Rokok</p>
          </label>
        </div>
        <div class="tr-type">
          <label for="item_type_2">
            <input type="radio" name="item_type" id="item_type_2" ${this.brg.type===2 ? 'checked': ''} required/>
            <p>Lainnya</p>
          </label>
        </div>
      </div>
      <div class="field">
        <label for="item_price">Harga Barang:</label>
        <input type="text" name="item_price" id="item_price" autocomplete="off" maxlength="10" ${this.brg.price ? `value="${this.brg.price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.')}"` : ''} required/>
      </div>
      <div class="field">
        <label for="item_desc">Keterangan (opsional):</label>
        <textarea name="item_desc" id="item_desc" maxlength="500" ${this.brg.desc ? `value="${this.brg.desc}"` : ''}></textarea>
      </div>
      <div class="br-t"></div>
      ${this.type === 2 ? `<div class="field action">
        <div class="btn" role="button" data-delete="tambarang">hapus</div>
      </div>` : ''}
      <div class="field actions">
        <div class="btn" role="button" data-cancel="tambarang">BATAL</div>
        <button class="btn" type="submit">
          ${this.type === 0 ? 'tambah' : 'ganti'}
        </button>
      </div>
    </form>`;
  }
  priceFormatter() {
    const input = this.element.querySelector('#item_price');
    input.oninput = () => {
      input.value = input.value.replace(/\D/g, "").replace(/\B(?=(\d{3})+(?!\d))/g, ".");
    }
  }
  submitListener() {
    const btnCancel = this.element.querySelector('[data-cancel]');
    btnCancel.onclick = () => {
      if(this.isLocked === true) return;
      this.isLocked = true;
      this.destroy();
    }
    const form = this.element.querySelector('[data-tambarang]');
    form.onsubmit = async e => {
      e.preventDefault();
      if(this.isLocked === true) return;
      this.isLocked = true;

      let data = {};
      data.type = this.type;

      const formData = new FormData(form);
      for(const [key,val] of formData) {
        data[key] = val;
      }

      const postTam = await modal.loading(xhr.post('/uwu/tambarang', data));
      if(!postTam || postTam.status !== 200) {
        await modal.alert(postTam?.msg || 'Terjadi Kesalahan');
        this.isLocked = false;
        return;
      }
      let textact = this.type === 0 ? 'menambah' : this.type === 1 ? 'mengubah' : 'menghapus';
      await modal.alert(`Berhasil ${textact} data`);
      this.destroy();
    }
  }
  async destroy() {
    this.element.classList.add('out');
    await waittime(495);
    this.type = 0;
    this.isLocked = false;
    this.element.remove();
  }
  run() {
    this.createElement();
    document.querySelector('body').append(this.element);
    this.submitListener();
    this.priceFormatter();
  }
}