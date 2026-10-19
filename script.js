const dataMahasiswa = [
    { nama: "Cindu", nilai: 85, kehadiran: 90 },
    { nama: "Andi", nilai: 78, kehadiran: 85 },
    { nama: "Budi", nilai: 65, kehadiran: 80 },
    { nama: "Siti", nilai: 92, kehadiran: 95 },
    { nama: "Rina", nilai: 55, kehadiran: 70 }
];

// Function 1: Menghitung rata-rata
function hitungRataRata(data) {
    let total = 0;

    data.forEach(function (mhs) {
        total += mhs.nilai;
    });

    return total / data.length;
}

// Function 2: Mencari mahasiswa yang lulus
function cariMahasiswaLulus(data) {
    return data.filter(function (mhs) {
        return mhs.nilai >= 70 && mhs.kehadiran >= 75;
    });
}

// Menampilkan data menggunakan perulangan
console.log("=== DATA MAHASISWA ===");

for (const mhs of dataMahasiswa) {
    let kategori;

    if (mhs.nilai >= 85) {
        kategori = "A";
    } else if (mhs.nilai >= 70) {
        kategori = "B";
    } else {
        kategori = "D";
    }

    console.log(
        mhs.nama,
        "| Nilai:", mhs.nilai,
        "| Kategori:", kategori
    );
}

// Menampilkan hasil pengolahan
console.log("Rata-rata nilai:",
    hitungRataRata(dataMahasiswa).toFixed(2)
);

console.log("Mahasiswa lulus:",
    cariMahasiswaLulus(dataMahasiswa)
);

// Operator logika OR
const perluEvaluasi = dataMahasiswa.filter(function (mhs) {
    return mhs.nilai < 70 || mhs.kehadiran < 75;
});

console.log("Perlu evaluasi:", perluEvaluasi);
/* PENCARIAN MATA KULIAH PADA TABEL NILAI */

const inputCariNilai = document.getElementById("cariNilai");

if (inputCariNilai) {
    inputCariNilai.addEventListener("input", function () {
        const kataKunci = this.value.trim().toLowerCase();

        // Cari tabel nilai mata kuliah milik sendiri
        const semuaTabel = document.querySelectorAll("table");
        let tabelNilai = null;

        semuaTabel.forEach(function (tabel) {
            const judul = tabel.closest("section")?.innerText || "";

            if (judul.includes("Daftar Nilai Mata Kuliah")) {
                tabelNilai = tabel;
            }
        });

        if (!tabelNilai) return;

        const baris = Array.from(
            tabelNilai.querySelectorAll("tbody tr")
        );

        // Cocokkan kata kunci dengan nama mata kuliah
        const hasilCocok = [];
        const hasilLain = [];

        baris.forEach(function (tr) {
            const namaSel = tr.cells[2];
            if (!namaSel) return;

            const namaMatkul = namaSel.textContent.toLowerCase();

            if (kataKunci && namaMatkul.includes(kataKunci)) {
                hasilCocok.push(tr);
            } else {
                hasilLain.push(tr);
            }
        });

        // Tampilkan hasil yang cocok di urutan paling atas
        const tbody = tabelNilai.querySelector("tbody");

        [...hasilCocok, ...hasilLain].forEach(function (tr) {
            tbody.appendChild(tr);
        });

        // Tandai hasil yang cocok tanpa menghilangkan data lain
        baris.forEach(function (tr) {
            tr.classList.toggle(
                "table-primary",
                kataKunci !== "" &&
                hasilCocok.includes(tr)
            );
        });
    });
}
/* Interaksi DOM: menambahkan data mata kuliah */
const formTambahNilai = document.getElementById("formTambahNilai");
const pesanNilai = document.getElementById("pesanNilai");

