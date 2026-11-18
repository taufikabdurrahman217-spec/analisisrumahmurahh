(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* Navbar menjadi solid saat scroll + parallax gambar hero */
  const nav = $('#nav'), hero = $('#hero');
  addEventListener('scroll', () => {
    nav.classList.toggle('solid', scrollY > 40);
    if (!calm && scrollY < innerHeight) hero.style.setProperty('--sy', `${scrollY * -0.08}px`);
  }, { passive: true });

  /* Hero bergerak mengikuti kursor */
  if (!calm) {
    hero.addEventListener('mousemove', e => {
      const r = hero.getBoundingClientRect();
      hero.style.setProperty('--mx', ((e.clientX - r.left) / r.width - .5).toFixed(3));
      hero.style.setProperty('--my', ((e.clientY - r.top) / r.height - .5).toFixed(3));
    });
    hero.addEventListener('mouseleave', () => {
      hero.style.setProperty('--mx', 0); hero.style.setProperty('--my', 0);
    });
  }

  /* Slider perbandingan */
  const cmp = $('#compare'), range = $('#range');
  const setP = v => cmp.style.setProperty('--p', v + '%');
  range.addEventListener('input', () => setP(range.value));
  if (!calm) {
    let t = 0;
    const io = new IntersectionObserver(([en]) => {
      if (!en.isIntersecting || t) return;
      t = 1; const s = performance.now();
      (function step(n) {
        const k = Math.min((n - s) / 1600, 1);
        const v = 50 + Math.sin(k * Math.PI * 2) * 22 * (1 - k);
        range.value = v; setP(v);
        if (k < 1) requestAnimationFrame(step);
      })(s);
    }, { threshold: .6 });
    io.observe(cmp);
  }

  /* Denah interaktif: Opsi 1 dan Opsi 2 */
  const ROOMS = [
    ['Dapur', '±3 × 2 m, ruang tersendiri'],
    ['Kamar mandi', '±1,5 × 1,5 m'],
    ['Ruang tamu & keluarga', '±3 × 3,25 m'],
    ['Kamar tidur 1', '±3 × 2,5 m'],
    ['Kamar tidur 2', '±3 × 2,5 m'],
    ['Carport & taman', 'Muat 1 mobil, taman depan']
  ];
  const OPS = [
    { desc: 'Rp 215 Juta · Dapur belakang', img: 'img/denah.webp', pins: [[32,15],[17,28],[15,48],[76,20],[75,40],[45,82]], rooms: ROOMS },
    { desc: 'Rp 250 Juta · Dapur belakang, ruang tamu luar, dan tambahan kanopi ruang tamu', img: 'img/denah-opsi2.webp', pins: [[25,11],[17,28],[24,49],[76,23],[75,47],[75,78],[16,83]],
      rooms: [...ROOMS.slice(0,5), ['Carport', 'Muat 1 mobil'], ['Ruang tamu luar & kanopi', 'Area duduk bernaungan kanopi, dinding roster di sisi depan']] }
  ];
  const plan = $('#plan'), pimg = $('#plan-img'), ul = $('#rooms');
  let pins = [], lis = [];
  const pick = i => {
    pins.forEach((p, k) => p.classList.toggle('on', k === i));
    lis.forEach((l, k) => l.classList.toggle('on', k === i));
  };
  const ev3 = (el, i) => ['mouseenter', 'focus', 'click'].forEach(ev => el.addEventListener(ev, () => pick(i)));
  function build(o) {
    const d = OPS[o];
    $('#optdesc').textContent = d.desc;
    pimg.style.opacity = 0;
    setTimeout(() => { pimg.src = d.img; pimg.style.opacity = 1; }, 200);
    $$('.pin', plan).forEach(p => p.remove());
    d.pins.forEach(([x, y], i) => {
      const b = document.createElement('button');
      b.className = 'pin'; b.style.cssText = `--x:${x}%;--y:${y}%`;
      b.textContent = i + 1; b.setAttribute('aria-label', d.rooms[i][0]);
      plan.appendChild(b);
    });
    ul.innerHTML = d.rooms.map(([n, t], i) => `<li tabindex="0"><i>${i + 1}</i><div><b>${n}</b><span>${t}</span></div></li>`).join('');
    pins = $$('.pin', plan); lis = $$('li', ul);
    pins.forEach(ev3); lis.forEach(ev3);
    pick(0);
  }
  $$('#switch button').forEach(b => b.addEventListener('click', () => {
    $$('#switch button').forEach(x => x.classList.toggle('on', x === b));
    build(+b.dataset.o);
  }));
  build(0);


  /* Simulator keuangan: Opsi 1 (kiri) dan Opsi 2 (kanan), rumus mengikuti Excel Pengeluaran Akad */
  const SIM = [
    { c: 'a', title: 'Opsi 1 · Dapur belakang', tag: 'Data real',
      v: { harga: 215, kons: 69, tamb: 10.8825, fee: 4.719, npop: 80, bphtb: 5, pph: 2.5, bn: 2.5, peneb: 83, unit: 40 } },
    { c: 'b', title: 'Opsi 2 · Dapur belakang, ruang tamu luar & kanopi', tag: 'Estimasi kelayakan',
      v: { harga: 250, kons: 80, tamb: 23, fee: 4.719, npop: 80, bphtb: 5, pph: 2.5, bn: 2.5, peneb: 83, unit: 40 } }
  ];
  const FLD = [
    ['harga', 'Harga jual', 'jt'], ['kons', 'Konstruksi', 'jt'], ['tamb', 'Tambahan konstruksi', 'jt'],
    ['fee', 'Fee marketing', 'jt'], ['npop', 'NPOPTKP (pengurang BPHTB)', 'jt'], ['bphtb', 'Tarif BPHTB', '%'],
    ['pph', 'Tarif PPh', '%'], ['bn', 'Balik nama', 'jt'], ['peneb', 'Penebusan', 'jt'],
    ['unit', 'Jumlah unit (jika semua unit opsi ini)', 'unit']
  ];
  const rp = n => (n < 0 ? '-' : '') + 'Rp' + Math.abs(Math.round(n)).toLocaleString('id-ID');
  const hit = v => {
    const harga = Math.round(v.harga * 1e6), kons = Math.round((v.kons + v.tamb) * 1e6), fee = Math.round(v.fee * 1e6);
    const bphtb = Math.round(Math.max(0, harga - v.npop * 1e6) * v.bphtb / 100), pph = Math.round(harga * v.pph / 100);
    const bn = Math.round(v.bn * 1e6), peneb = Math.round(v.peneb * 1e6);
    const total = harga - (kons + fee + bphtb + pph + bn), sisa = total - peneb;
    return { harga, kons, fee, bphtb, pph, bn, total, peneb, sisa, pct: harga ? sisa / harga * 100 : 0, all: sisa * v.unit };
  };
  const grid = $('#simgrid');
  grid.innerHTML = SIM.map(s => `<div class="sc ${s.c}"><h3>${s.title}<i>${s.tag}</i></h3>
    <div class="fields">${FLD.map(([k, l, u]) => `<label>${l}<span class="in"><input type="number" step="any" min="0" data-s="${s.c}" data-k="${k}" value="${s.v[k]}"><span class="u">${u}</span></span></label>`).join('')}</div>
    <table class="res" id="res-${s.c}"></table></div>`).join('');
  function simRender() {
    const r = SIM.map(s => hit(s.v));
    SIM.forEach((s, i) => {
      const x = r[i];
      $('#res-' + s.c).innerHTML = [
        ['Harga jual', rp(x.harga)], ['Konstruksi', rp(-x.kons)], ['Fee marketing', rp(-x.fee)], ['BPHTB', rp(-x.bphtb)],
        ['PPh', rp(-x.pph)], ['Balik nama', rp(-x.bn)]
      ].map(([a, b]) => `<tr><td>${a}</td><td>${b}</td></tr>`).join('') +
        `<tr class="t"><td>Total setelah pengeluaran akad</td><td>${rp(x.total)}</td></tr>` +
        `<tr><td>Penebusan</td><td>${rp(-x.peneb)}</td></tr>` +
        `<tr class="k"><td>Sisa per unit</td><td>${rp(x.sisa)}</td></tr>` +
        `<tr><td>Sisa dari harga jual</td><td>${x.pct.toLocaleString('id-ID', { maximumFractionDigits: 1 })}%</td></tr>` +
        `<tr><td>Sisa × ${s.v.unit} unit</td><td>${rp(x.all)}</td></tr>`;
    });
    const d = r[1].sisa - r[0].sisa, dh = r[1].harga - r[0].harga;
    $('#simdiff').innerHTML = `Selisih Opsi 2 terhadap Opsi 1 per unit: harga jual <b>${dh >= 0 ? '+' : ''}${rp(dh)}</b>, sisa setelah penebusan <b>${d >= 0 ? '+' : ''}${rp(d)}</b>.`;
  }
  grid.addEventListener('input', e => {
    const t = e.target; if (!t.dataset.k) return;
    SIM.find(s => s.c === t.dataset.s).v[t.dataset.k] = parseFloat(t.value) || 0;
    simRender();
  });
  simRender();

  /* Dapur: tab gambar + efek miring 3D */
  const kimg = $('#kimg');
  $$('.tabs button').forEach(b => b.addEventListener('click', () => {
    $$('.tabs button').forEach(x => x.classList.toggle('on', x === b));
    kimg.style.opacity = 0;
    setTimeout(() => { kimg.src = b.dataset.src; kimg.style.opacity = 1; }, 250);
  }));
  const tilt = $('#tilt');
  if (!calm) {
    tilt.addEventListener('mousemove', e => {
      const r = tilt.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - .5, y = (e.clientY - r.top) / r.height - .5;
      tilt.style.setProperty('--ry', (x * 12).toFixed(2) + 'deg');
      tilt.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
    });
    tilt.addEventListener('mouseleave', () => {
      tilt.style.setProperty('--rx', '0deg'); tilt.style.setProperty('--ry', '0deg');
    });
  }

  /* Harga: bar dan angka bergerak saat terlihat */
  const money = $('.money');
  new IntersectionObserver(([en], ob) => {
    if (!en.isIntersecting) return;
    ob.disconnect();
    $$('.bar').forEach(b => b.style.width = b.dataset.w + '%');
    $$('.cnt').forEach(c => {
      const to = +c.dataset.to, s = performance.now(), dur = calm ? 1 : 1600;
      (function step(n) {
        const k = Math.min((n - s) / dur, 1);
        c.textContent = Math.round(to * (1 - Math.pow(1 - k, 3)));
        if (k < 1) requestAnimationFrame(step);
      })(s);
    });
  }, { threshold: .4 }).observe(money);
})();
