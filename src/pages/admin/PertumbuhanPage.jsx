
import { useState } from "react";
import { Icon } from "@iconify/react";

import GrowthTable from "../../components/GrowthTable";
import GrowthFormModal from "../../components/GrowthFormModal";
import { useAppContext } from "../../context/AppContext";

function PertumbuhanPage() {
  const {
    ponds,
    growthRecords,
    addGrowthRecord,
    updateGrowthRecord,
    deleteGrowthRecord,
  } = useAppContext();

  const [selectedPondId, setSelectedPondId] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  const selectedPond = ponds.find(
    (pond) => pond.id === selectedPondId
  );

  const pondRecords = growthRecords.filter(
    (record) => record.pondId === selectedPondId
  );

  const latestRecord = [...pondRecords].sort(
    (a, b) =>
      new Date(b.date).getTime() -
      new Date(a.date).getTime()
  )[0];

  function openAddModal() {
    setEditingRecord(null);
    setIsModalOpen(true);
  }

  function openEditModal(record) {
    if (Date.now() - record.createdAt >= 60 * 60 * 1000) {
      window.alert("Catatan sudah terkunci dan tidak dapat diedit.");
      return;
    }

    setEditingRecord(record);
    setIsModalOpen(true);
  }

  function closeModal() {
    setIsModalOpen(false);
    setEditingRecord(null);
  }

  function handleSave(recordData) {
    if (editingRecord) {
      updateGrowthRecord(editingRecord.id, recordData);
    } else {
      addGrowthRecord({
        ...recordData,
        pondId: selectedPondId,
      });
    }

    closeModal();
  }

  function handleDelete(id) {
    deleteGrowthRecord(id);
  }

  const statCards = [
    {
      label: "pH Terakhir",
      value: latestRecord ? latestRecord.ph : "—",
      icon: "lucide:droplets",
      unit: "",
    },
    {
      label: "Berat Rata-rata",
      value: latestRecord ? latestRecord.weight : "—",
      icon: "lucide:scale",
      unit: latestRecord ? "g" : "",
    },
    {
      label: "Mortalitas",
      value: latestRecord ? latestRecord.mortality : "—",
      icon: "lucide:chart-no-axes-column",
      unit: latestRecord ? "ekor" : "",
    },
    {
      label: "Populasi",
      value: selectedPond
        ? Number(selectedPond.fishCount).toLocaleString("id-ID")
        : "—",
      icon: "lucide:waves",
      unit: selectedPond ? "ekor" : "",
    },
  ];

  return (
    <section className="space-y-6">
      {/* Pilihan kolam */}
      <div className="rounded-2xl border border-[#E1EBE4] bg-white p-5 shadow-sm md:p-6">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[2px] text-[#718780]">
              Pertumbuhan
            </p>

            <h2 className="mt-2 text-xl font-bold text-[#092328]">
              Pilih Kolam
            </h2>

            <p className="mt-1 max-w-2xl text-sm text-[#718780]">
              Pilih kartu kolam untuk melihat detail dan riwayat
              pertumbuhannya.
            </p>
          </div>

          <p className="text-sm text-[#718780]">
            {ponds.length} kolam terdaftar
          </p>
        </div>

        {ponds.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ponds.map((pond) => {
              const isSelected = pond.id === selectedPondId;

              const latest = growthRecords
                .filter((record) => record.pondId === pond.id)
                .sort(
                  (a, b) =>
                    new Date(b.date).getTime() -
                    new Date(a.date).getTime()
                )[0];

              return (
                <button
                  key={pond.id}
                  type="button"
                  onClick={() => setSelectedPondId(pond.id)}
                  aria-pressed={isSelected}
                  className={`rounded-2xl border p-4 text-left transition ${
                    isSelected
                      ? "border-[#2A835F] bg-[#F7FBF8] ring-1 ring-[#2A835F]/30"
                      : "border-[#E1EBE4] bg-white hover:border-[#8BBB92] hover:bg-[#FAFCFA]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#E5F1E8] text-[#2A835F]">
                      <Icon icon="lucide:waves" width="22" />
                    </div>

                    {isSelected ? (
                      <span className="rounded-full bg-[#DDF0E3] px-2.5 py-1 text-xs font-semibold text-[#24744F]">
                        Dipilih
                      </span>
                    ) : (
                      <Icon
                        icon="lucide:circle"
                        width="18"
                        className="text-[#C7D8CD]"
                      />
                    )}
                  </div>

                  <h3 className="mt-4 font-bold text-[#092328]">
                    {pond.name}
                  </h3>

                  <p className="mt-1 text-sm text-[#718780]">
                    {pond.location}
                  </p>

                  <div className="mt-4 grid grid-cols-3 gap-2">
                    <PondMetric
                      label="pH"
                      value={latest ? latest.ph : "—"}
                    />

                    <PondMetric
                      label="Berat"
                      value={latest ? `${latest.weight} g` : "—"}
                    />

                    <PondMetric
                      label="Ikan"
                      value={Number(pond.fishCount).toLocaleString("id-ID")}
                    />
                  </div>
                </button>
              );
            })}
          </div>
        ) : (
          <div className="rounded-xl border border-dashed border-[#C9DCD0] p-8 text-center">
            <Icon
              icon="lucide:waves"
              width="32"
              className="mx-auto text-[#8BBB92]"
            />

            <p className="mt-3 font-semibold text-[#092328]">
              Belum ada kolam
            </p>

            <p className="mt-1 text-sm text-[#718780]">
              Tambahkan kolam melalui halaman Dashboard terlebih dahulu.
            </p>
          </div>
        )}
      </div>

      {/* Detail hanya muncul setelah kolam dipilih */}
      {!selectedPond ? (
        <div className="flex min-h-52 flex-col items-center justify-center rounded-2xl border border-dashed border-[#C9DCD0] bg-white px-6 py-10 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-[#E5F1E8] text-[#2A835F]">
            <Icon icon="lucide:waves" width="28" />
          </div>

          <h3 className="mt-4 font-bold text-[#092328]">
            Pilih kolam untuk melihat detail
          </h3>

          <p className="mt-2 max-w-md text-sm text-[#718780]">
            Detail kolam dan tabel riwayat pertumbuhan akan
            ditampilkan setelah kamu memilih salah satu kartu kolam di atas.
          </p>
        </div>
      ) : (
        <>
          {/* Detail kolam */}
          <div className="rounded-2xl border border-[#E1EBE4] bg-white p-5 shadow-sm md:p-6">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[2px] text-[#718780]">
                  Detail Kolam
                </p>

                <h2 className="mt-2 text-2xl font-bold text-[#092328]">
                  {selectedPond.name}
                </h2>

                <p className="mt-1 text-sm text-[#718780]">
                  {selectedPond.location} · Luas {selectedPond.area} m²
                </p>
              </div>

              <button
                type="button"
                onClick={openAddModal}
                className="flex items-center justify-center gap-2 rounded-xl bg-[#2A835F] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[#12544F]"
              >
                <Icon icon="lucide:plus" width="18" />
                Tambah Catatan
              </button>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {statCards.map((stat) => (
                <div
                  key={stat.label}
                  className="rounded-xl bg-[#F2F7F3] p-4"
                >
                  <div className="flex items-center gap-2 text-[#43876C]">
                    <Icon icon={stat.icon} width="17" />

                    <p className="text-xs font-semibold uppercase">
                      {stat.label}
                    </p>
                  </div>

                  <p className="mt-3 text-xl font-bold text-[#092328]">
                    {stat.value}{" "}
                    <span className="text-xs font-normal text-[#718780]">
                      {stat.unit}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Tabel riwayat */}
          <GrowthTable
            records={pondRecords}
            onEdit={openEditModal}
            onDelete={handleDelete}
          />
        </>
      )}

      {/* Form tambah / edit */}
      {isModalOpen && selectedPond && (
        <GrowthFormModal
          key={editingRecord?.id ?? "new-growth-record"}
          record={editingRecord}
          onClose={closeModal}
          onSave={handleSave}
        />
      )}
    </section>
  );
}

function PondMetric({ label, value }) {
  return (
    <div className="min-w-0 rounded-lg bg-[#F2F7F3] p-2.5">
      <p className="text-[10px] font-semibold uppercase tracking-wide text-[#7B9188]">
        {label}
      </p>

      <p className="mt-1 truncate text-xs font-bold text-[#29463D]">
        {value}
      </p>
    </div>
  );
}

export default PertumbuhanPage;