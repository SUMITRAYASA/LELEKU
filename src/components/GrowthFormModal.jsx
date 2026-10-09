
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const emptyForm = {
  date: new Date().toLocaleDateString("en-CA"),
  ph: "",
  weight: "",
  mortality: "0",
  notes: "",
};

function GrowthFormModal({
  record,
  onClose,
  onSave,
}) {
  const [formData, setFormData] = useState(emptyForm);
  const [error, setError] = useState("");

  const isEditing = Boolean(record);

  useEffect(() => {
    if (record) {
      setFormData({
        date: record.date,
        ph: String(record.ph),
        weight: String(record.weight),
        mortality: String(record.mortality),
        notes: record.notes ?? "",
      });
    } else {
      setFormData(emptyForm);
    }

    setError("");
  }, [record]);

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
      !formData.date ||
      formData.ph === "" ||
      formData.weight === "" ||
      formData.mortality === ""
    ) {
      setError("Lengkapi tanggal, pH, berat, dan mortalitas.");
      return;
    }

    const ph = Number(formData.ph);
    const weight = Number(formData.weight);
    const mortality = Number(formData.mortality);

    if (
      !Number.isFinite(ph) ||
      ph < 0 ||
      ph > 14 ||
      !Number.isFinite(weight) ||
      weight <= 0 ||
      !Number.isInteger(mortality) ||
      mortality < 0
    ) {
      setError(
        "Periksa kembali pH (0–14), berat, dan mortalitas."
      );
      return;
    }

    onSave({
      ...formData,
      ph,
      weight,
      mortality,
      notes: formData.notes.trim(),
    });
  }

  const inputClass =
    "w-full rounded-lg border border-[#DCE7DF] bg-white px-3 py-2.5 text-sm outline-none focus:border-[#2A835F] focus:ring-2 focus:ring-[#2A835F]/10";

  const labelClass =
    "mb-1.5 block text-sm font-medium text-[#29463D]";

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center overflow-y-auto bg-[#092328]/50 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        role="dialog"
        aria-modal="true"
        aria-labelledby="growth-modal-title"
        className="my-auto w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl"
      >
        <div className="mb-6 flex items-start justify-between gap-3">
          <div>
            <h2
              id="growth-modal-title"
              className="text-xl font-bold text-[#092328]"
            >
              {isEditing
                ? "Edit Catatan Pertumbuhan"
                : "Tambah Catatan Pertumbuhan"}
            </h2>

            <p className="mt-1 text-sm text-[#718780]">
              Catatan hanya dapat diedit selama satu jam
              setelah dibuat.
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup formulir"
            className="rounded-lg p-2 text-[#718780] hover:bg-[#F2F6F3]"
          >
            <Icon icon="lucide:x" width="20" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="growth-date" className={labelClass}>
              Tanggal pengukuran
            </label>

            <input
              id="growth-date"
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="growth-ph" className={labelClass}>
                pH air
              </label>

              <input
                id="growth-ph"
                type="number"
                name="ph"
                min="0"
                max="14"
                step="0.1"
                value={formData.ph}
                onChange={handleChange}
                placeholder="7.4"
                className={inputClass}
                required
              />
            </div>

            <div>
              <label
                htmlFor="growth-weight"
                className={labelClass}
              >
                Berat rata-rata (g)
              </label>

              <input
                id="growth-weight"
                type="number"
                name="weight"
                min="0.01"
                step="any"
                value={formData.weight}
                onChange={handleChange}
                placeholder="28.5"
                className={inputClass}
                required
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="growth-mortality"
              className={labelClass}
            >
              Mortalitas (ekor)
            </label>

            <input
              id="growth-mortality"
              type="number"
              name="mortality"
              min="0"
              step="1"
              value={formData.mortality}
              onChange={handleChange}
              className={inputClass}
              required
            />
          </div>

          <div>
            <label
              htmlFor="growth-notes"
              className={labelClass}
            >
              Catatan
            </label>

            <textarea
              id="growth-notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Tuliskan kondisi air, pemberian pakan, atau pengamatan lainnya..."
              rows={3}
              className={inputClass}
            />
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
              {isEditing ? "Simpan Perubahan" : "Simpan Catatan"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default GrowthFormModal;