(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const nav = $('#nav');
  addEventListener('scroll', () => nav.classList.toggle('solid', scrollY > 40), { passive: true });

  /* Angka utama bergerak saat terlihat */
  const run = el => {
    const to = +el.dataset.to, dec = +(el.dataset.dec || 0), pre = el.dataset.pre || '', suf = el.dataset.suf || '';
    const fmt = v => pre + v.toLocaleString('id-ID', { minimumFractionDigits: dec, maximumFractionDigits: dec }) + suf;
    if (calm) { el.textContent = fmt(to); return; }
    const t0 = performance.now();
    (function step(n) {
      const k = Math.min((n - t0) / 1400, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(step);
    })(t0);
  };
  const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { run(e.target); io.unobserve(e.target); } }), { threshold: .6 });
  $$('.fig b').forEach(b => io.observe(b));

  /* Daftar sumber */
  const SRC = [
    ['UMK Jatim 2026 (Kepgub 100.3.3.1/937/013/2025)', 'https://www.detik.com/jatim/bisnis/d-8277107/resmi-ini-besaran-umk-2026-se-jawa-timur'],
    ['Kenaikan UMK Kab. Malang 7,02%', 'https://dealls.com/pengembangan-karir/UMK-Malang'],
    ['BPS: rata-rata upah buruh Feb 2026', 'https://www.bps.go.id/id/pressrelease/2026/05/05/2574/tingkat-pengangguran-terbuka--tpt--sebesar-4-68-persen--rata-rata-upah-buruh-sebesar-3-29-juta-rupiah'],
    ['BPS: ketenagakerjaan Agustus 2025 (TPT 4,85%, upah Rp3,33 jt)', 'https://www.bps.go.id/id/pressrelease/2025/11/05/2479/keadaan-ketenagakerjaan-.html'],
    ['Penduduk Kab. Malang 2,73 juta (2024) dan kemiskinan', 'https://databoks.katadata.co.id/datapublish/2024/07/24/8-98-penduduk-di-kabupaten-malang-masuk-kategori-miskin'],
    ['BPS Kab. Malang: penduduk miskin Maret 2025 dan garis kemiskinan', 'https://malangkab.bps.go.id/en/pressrelease/2025/09/16/245/jumlah-penduduk-miskin-kabupaten-malang-pada-bulan-maret-2025-mencapai-235-63-ribu-jiwa.html'],
    ['Kemiskinan Kab. Malang 2025 turun ke 8,78%', 'https://timesindonesia.co.id/flash-news/575111/angka-kemiskinan-di-kabupaten-malang-2025-mengalami-penurunan'],
    ['Pengeluaran per kapita Kab. Malang 2025 (Susenas)', 'https://databoks.katadata.co.id/layanan-konsumen-kesehatan/statistik/3749cecbc9d6ed5/pengeluaran-per-kapita-kabupaten-malang'],
    ['Pertumbuhan ekonomi Kab. Malang 2025 (5,92%)', 'https://databoks.katadata.co.id/en/economics-macro/statistics/cb55ef07e141c28/malang-regency-economic-growth-corporate-services-sector-reached-904-in-2025'],
    ['Rata-rata lama sekolah Kab. Malang 2025', 'https://databoks.katadata.co.id/layanan-konsumen-kesehatan/statistik/c9d5b669970be0e/ratarata-lama-sekolah-di-malang-naik-menjadi-798-tahun'],
    ['Penduduk Kota Malang 885,27 ribu (2024)', 'https://databoks.katadata.co.id/datapublish/2024/11/11/jumlah-penduduk-kota-malang-885-27-ribu-jiwa-data-per-2024'],
    ['Kepadatan penduduk Kab. Malang (kutipan BPS)', 'https://repository.upnjatim.ac.id/53289/1/22051010066.-bab1.pdf'],
    ['Penduduk Kec. Pakis SP2010 dan SP2020, luas wilayah (tabel kecamatan)', 'https://kaweah.freedombox.rocks/kiwix/wikipedia_en_all_maxi_2023-10/Malang_Regency'],
    ['KPU: DPT Kab. Malang 2024 (Kec. Pakis)', 'https://jdih.kpu.go.id/data-kabko/malang/data_kepkpud/2024kpt1829.pdf'],
    ['Penduduk Kedungkandang dan Kota Malang (kutipan BPS Kota Malang)', 'https://eprints.umm.ac.id/id/eprint/13679/4/BAB%20III%20.pdf'],
    ['Permendagri 17/2012: batas Kab. dan Kota Malang', 'https://pemerintahan.malangkota.go.id/wp-content/uploads/sites/7/2019/06/Permendagri-No.-17-th-2012-ttg-Batas-Daerah-Kabupaten-Malang-dengan-Kota-Malang-Provinsi-Jawa-Timur-font-10-converted.pdf'],
    ['Profil Desa Sumberkradenan (ensiklopedia, bukan sumber resmi)', 'https://p2k.stekom.ac.id/ensiklopedia/Sumberkradenan,_Pakis,_Malang'],
    ['Jembatan Kali Jilu Ampeldento–Sumberkradenan', 'https://jatimtimes.com/baca/296761/20230918/213400/privacy'],
    ['Backlog kepemilikan rumah Mar 2026 (BPS Susenas)', 'https://katadata.co.id/amp/berita/nasional/6a7dc9b66d4ba/sembilan-juta-keluarga-belum-punya-rumah-18-juta-belum-tinggal-di-rumah-layak'],
    ['Backlog dan rumah tidak layak per provinsi (BPS)', 'https://www.gebrak.id/2026/06/krisis-hunian-masih-membayangi-964-juta.html'],
    ['Rumah tangga Kab. Malang berstatus milik sendiri (kutipan BPS Jatim)', 'https://eprints.umm.ac.id/id/eprint/22305/50/BAB%20I.pdf'],
    ['Alokasi bedah rumah Jatim 2026 (Kementerian PKP)', 'https://malang-post.com/2026/08/11/kuota-bedah-rumah-warga-kota-malang-berpotensi-bertambah/'],
    ['Realisasi rumah subsidi Jatim pertengahan 2026', 'https://malang-post.com/2026/07/02/menteri-maruarar-sirait-beri-nilai-85-untuk-rumah-subsidi-di-lawang/'],
    ['Akad massal 71.000 unit FLPP di Malang, target 350 ribu unit', 'https://www.antaranews.com/berita/5779161/menteri-pkp-siapkan-dua-akad-massal-rumah-subsidi-pada-desember-2026'],
    ['BTN dan penyaluran FLPP di Jatim', 'https://jatimtimes.com/baca/353686/20260126/172500/btn-dan-rumah-rakyat-antara-target-negara-kritik-pengembang-dan-akses-masyarakat'],
    ['Batas harga rumah subsidi Rp166 jt', 'https://databoks.katadata.co.id/properti/statistik/6a3cf21c04022/kisaran-harga-rumah-subsidi-bp-tapera'],
    ['FLPP 5%, tenor 40 th, skema KPR 6%, PPN DTP', 'https://www.infobalinews.id/2026/10/07/pemerintah-siapkan-kpr-subsidi-bunga-6-persen-untuk-pekerja-gaji-rp17-juta/index.html'],
    ['Skema KPR 6%: belum ada tanggal berlaku', 'https://voi.id/ekonomi/596446/pekerja-bergaji-tetap-rp17-juta-bakal-bisa-ambil-kpr-subsidi-bunga-6-persen'],
    ['BI-Rate 5,75% (RDG Okt 2026)', 'https://www.antaranews.com/foto/5802217/bi-pertahankan-suku-bunga-acuan-575-persen-pada-oktober-2026'],
    ['Bunga kredit dan transmisi BI-Rate (OJK)', 'https://keuangan.kontan.co.id/news/bunga-kredit-belum-banyak-bergerak-bank-menanti-arah-kebijakan-bi?page=all'],
    ['Bunga KPR floating semester II 2026', 'https://keuangan.kontan.co.id/news/likuiditas-bank-ketat-begini-bunga-floating-kpr'],
    ['Listing Pakis: Pandawa Rp166 jt, promo 200 jt-an', 'https://www.rumah123.com/jual/malang/pakis/dp-0/rumah/'],
    ['Listing Pakis One Rp288 jt dan Rp325 jt', 'https://www.rumah123.com/jual/malang/pakis/semi-furnished/rumah/'],
    ['Listing Kedungrejo Rp153 jt dan Cluster Exclusive Rp300 jt', 'https://rumah.trovit.co.id/perumahan-kabupaten-malang/47'],
    ['Listing rumah dekat exit tol Pakis Rp270 jt', 'https://www.rumah123.com/properti/malang-pakis/rumah-di-dekat-exit-tol-pakis-malang-hos19503865/'],
    ['Listing kavling dekat exit tol Pakis', 'https://www.rumah123.com/properti/malang-pakis/shm-3-menit-exit-tol-pakis-malang-jual-kavling-las9199921/'],
    ['Banjir 14 Maret 2022 di 4 desa Kec. Pakis', 'https://jatim.antaranews.com/berita/585065/pemkab-malang-data-kerugian-banjir-di-kecamatan-pakis'],
    ['Excel Pengeluaran_Akad_rumah_murah.xlsx (data internal)', '#']
  ];
  $('#srcl').innerHTML = SRC.map(([t, u]) => `<li>${u === '#' ? t : `<a href="${u}" target="_blank" rel="noopener">${t}</a>`}</li>`).join('');
})();