formTambahNilai.addEventListener("submit", function (event) {
    event.preventDefault();

    const kode = document.getElementById("kodeBaru").value.trim();
    const nama = document.getElementById("namaBaru").value.trim();
    const semester = document.getElementById("semesterBaru").value;
    const sks = document.getElementById("sksBaru").value;
    const nilai = document.getElementById("nilaiBaru").value;

    // Pastikan semua data sudah diisi
    if (!kode || !nama || !semester || !sks || !nilai) {
    pesanNilai.textContent = "Semua data wajib diisi.";
    pesanNilai.className = "text-danger mt-3";
    return;
}

// Validasi angka
if (
    Number(semester) < 1 || Number(semester) > 14 ||
    Number(sks) < 1 || Number(sks) > 6
) {
    pesanNilai.textContent = "Semester harus 1–14 dan SKS harus 1–6.";
    pesanNilai.className = "text-danger mt-3";
    return;
}

// Cegah kode mata kuliah yang sama
const kodeSudahAda = Array.from(
    document.querySelectorAll("#nilai table tbody tr")
).some(function (baris) {
    return baris.cells[1].textContent.trim().toLowerCase() === kode.toLowerCase();
});

if (kodeSudahAda) {
    pesanNilai.textContent = "Kode mata kuliah sudah terdaftar.";
    pesanNilai.className = "text-danger mt-3";
    return;
}

    // Ambil tabel nilai yang sudah ada
    const tabel = document.querySelector("#nilai table");
    const tbody = tabel.querySelector("tbody");

    // Buat baris baru menggunakan DOM
    const barisBaru = document.createElement("tr");

    const nomor = tbody.querySelectorAll("tr").length + 1;

    barisBaru.innerHTML = `
        <td class="text-center">${nomor}</td>
        <td></td>
        <td></td>
        <td class="text-center"></td>
        <td class="text-center"></td>
        <td class="text-center"></td>
    `;

    // Gunakan textContent agar input teks tidak dianggap sebagai HTML
    barisBaru.cells[1].textContent = kode;
    barisBaru.cells[2].textContent = nama;
    barisBaru.cells[3].textContent = semester;
    barisBaru.cells[4].textContent = sks;

    const badge = document.createElement("span");
    badge.className = "badge bg-success";
    badge.textContent = nilai;
    barisBaru.cells[5].appendChild(badge);
    // Membuat tombol hapus pada data baru
    const tombolHapus = document.createElement("button");
    tombolHapus.type = "button";
    tombolHapus.className = "btn btn-danger btn-sm ms-2";
    tombolHapus.textContent = "Hapus";

    baris.cells[5].appendChild(tombolHapus);

    tbody.appendChild(barisBaru);

    pesanNilai.textContent = "Data mata kuliah berhasil ditambahkan!";
    pesanNilai.className = "text-success mt-3";

    formTambahNilai.reset();
});
/* Interaksi DOM: menghapus mata kuliah */
const tabelHapus = document.querySelector("#nilai table");
const badanTabel = tabelHapus.querySelector("tbody");

// Tambahkan tombol hapus pada data yang sudah ada
badanTabel.querySelectorAll("tr").forEach(function (baris) {
    const selNilai = baris.cells[5];

    const tombol = document.createElement("button");
    tombol.type = "button";
    tombol.className = "btn btn-danger btn-sm ms-2";
    tombol.textContent = "Hapus";

    selNilai.appendChild(tombol);
});

// Event klik untuk menghapus baris
tabelHapus.addEventListener("click", function (event) {
    if (event.target.matches("button.btn-danger")) {
        const baris = event.target.closest("tr");

        if (baris && confirm("Yakin ingin menghapus mata kuliah ini?")) {
            baris.remove();

            // Perbarui nomor urut
            badanTabel.querySelectorAll("tr").forEach(function (tr, indeks) {
                tr.cells[0].textContent = indeks + 1;
            });
        }
    }
});
/* Fitur jQuery: animasi tabel nilai */
$(document).ready(function () {
    $("#animasiNilai").on("click", function () {
        $("#nilai .card.border-0.shadow-lg")
            .stop(true, true)
            .fadeToggle(500);
    });
});