
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const emptyForm = {
  name: "",
  location: "",
  area: "",
  fishCount: "",
  status: "Aktif",
};

function PondFormModal({ pond, onClose, onSave }) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(pond);

  useEffect(() => {
    if (pond) {
      setFormData({
        name: pond.name,
        location: pond.location,
        area: String(pond.area),
        fishCount: String(pond.fishCount),
        status: pond.status,
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [pond]);

  function handleChange(event) {
    const { name, value } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.location.trim() ||
      formData.area === "" ||
      formData.fishCount === ""
    ) {
      setError("Semua kolom wajib diisi.");
      return;
    }

    if (
      Number(formData.area) <= 0 ||
      Number(formData.fishCount) < 0 ||
      !Number.isFinite(Number(formData.area)) ||
      !Number.isFinite(Number(formData.fishCount))
    ) {
      setError("Luas harus lebih dari 0 dan populasi tidak boleh negatif.");
      return;
    }

    onSave({
      ...formData,
      name: formData.name.trim(),
      location: formData.location.trim(),
    });
  }

  return (
    <div
      className="fixed inset-0 z-[60] flex items-center justify-center overflow-y-auto bg-[#092328]/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="pond-modal-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2
              id="pond-modal-title"
              className="text-xl font-bold text-[#092328]"
            >
              {isEditing ? "Edit Kolam" : "Tambah Kolam"}
            </h2>

            <p className="mt-1 text-sm text-[#7B9188]">
              Masukkan informasi dasar kolam.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="rounded-lg p-2 text-[#718780] hover:bg-[#F2F6F3]"
          >
            <Icon icon="lucide:x" width="21" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="pond-name"
              className="mb-1.5 block text-sm font-medium text-[#29463D]"
            >
              Nama kolam
            </label>

            <input
              id="pond-name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Contoh: Kolam D"
              className="w-full rounded-lg border border-[#DCE7DF] px-3 py-2.5 outline-none focus:border-[#2A835F] focus:ring-2 focus:ring-[#2A835F]/10"
            />
          </div>

          <div>
            <label
              htmlFor="pond-location"
              className="mb-1.5 block text-sm font-medium text-[#29463D]"
            >
              Lokasi kolam
            </label>

            <input
              id="pond-location"
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="Contoh: Area Utara"
              className="w-full rounded-lg border border-[#DCE7DF] px-3 py-2.5 outline-none focus:border-[#2A835F] focus:ring-2 focus:ring-[#2A835F]/10"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label
                htmlFor="pond-area"
                className="mb-1.5 block text-sm font-medium text-[#29463D]"
              >
                Luas (m²)
              </label>

              <input
                id="pond-area"
                name="area"
                type="number"
                min="0.01"
                step="any"
                value={formData.area}
                onChange={handleChange}
                placeholder="100"
                className="w-full rounded-lg border border-[#DCE7DF] px-3 py-2.5 outline-none focus:border-[#2A835F] focus:ring-2 focus:ring-[#2A835F]/10"
              />
            </div>

            <div>
              <label
                htmlFor="pond-fish-count"
                className="mb-1.5 block text-sm font-medium text-[#29463D]"
              >
                Populasi (ekor)
              </label>

              <input
                id="pond-fish-count"
                name="fishCount"
                type="number"
                min="0"
                step="1"
                value={formData.fishCount}
                onChange={handleChange}
                placeholder="3500"
                className="w-full rounded-lg border border-[#DCE7DF] px-3 py-2.5 outline-none focus:border-[#2A835F] focus:ring-2 focus:ring-[#2A835F]/10"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="pond-status"
              className="mb-1.5 block text-sm font-medium text-[#29463D]"
            >
              Status kolam
            </label>

            <select
              id="pond-status"
              name="status"
              value={formData.status}
              onChange={handleChange}
              className="w-full rounded-lg border border-[#DCE7DF] bg-white px-3 py-2.5 outline-none focus:border-[#2A835F]"
            >
              <option value="Aktif">Aktif</option>
              <option value="Istirahat">Istirahat</option>
            </select>
          </div>

          {error && (
            <p
              role="alert"
              className="rounded-lg bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </p>
          )}

          <div className="flex justify-end gap-3 border-t border-[#E8EFEA] pt-4">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-[#DCE7DF] px-4 py-2.5 text-sm font-medium text-[#526B61] hover:bg-[#F5F8F5]"
            >
              Batal
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#176D57] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#12544F]"
            >
              {isEditing ? "Simpan Perubahan" : "Simpan Kolam"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default PondFormModal;