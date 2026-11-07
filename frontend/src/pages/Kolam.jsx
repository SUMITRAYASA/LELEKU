import { useState, useEffect } from "react";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { createPortal } from "react-dom";
import { useKolam } from "../utils/KolamContext";
import toast from "react-hot-toast";

import {
  Plus,
  Search,
  Pencil,
  Fish,
  Waves,
  Ruler,
  Skull,
  X,
  ImagePlus,
  ChevronLeft,
  ChevronRight,
  ArrowUpDown,
} from "lucide-react";

import StatCard from "../components/StatCard";

function Kolam() {
  // Mengatur tampilan modal
  const [showModal, setShowModal] = useState(false);

  // Mendapatkan tanggal hari ini berdasarkan waktu lokal
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    return `${year}-${month}-${day}`;
  };

  // State form kolam
  const [formData, setFormData] = useState({
    nama: "",
    luas: "",
    jumlahIkan: "",
    tanggal: getTodayDate(),
    gambar: null,
  });

  // ID kolam yang sedang dipilih
  const [selectedPondId, setSelectedPondId] = useState(null);

  // Mode modal
  const [modalMode, setModalMode] = useState("add");

  // Preview gambar
  const [preview, setPreview] = useState(null);

  const {
    getKolam,
    addKolam,
    updateKolam,
    deleteKolam,
  } = useKolam();

  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("terbaru");
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5;

  // Mengambil data kolam dari API sesuai filter dan halaman
  const {
    data: kolamResponse,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: [
      "kolam",
      {
        page: currentPage,
        limit: itemsPerPage,
        keyword: search,
        sort,
      },
    ],
    queryFn: () =>
      getKolam({
        page: currentPage,
        limit: itemsPerPage,
        keyword: search,
        sort,
      }),
    placeholderData: keepPreviousData,
  });

  // Data kolam dari respons Laravel
  const apiKolam = kolamResponse?.data ?? [];
  const pagination = kolamResponse?.meta;

  // Menyesuaikan format data API dengan tampilan
  const ponds = apiKolam.map((item) => ({
    id: item.id,
    nama: item.nama_kolam,
    luas: Number(item.luas_kolam),
    jumlahIkan: Number(item.jumlah_ikan_tebar),
    ikanMati: 0,
    tanggal: item.tanggal_tebar,
    gambar: item.gambar,
    status: item.status,
  }));

  // Mengambil statistik dari database
  const summary = kolamResponse?.summary;

  const totalKolam = Number(summary?.total_kolam ?? 0);
  const totalIkan = Number(summary?.total_ikan ?? 0);
  const totalLuas = Number(summary?.total_luas ?? 0);

  // Data mortalitas belum terintegrasi
  const totalMati = 0;

  // Jumlah halaman dari Laravel
  const totalPages = pagination?.last_page ?? 1;

  // Memastikan halaman aktif tetap tersedia
  useEffect(() => {
    if (
      pagination &&
      currentPage > pagination.last_page
    ) {
      setCurrentPage(
        Math.max(pagination.last_page, 1)
      );
    }
  }, [pagination?.last_page, currentPage]);

  // Data yang ditampilkan sudah dipaginasi oleh backend
  const displayedPonds = ponds;

  
  // Membuka modal tambah kolam
  const openModal = () => {
    setFormData({
      nama: "",
      luas: "",
      jumlahIkan: "",
      tanggal: getTodayDate(),
      gambar: null,
    });

    setPreview(null);
    setSelectedPondId(null);
    setModalMode("add");
    setShowModal(true);
  };

// Membuka modal detail sekaligus edit kolam
const openEditModal = (pond) => {
  setSelectedPondId(pond.id);

  setFormData({
    nama: pond.nama,
    luas: pond.luas,
    jumlahIkan: pond.jumlahIkan,
    tanggal: pond.tanggal,
    gambar: null,
  });

  setPreview(pond.gambar);
  setModalMode("edit");
  setShowModal(true);
};

// Menutup modal
const closeModal = () => {
  setShowModal(false);
  setSelectedPondId(null);
  setPreview(null);
};

// Menangani perubahan input
const handleChange = (e) => {
  const { name, value } = e.target;

  setFormData((prev) => ({
    ...prev,
    [name]: value,
  }));
};

// Menangani upload gambar
const handleImage = (e) => {
  const file = e.target.files[0];

  if (!file) return;

  if (!file.type.startsWith("image/")) {
    alert("File harus berupa gambar.");
    e.target.value = "";
    return;
  }

  setFormData((prev) => ({
    ...prev,
    gambar: file,
  }));

  setPreview(URL.createObjectURL(file));
};

