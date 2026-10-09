
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";

const EDIT_WINDOW = 60 * 60 * 1000;

function GrowthTable({ records, onEdit, onDelete }) {
  const [search, setSearch] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [now, setNow] = useState(Date.now());

  // Memperbarui status secara otomatis ketika waktu berjalan.
  useEffect(() => {
    const timer = setInterval(() => {
      setNow(Date.now());
    }, 10000);

    return () => clearInterval(timer);
  }, []);

  const filteredRecords = records
    .filter((record) => {
      const keyword = search.trim().toLowerCase();

      if (!keyword) return true;

      const dateText = new Date(
        `${record.date}T00:00:00`
      ).toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      });

      const searchableText = [
        dateText,
        record.date,
        record.ph,
        record.weight,
        record.mortality,
        record.notes,
      ]
        .join(" ")
        .toLowerCase();

      return searchableText.includes(keyword);
    })
    .sort((a, b) => {
      const dateDifference =
        new Date(a.date).getTime() -
        new Date(b.date).getTime();

      if (dateDifference !== 0) {
        return sortOrder === "newest"
          ? -dateDifference
          : dateDifference;
      }

      // Jika tanggal pengukuran sama, urutkan berdasarkan
      // waktu pencatatan terbaru.
      return sortOrder === "newest"
        ? b.createdAt - a.createdAt
        : a.createdAt - b.createdAt;
    });

  function formatDate(date) {
    return new Date(
      `${date}T00:00:00`
    ).toLocaleDateString("id-ID", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  }

  function isEditable(record) {
    return now - record.createdAt < EDIT_WINDOW;
  }

  function handleDelete(record) {
    const confirmed = window.confirm(
      `Hapus catatan pertumbuhan tanggal ${formatDate(record.date)}?`
    );

    if (confirmed) {
      onDelete(record.id);
    }
  }

  const headerClass =
    "whitespace-nowrap px-4 py-4 text-left text-xs font-semibold uppercase tracking-wide text-[#61786D]";

  const cellClass =
    "px-4 py-4 align-top text-sm text-[#29463D]";

  return (
    <section className="rounded-2xl border border-[#E1EBE4] bg-white shadow-sm">
      <div className="flex flex-col gap-4 border-b border-[#E8EFEA] p-5 md:flex-row md:items-center md:justify-between">
        <div>
          <h3 className="text-lg font-bold text-[#092328]">
            Riwayat Pertumbuhan
          </h3>

          <p className="mt-1 text-sm text-[#718780]">
            Cari, urutkan, dan kelola catatan pertumbuhan.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <div className="relative">
            <Icon
              icon="lucide:search"
              width="18"
              className="absolute left-3 top-1/2 -translate-y-1/2 text-[#8A9C93]"
            />

            <input
              type="search"
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
              placeholder="Cari catatan..."
              aria-label="Cari catatan pertumbuhan"
              className="w-full rounded-lg border border-[#DCE7DF] py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#2A835F] sm:w-56"
            />
          </div>

          <select
            value={sortOrder}
            onChange={(event) =>
              setSortOrder(event.target.value)
            }
            aria-label="Urutkan berdasarkan tanggal"
            className="rounded-lg border border-[#DCE7DF] bg-white px-3 py-2.5 text-sm text-[#29463D] outline-none focus:border-[#2A835F]"
          >
            <option value="newest">Tanggal terbaru</option>
            <option value="oldest">Tanggal terlama</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[1050px] border-collapse">
          <thead className="bg-[#F3F7F4]">
            <tr>
              <th className={headerClass}>Tanggal</th>
              <th className={headerClass}>pH</th>
              <th className={headerClass}>Berat</th>
              <th className={headerClass}>Mortalitas</th>
              <th className={headerClass}>Catatan</th>
              <th className={headerClass}>Status</th>
              <th className={headerClass}>Aksi</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-[#E8EFEA]">
            {filteredRecords.map((record) => {
              const editable = isEditable(record);

              return (
                <tr
                  key={record.id}
                  className="transition hover:bg-[#FAFCFA]"
                >
                  <td className={`${cellClass} whitespace-nowrap font-medium`}>
                    {formatDate(record.date)}
                  </td>

                  <td className={cellClass}>
                    {record.ph}
                  </td>

                  <td className={`${cellClass} whitespace-nowrap`}>
                    {record.weight} g
                  </td>

                  <td className={`${cellClass} whitespace-nowrap`}>
                    {record.mortality} ekor
                  </td>

                  <td className={`${cellClass} min-w-[220px] max-w-xs whitespace-normal`}>
                    {record.notes || (
                      <span className="italic text-[#9AA9A1]">
                        Tidak ada catatan
                      </span>
                    )}
                  </td>

                  <td className={cellClass}>
                    {editable ? (
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#E5F3E9] px-2.5 py-1.5 text-xs font-medium text-[#24744F]">
                        <Icon icon="lucide:clock" width="14" />
                        Dapat diedit
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 whitespace-nowrap rounded-full bg-[#F0F2F0] px-2.5 py-1.5 text-xs font-medium text-[#68776F]">
                        <Icon icon="lucide:lock" width="14" />
                        Terkunci
                      </span>
                    )}
                  </td>

                  <td className={cellClass}>
                    <div className="flex items-center gap-2">
                      {editable && (
                        <button
                          type="button"
                          onClick={() => onEdit(record)}
                          title="Edit catatan"
                          aria-label={`Edit catatan ${formatDate(record.date)}`}
                          className="rounded-lg p-2 text-[#176D57] hover:bg-[#EAF4EC]"
                        >
                          <Icon
                            icon="lucide:pencil"
                            width="17"
                          />
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() => handleDelete(record)}
                        title="Hapus catatan"
                        aria-label={`Hapus catatan ${formatDate(record.date)}`}
                        className="rounded-lg p-2 text-[#B54747] hover:bg-[#FFF0EE]"
                      >
                        <Icon
                          icon="lucide:trash-2"
                          width="17"
                        />
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}

            {filteredRecords.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-6 py-14 text-center"
                >
                  <Icon
                    icon="lucide:search-x"
                    width="32"
                    className="mx-auto text-[#8BBB92]"
                  />

                  <p className="mt-3 font-semibold text-[#29463D]">
                    Tidak ada catatan ditemukan
                  </p>

                  <p className="mt-1 text-sm text-[#718780]">
                    Coba kata kunci lain atau tambahkan catatan baru.
                  </p>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="border-t border-[#E8EFEA] px-5 py-3">
        <p className="text-xs text-[#718780]">
          Menampilkan {filteredRecords.length} dari {records.length} catatan.
        </p>
      </div>
    </section>
  );
}

export default GrowthTable;