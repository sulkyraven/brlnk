export function waittime(ms = 245) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

export const modal = {
  cleaner() {
    const el = document.createElement('div');
    el.classList.add('modal');
    document.querySelector('body').append(el);
    return el;
  },
  alert(s) {
    return new Promise(resolve => {
      const el = this.cleaner();
      el.innerHTML = `
      <div class="box">
        <div class="icon">
          <i class="fa-duotone fa-${s.ic||'circle-exclamation'}"></i>
        </div>
        <div class="field">
          <p class="msg"></p>
        </div>
        <div class="action">
          <div role="button" class="btn btn-ok">OK</div>
        </div>
      </div>`;
      const emsg = el.querySelector('.field p.msg');
      emsg.innerText = s && typeof s == 'string' ? s : s.msg || '';
  
      const btnok = el.querySelector('.action .btn-ok');
      if(s.okx) btnok.innerText = s.okx;
      btnok.onclick = async() => {
        el.classList.add('out')
        await waittime(495)
        el.remove();
        return resolve(true);
      }
    });
  },
  confirm(s) {
    return new Promise(resolve => {
      const el = this.cleaner();
      el.innerHTML = `
      <div class="box">
        <div class="icon">
          <i class="fa-duotone fa-${s.ic||'circle-exclamation'}"></i>
        </div>
        <div class="field">
          <p class="msg"></p>
        </div>
        <div class="actions">
          <div role="button" class="btn btn-cancel">BATAL</div>
          <div role="button" class="btn btn-ok">OK</div>
        </div>
      </div>`;
      const emsg = el.querySelector('.field p.msg');
      emsg.innerText = s && typeof s == 'string' ? s : s.msg || '';
  
      const btnok = el.querySelector('.actions .btn-ok');
      if(s.okx) btnok.innerText = s.okx;
      btnok.onclick = async() => {
        el.classList.add('out')
        await waittime(495)
        el.remove();
        return resolve(true);
      }

      const btncancel = el.querySelector('.actions .btn-cancel');
      if(s.cancelx) btncancel.innerText = s.cancelx;
      btncancel.onclick = async() => {
        el.classList.add('out')
        await waittime(495)
        el.remove();
        return resolve(false);
      }
    });
  },
  prompt(s) {
    return new Promise(resolve => {
      const el = this.cleaner();
      el.innerHTML = `
      <div class="box">
        <div class="icon">
          <i class="fa-duotone fa-${s.ic||'circle-exclamation'}"></i>
        </div>
        <div class="field">
          <p class="msg"></p>
          <input class="modal_input" type="text" name="modal_text" id="modal_text" autocomplete="off" />
        </div>
        <div class="actions">
          <div role="button" class="btn btn-cancel">BATAL</div>
          <div role="button" class="btn btn-ok">OK</div>
        </div>
      </div>`;
      const emsg = el.querySelector('.field p.msg');
      emsg.innerText = s && typeof s == 'string' ? s : s.msg || '';
  
      const input = el.querySelector('.field .modal_input');

      const btnok = el.querySelector('.actions .btn-ok');
      if(s.okx) btnok.innerText = s.okx;
      btnok.onclick = async() => {
        el.classList.add('out')
        await waittime(495)
        el.remove();
        return resolve(input.value);
      }

      const btncancel = el.querySelector('.actions .btn-cancel');
      if(s.cancelx) btncancel.innerText = s.cancelx;
      btncancel.onclick = async() => {
        el.classList.add('out')
        await waittime(495)
        el.remove();
        return resolve(false);
      }
    });
  },
  loading(newfunc) {
    return new Promise(async resolve => {
      if(!newfunc) return resolve({status: 400, msg: "Err: Tidak ada function yang dikirimkan"});

      const el = this.cleaner();
      
      el.innerHTML = `
      <div class="box">
        <div class="loading">
          <p>MEMUAT</p>
        </div>
      </div>`;

      await waittime(495);

      resolve(await newfunc.then(async res => {
        el.classList.add('out');
        await waittime(495);
        el.remove();
        return res;
      }).catch(async err => {
        el.classList.add('out');
        await waittime(495);
        el.remove();
        return {status: 500, msg: "Err: Terjadi Kesalahan", data: err};
      }));
    });
  },
}