// Menangani penyimpanan data
const handleSubmit = async (e) => {
  e.preventDefault();

  const data = new FormData();

  data.append("nama_kolam", formData.nama);
  data.append("luas_kolam", formData.luas);
  data.append("jumlah_ikan_tebar", formData.jumlahIkan);
  data.append("status", "aktif");

  // Tanggal hanya dikirim ketika menambah kolam
  if (modalMode === "add") {
    data.append("tanggal_tebar", formData.tanggal);
  }

  if (formData.gambar instanceof File) {
    data.append("gambar", formData.gambar);
  }

  try {
    if (modalMode === "add") {
      await addKolam.mutateAsync(data);
      toast.success("Kolam berhasil ditambahkan!");
    }

    if (modalMode === "edit") {
      await updateKolam.mutateAsync({
        id: selectedPondId,
        data,
      });

      toast.success("Data kolam berhasil diperbarui!");
    }

    setSearch("");
    setSort("terbaru");
    setCurrentPage(1);

    closeModal();
  } catch (error) {
    console.error("Kesalahan menyimpan kolam:", error);

    if (error.response?.status === 422) {
      const messages = Object.values(
        error.response.data.errors || {}
      ).flat();

      toast.error(messages[0] || "Periksa kembali data kolam.");
    } else {
      toast.error("Gagal menyimpan data kolam.");
    }
  }
};

// Menghapus kolam
const handleDelete = async () => {
  const pond = ponds.find(
    (item) => item.id === selectedPondId
  );

  if (!pond) return;

  const confirmed = window.confirm(
    `Apakah kamu yakin ingin menghapus ${pond.nama}?`
  );

  if (!confirmed) return;

  try {
    await deleteKolam.mutateAsync(selectedPondId);

    toast.success("Kolam berhasil dihapus!");

    closeModal();
  } catch (error) {
    console.error("Gagal menghapus kolam:", error);

    toast.error("Gagal menghapus data kolam.");
  }
};

// Mengunci scroll halaman ketika modal terbuka
useEffect(() => {
  if (showModal) {
    document.body.style.overflow = "hidden";
  }

  return () => {
    document.body.style.overflow = "";
  };
}, [showModal]);

if (isLoading) {
  return (
    <div className="p-8 text-center text-gray-500">
      Memuat data kolam dari server...
    </div>
  );
}

