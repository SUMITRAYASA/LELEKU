// Data awal aplikasi Leleku.
// Data ini hanya contoh untuk tampilan awal, belum disimpan ke database.

export const initialPonds = [
  {
    id: 1,
    name: "Kolam A",
    location: "Area Budidaya A",
    area: 20,
    fishCount: 1500,
    status: "Aktif",
  },
  {
    id: 2,
    name: "Kolam B",
    location: "Area Budidaya A",
    area: 25,
    fishCount: 2000,
    status: "Aktif",
  },
  {
    id: 3,
    name: "Kolam C",
    location: "Area Budidaya B",
    area: 15,
    fishCount: 1000,
    status: "Aktif",
  },
];

// Setiap catatan pertumbuhan dihubungkan ke kolam melalui pondId.
// Nilai pondId harus cocok dengan id pada initialPonds.
export const initialGrowthRecords = [
  {
    id: 101,
    pondId: 1,
    date: "2026-10-08",
    ph: 7.4,
    weight: 28.5,
    mortality: 2,
    notes: "Pemberian pakan berjalan normal.",
    createdAt: Date.now() - 15 * 60 * 1000,
  },
  {
    id: 102,
    pondId: 1,
    date: "2026-10-07",
    ph: 7.3,
    weight: 27.8,
    mortality: 1,
    notes: "Air kolam terlihat cukup jernih.",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 103,
    pondId: 1,
    date: "2026-10-06",
    ph: 7.2,
    weight: 27.1,
    mortality: 3,
    notes: "Perlu memperhatikan kondisi air.",
    createdAt: Date.now() - 3 * 60 * 60 * 1000,
  },
  {
    id: 104,
    pondId: 2,
    date: "2026-10-08",
    ph: 7.1,
    weight: 31.2,
    mortality: 4,
    notes: "Pemeriksaan kondisi kolam.",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
  },
  {
    id: 105,
    pondId: 3,
    date: "2026-10-08",
    ph: 7.6,
    weight: 24.8,
    mortality: 1,
    notes: "Kondisi ikan cukup baik.",
    createdAt: Date.now() - 2 * 60 * 60 * 1000,
  },
];
