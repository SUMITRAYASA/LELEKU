
import { useState } from "react";
import { Icon } from "@iconify/react";

import PondCard from "../../components/PondCard";
import PondFormModal from "../../components/PondFormModal";
import { useAppContext } from "../../context/AppContext";

function DashboardPage() {
  const {
    ponds,
    addPond,
    updatePond,
    deletePond,
  } = useAppContext();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPond, setSelectedPond] = useState(null);

  const activePonds = ponds.filter(
    (pond) => pond.status === "Aktif"
  ).length;

  const totalFish = ponds.reduce(
    (total, pond) => total + Number(pond.fishCount),
    0
  );

  const totalArea = ponds.reduce(
    (total, pond) => total + Number(pond.area),
    0
  );

  function openAddModal() {
    setSelectedPond(null);
    setIsModalOpen(true);
  }

  function openEditModal(pond) {
    setSelectedPond(pond);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setSelectedPond(null);
  }

  function handleSavePond(pondData) {
    if (selectedPond) {
      updatePond(selectedPond.id, pondData);
    } else {
      addPond(pondData);
    }

    closeModal();
  }

  function handleDeletePond(id) {
    const pond = ponds.find((item) => item.id === id);

    if (!pond) return;

    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus ${pond.name}?`
    );

    if (confirmed) {
      deletePond(id);
    }
  }

  return (
    <section className="space-y-6">
      {/* Banner dashboard */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[#2A835F] to-[#12544F] p-6 text-white md:p-7">
        <div className="relative z-10 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-white/70">
              Monitoring Tambak
            </p>

            <h2 className="mt-2 text-2xl font-bold">
              Dashboard
            </h2>

            <p className="mt-2 max-w-xl text-sm text-white/80">
              Pantau kondisi tambak dan kelola data kolam
              budidaya lele kamu.
            </p>
          </div>

          <button
            type="button"
            onClick={openAddModal}
            className="flex shrink-0 items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-semibold text-[#12544F] shadow-sm transition hover:bg-[#EDF5EF]"
          >
            <Icon icon="lucide:plus" width="19" />
            Tambah Kolam
          </button>
        </div>

        <div className="absolute -right-10 -top-20 h-64 w-64 rounded-full border border-white/10" />
        <div className="absolute -right-2 -top-12 h-48 w-48 rounded-full border border-white/10" />
      </div>

      {/* Statistik */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard
          icon="mdi:fish"
          label="Populasi Ikan"
          value={totalFish.toLocaleString("id-ID")}
          unit="ekor"
        />

        <StatCard
          icon="lucide:waves"
          label="Jumlah Kolam"
          value={ponds.length}
          unit="kolam"
        />

        <StatCard
          icon="lucide:check-circle"
          label="Kolam Aktif"
          value={activePonds}
          unit="kolam"
        />

        <StatCard
          icon="lucide:ruler"
          label="Total Luas"
          value={totalArea.toLocaleString("id-ID")}
          unit="m²"
        />
      </div>

      {/* Ringkasan kolam */}
      <div className="rounded-2xl border border-[#E1EBE4] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5">
          <h3 className="text-lg font-bold text-[#092328]">
            Ringkasan Kolam
          </h3>

          <p className="mt-1 text-sm text-[#7B9188]">
            Kelola informasi kolam yang terdaftar di tambak.
          </p>
        </div>

        {ponds.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
            {ponds.map((pond) => (
              <PondCard
                key={pond.id}
                pond={pond}
                onEdit={openEditModal}
                onDelete={handleDeletePond}
              />
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#C9DCD0] px-5 py-12 text-center">
            <Icon
              icon="lucide:waves"
              width="38"
              className="mx-auto text-[#8BBB92]"
            />

            <h4 className="mt-3 font-semibold text-[#092328]">
              Belum ada kolam
            </h4>

            <p className="mt-1 text-sm text-[#7B9188]">
              Tambahkan kolam pertama untuk memulai pencatatan.
            </p>

            <button
              type="button"
              onClick={openAddModal}
              className="mt-4 rounded-lg bg-[#176D57] px-4 py-2 text-sm font-semibold text-white hover:bg-[#12544F]"
            >
              Tambah Kolam
            </button>
          </div>
        )}
      </div>

      {/* Modal tambah / edit */}
      {isModalOpen && (
        <PondFormModal
          pond={selectedPond}
          onClose={closeModal}
          onSave={handleSavePond}
        />
      )}
    </section>
  );
}

function StatCard({ icon, label, value, unit }) {
  return (
    <div className="rounded-2xl border border-[#E1EBE4] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#E5F1E8] text-[#2A835F]">
          <Icon icon={icon} width="22" />
        </div>
      </div>

      <p className="mt-5 text-sm text-[#718780]">
        {label}
      </p>

      <p className="mt-1 text-2xl font-bold text-[#092328]">
        {value}{" "}
        <span className="text-xs font-normal text-[#718780]">
          {unit}
        </span>
      </p>
    </div>
  );
}

export default DashboardPage;