if (isError) {
  return (
    <div className="p-8 text-center text-red-600">
      Gagal mengambil data kolam:{" "}
      {error?.message || "Terjadi kesalahan."}
    </div>
  );
}

  const formatNumber = (number) =>
    new Intl.NumberFormat("id-ID").format(number);

  return (
    <div className="space-y-7">

      {/* Statistik dashboard */}
      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

        <StatCard
          title="Total Kolam"
          value={formatNumber(totalKolam)}
          description="Kolam terdaftar"
          icon={Waves}
        />

        <StatCard
          title="Total Ikan Lele"
          value={formatNumber(totalIkan)}
          description="Estimasi ikan hidup"
          icon={Fish}
        />

        <StatCard
          title="Total Luas Kolam"
          value={`${formatNumber(totalLuas)} m²`}
          description="Akumulasi luas kolam"
          icon={Ruler}
        />

        <StatCard
          title="Total Ikan Mati"
          value={formatNumber(totalMati)}
          description="Akumulasi kematian tercatat"
          icon={Skull}
        />

      </section>

      {/* Daftar kolam dan panel catatan */}
      <section className="grid grid-cols-1 items-start gap-5 xl:grid-cols-5">

        {/* Bagian daftar kolam */}
        <div className="min-w-0 xl:col-span-3">

        {/* Search, Sorting, dan Tambah Kolam */}
        <div className="mb-3 flex flex-col gap-3 sm:flex-row">

            {/* Search */}
            <div className="relative min-w-0 flex-1">

            <Search
                size={17}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
                type="text"
                placeholder="Cari nama kolam..."
                value={search}
                onChange={(e) => {
                setSearch(e.target.value);
                setCurrentPage(1);
                }}
                className="h-11 w-full rounded-xl border border-gray-200 bg-white pl-10 pr-4 text-sm outline-none transition focus:border-gray-400"
            />

            </div>

            {/* Sorting */}
            <div className="relative sm:w-32">

            <ArrowUpDown
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <select
                value={sort}
                onChange={(e) => {
                setSort(e.target.value);
                setCurrentPage(1);
                }}
                className="h-11 w-full appearance-none rounded-xl border border-gray-200 bg-white pl-9 pr-3 text-sm text-gray-600 outline-none focus:border-gray-400"
            >
                <option value="terbaru">Terbaru</option>
                <option value="terlama">Terlama</option>
                <option value="nama">Nama Kolam</option>
                <option value="luas">Luas Terbesar</option>
            </select>

            </div>

            {/* Tambah Kolam */}
            <button
            onClick={openModal}
            className="flex h-11 shrink-0 items-center justify-center gap-2 rounded-xl bg-gray-900 px-5 text-sm font-medium text-white transition hover:bg-gray-700"
            >
            <Plus size={17} />
            Tambah Kolam
            </button>

        </div>

        {/* List kolam */}
        <div className="space-y-3">

            {displayedPonds.length > 0 ? (
            displayedPonds.map((pond) => (
                <div
                key={pond.id}
                onClick={() => openEditModal(pond)}
                className="group flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 bg-white p-3 transition hover:border-gray-300 hover:shadow-sm"
                >

                {/* Gambar kolam */}
                <div className="h-[76px] w-[76px] shrink-0 overflow-hidden rounded-lg bg-gray-100">

                    {pond.gambar ? (
                    <img
                        src={pond.gambar}
                        alt={pond.nama}
                        className="h-full w-full object-cover"
                    />
                    ) : (
                    <div className="flex h-full w-full items-center justify-center text-gray-400">
                        <Waves size={27} strokeWidth={1.5} />
                    </div>
                    )}

                </div>

                
                {/* Informasi kolam */}
                <div className="min-w-0 flex-1">

                {/* Nama kolam */}
                <h4 className="truncate text-base font-semibold text-gray-900">
                    {pond.nama}
                </h4>

                {/* Detail kolam */}
                <div className="mt-2 grid grid-cols-3 gap-2">

                    {/* Total ikan */}
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                    <Fish size={14} className="shrink-0" />

                    <span className="truncate">
                        {formatNumber(
                        pond.jumlahIkan - pond.ikanMati
                        )} ikan
                    </span>
                    </div>

                    {/* Luas kolam */}
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                    <Ruler size={14} className="shrink-0" />

                    <span className="truncate">
                        {pond.luas} m²
                    </span>
                    </div>

                    {/* Tanggal dibuat */}
                    <div className="flex min-w-0 items-center gap-1.5 text-xs text-gray-500">
                    <span className="shrink-0">•</span>

                    <span className="truncate">
                        {new Date(
                        pond.tanggal + "T00:00:00"
                        ).toLocaleDateString("id-ID", {
                        day: "2-digit",
                        month: "short",
                        year: "numeric",
                        })}
                    </span>
                    </div>

                </div>

                </div>


                {/* Detail */}
                <button
                title="Edit Kolam"
                onClick={(e) => {
                    e.stopPropagation();
                    openEditModal(pond);
                }}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition hover:bg-gray-900 hover:text-white"
                >
                <Pencil size={17} />
                </button>

                </div>
            ))
            ) : (
            <div className="rounded-xl border border-dashed border-gray-300 py-12 text-center">

                <Waves size={30} className="mx-auto text-gray-300" />

                <p className="mt-3 text-sm font-medium text-gray-600">
                Kolam tidak ditemukan
                </p>

                <p className="mt-1 text-xs text-gray-400">
                Coba gunakan kata kunci lain.
                </p>

            </div>
            )}

        </div>

        {/* Pagination */}
        <div className="mt-4 flex items-center justify-between">

            <p className="text-xs text-gray-400">
              Menampilkan {pagination?.from ?? 0}
              {" - "}
              {pagination?.to ?? 0}
              {" dari "}
              {pagination?.total ?? 0} kolam
            </p>

            <div className="flex items-center gap-1">

            <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
                <ChevronLeft size={16} />
            </button>

            <span className="px-3 text-xs text-gray-600">
                {currentPage} / {totalPages}
            </span>

            <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className="flex h-8 w-8 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-500 hover:bg-gray-100 disabled:opacity-30"
            >
                <ChevronRight size={16} />
            </button>

            </div>

        </div>

        </div>

        {/* Panel catatan sebelah kanan */}
        <div className="xl:col-span-2">

        <div className="h-[calc(100vh-7rem)] min-h-[350px] rounded-2xl border border-gray-200 bg-white xl:sticky xl:top-24">

            {/* Area ini sengaja dikosongkan dahulu */}

          </div>

        </div>

      </section>


    {/* Modal Kolam */}
    {showModal &&
    createPortal(
        <div
        className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/50 p-4 backdrop-blur-[2px]"
        onClick={closeModal}
        >

        <div
            onClick={(e) => e.stopPropagation()}
            className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-6 shadow-2xl"
        >

            {/* Header Modal */}
            <div className="mb-5 flex items-center justify-between">

            <div>
                <h2 className="text-lg font-semibold text-gray-900">
                {modalMode === "add"
                  ? "Tambah Kolam"
                  : "Detail & Edit Kolam"}
                </h2>

                <p className="mt-1 text-xs text-gray-400">
                {modalMode === "add"
                  ? "Masukkan informasi kolam baru."
                  : "Lihat dan perbarui informasi kolam."}
                </p>
            </div>

            <button
                type="button"
                onClick={closeModal}
                className="rounded-full p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-900"
            >
                <X size={19} />
            </button>

            </div>

            {/* Form Kolam */}
            <form onSubmit={handleSubmit} className="space-y-4">

            {/* Upload Gambar */}
            <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                Gambar Kolam
                </label>

                <label
                className={`flex h-40 flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-gray-300 bg-gray-50 ${
                    modalMode !== "view"
                    ? "cursor-pointer transition hover:bg-gray-100"
                    : ""
                }`}
                >

                {preview ? (
                    <img
                    src={preview}
                    alt="Gambar kolam"
                    className="h-full w-full object-cover"
                    />
                ) : (
                    <>
                    <ImagePlus
                        size={30}
                        className="text-gray-400"
                    />

                    <p className="mt-2 text-sm font-medium text-gray-600">
                        {modalMode === "view"
                        ? "Belum ada gambar kolam"
                        : "Pilih gambar kolam"}
                    </p>

                    <p className="mt-1 text-xs text-gray-400">
                        PNG, JPG atau JPEG
                    </p>
                    </>
                )}

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  className="hidden"
                />

                </label>

            </div>

            {/* Nama Kolam */}
            <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                Nama Kolam
                </label>

                <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Contoh: Kolam Lele 01"
                required
                className="h-11 w-full rounded-xl border border-gray-200 px-4 text-sm outline-none transition focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-600"
                />

            </div>

            {/* Luas dan Jumlah Ikan */}
            <div className="grid grid-cols-2 gap-3">

                <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Luas Kolam (m²)
                </label>

                <input
                    type="number"
                    name="luas"
                    min="0.01"
                    step="0.01"
                    value={formData.luas}
                    onChange={handleChange}
                    placeholder="25"
                    required
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-600"
                />

                </div>

                <div>

                <label className="mb-2 block text-sm font-medium text-gray-700">
                    Jumlah Bibit
                </label>

                <input
                    type="number"
                    name="jumlahIkan"
                    min="1"
                    step="1"
                    value={formData.jumlahIkan}
                    onChange={handleChange}
                    placeholder="1000"
                    required
                    className="h-11 w-full rounded-xl border border-gray-200 px-3 text-sm outline-none focus:border-gray-500 disabled:bg-gray-50 disabled:text-gray-600"
                />

                </div>

            </div>

            {/* Tanggal Penebaran */}
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">
                Tanggal Penebaran Bibit
              </label>

              <input
                type="date"
                name="tanggal"
                value={formData.tanggal}
                disabled
                className="h-11 w-full cursor-not-allowed rounded-xl border border-gray-200 bg-gray-100 px-4 text-sm text-gray-500"
              />

              <p className="mt-1 text-xs text-gray-400">
                Tanggal ditetapkan otomatis dan tidak dapat diubah.
              </p>
            </div>

            {/* Tombol Modal */}
            <div className="flex justify-between gap-3 border-t border-gray-100 pt-5">

              {modalMode === "edit" ? (
                <>
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="rounded-xl border border-red-200 px-5 py-2.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                  >
                    Delete
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                  >
                    Simpan Perubahan
                  </button>
                </>
              ) : (
                <>
                  <button
                    type="button"
                    onClick={closeModal}
                    className="rounded-xl border border-gray-200 px-5 py-2.5 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="rounded-xl bg-gray-900 px-6 py-2.5 text-sm font-medium text-white transition hover:bg-gray-700"
                  >
                    Simpan Kolam
                  </button>
                </>
              )}

            </div>

            </form>

        </div>

        </div>,
        document.body
    )}


    </div>
  );
}

export default Kolam;
