
import { Icon } from "@iconify/react";

function PondCard({ pond, onEdit, onDelete }) {
  return (
    <article className="rounded-2xl border border-[#E1EBE4] bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#E5F1E8] text-[#2A835F]">
            <Icon icon="lucide:waves" width="23" />
          </div>

          <div>
            <h3 className="font-bold text-[#092328]">
              {pond.name}
            </h3>

            <p className="mt-1 text-sm text-[#7B9188]">
              {pond.location}
            </p>
          </div>
        </div>

        <span className="rounded-full bg-[#E5F1E8] px-3 py-1 text-xs font-medium text-[#24744F]">
          {pond.status}
        </span>
      </div>

      <div className="mt-5 grid grid-cols-2 gap-3">
        <div className="rounded-lg bg-[#F2F6F3] p-3">
          <p className="text-xs text-[#7B9188]">Luas Kolam</p>
          <p className="mt-1 font-bold text-[#092328]">
            {pond.area} m²
          </p>
        </div>

        <div className="rounded-lg bg-[#F2F6F3] p-3">
          <p className="text-xs text-[#7B9188]">Populasi Ikan</p>
          <p className="mt-1 font-bold text-[#092328]">
            {Number(pond.fishCount).toLocaleString("id-ID")} ekor
          </p>
        </div>
      </div>

      <div className="mt-4 flex justify-end gap-2 border-t border-[#E8EFEA] pt-4">
        <button
          type="button"
          onClick={() => onEdit(pond)}
          className="flex items-center gap-2 rounded-lg border border-[#D8E6DD] px-3 py-2 text-sm font-medium text-[#176D57] transition hover:bg-[#EDF5EF]"
        >
          <Icon icon="lucide:pencil" width="16" />
          Edit
        </button>

        <button
          type="button"
          onClick={() => onDelete(pond.id)}
          className="flex items-center gap-2 rounded-lg border border-[#F0D8D5] px-3 py-2 text-sm font-medium text-[#B54747] transition hover:bg-[#FFF1EF]"
        >
          <Icon icon="lucide:trash-2" width="16" />
          Hapus
        </button>
      </div>
    </article>
  );
}

export default PondCard;