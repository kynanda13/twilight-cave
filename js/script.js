// Fitur Search dan Filter Kategori 
const cari = document.getElementById("cari");
const kategori = document.getElementById("kategori");
const kartu = document.querySelectorAll(".menu-card");
const menuKosong = document.getElementById("menu-kosong");

function filterMenu() {
  const kata = cari.value.trim().toLowerCase();
  const pilihan = kategori.value;
  let jumlahTampil = 0;

  kartu.forEach(function (k) {
    const cocokNama = k.dataset.nama.toLowerCase().includes(kata);
    const cocokKategori = pilihan === "semua" || k.dataset.kategori === pilihan;
    const tampil = cocokNama && cocokKategori;
    k.hidden = !tampil;
    if (tampil) jumlahTampil++;
  });

  menuKosong.hidden = jumlahTampil !== 0;
}

cari.addEventListener("input", filterMenu);
kategori.addEventListener("change", filterMenu);

// Validasi Form Reservasi
const form = document.getElementById("form");
const hasil = document.getElementById("form-hasil");

// Jam buka per hari (0 = Minggu ... 6 = Sabtu)
const jamBuka = {
  0: ["09:00", "22:00"],
  1: ["09:00", "22:00"],
  2: ["09:00", "22:00"],
  3: ["09:00", "22:00"],
  4: ["09:00", "22:00"],
  5: ["14:00", "23:00"],
  6: ["09:00", "23:00"]
};

function formatTanggal(d) {
  const bln = String(d.getMonth() + 1).padStart(2, "0");
  const tgl = String(d.getDate()).padStart(2, "0");
  return d.getFullYear() + "-" + bln + "-" + tgl;
}

// Reservasi minimal 1 hari sebelum
const besok = new Date();
besok.setDate(besok.getDate() + 1);
const tanggalMin = formatTanggal(besok);
document.getElementById("tanggal").min = tanggalMin;

function setError(id, pesan) {
  document.getElementById("err-" + id).textContent = pesan;
  document.getElementById(id).classList.toggle("invalid", pesan !== "");
}

form.addEventListener("submit", function (e) {
  e.preventDefault();
  hasil.hidden = true;
  let valid = true;

  const nama = document.getElementById("nama").value.trim();
  const tanggal = document.getElementById("tanggal").value;
  const jam = document.getElementById("jam").value;
  const jumlah = parseInt(document.getElementById("jumlah").value, 10);

  // Nama
  if (nama === "") {
    setError("nama", "Nama wajib diisi.");
    valid = false;
  } else {
    setError("nama", "");
  }

  // Tanggal
  if (tanggal === "") {
    setError("tanggal", "Tanggal wajib diisi.");
    valid = false;
  } else if (tanggal < tanggalMin) {
    setError("tanggal", "Reservasi minimal 1 hari sebelumnya. Pilih tanggal mulai " + tanggalMin + ".");
    valid = false;
  } else {
    setError("tanggal", "");
  }

  // Jam (disesuaikan dengan hari yang dipilih)
  if (jam === "") {
    setError("jam", "Jam wajib diisi.");
    valid = false;
  } else if (tanggal !== "") {
    const hari = new Date(tanggal + "T00:00:00").getDay();
    const buka = jamBuka[hari][0];
    const tutup = jamBuka[hari][1];
    if (jam < buka || jam > tutup) {
      setError("jam", "Jam buka hari itu " + buka + " - " + tutup + ".");
      valid = false;
    } else {
      setError("jam", "");
    }
  } else {
    setError("jam", "");
  }

  // Jumlah orang
  if (isNaN(jumlah) || jumlah < 4) {
    setError("jumlah", "Jumlah orang minimal 4.");
    valid = false;
  } else {
    setError("jumlah", "");
  }

  // Konfirmasi.Website belum punya backend
  if (valid) {
    hasil.textContent = "Data reservasi sudah Diterima.";
    hasil.hidden = false;
  }
});

// kembali ke atas
const tombolAtas = document.getElementById("to-top");

window.addEventListener("scroll", function () {
  tombolAtas.classList.toggle("show", window.scrollY > 300);
});

tombolAtas.addEventListener("click", function () {
  window.scrollTo({ top: 0, behavior: "smooth" });
});
