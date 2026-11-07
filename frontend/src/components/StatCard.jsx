import { ArrowUpRight } from "lucide-react";

function StatCard({ title, value, description, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-gray-200 bg-white p-5 transition hover:shadow-sm">

      <div className="flex items-start justify-between">

        <div>
          <p className="text-sm font-medium text-gray-500">
            {title}
          </p>

          <h3 className="mt-3 text-2xl font-bold text-gray-900">
            {value}
          </h3>
        </div>

        <div className="rounded-xl bg-gray-100 p-3 text-gray-700">
          <Icon size={21} strokeWidth={1.8} />
        </div>

      </div>

      <div className="mt-4 flex items-center gap-1 text-xs text-gray-400">
        <ArrowUpRight size={14} />
        {description}
      </div>

    </div>
  );
}

export default StatCard;
