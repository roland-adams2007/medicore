export default function StatsCard({
  icon,
  title,
  value,
  change,
  color,
  websiteName,
}) {
  const colors = {
    blue: "from-blue-500 to-cyan-500",
    purple: "from-purple-500 to-pink-500",
    emerald: "from-emerald-500 to-teal-500",
    orange: "from-orange-500 to-red-500",
  };

  return (
    <div className="stat-card bg-white rounded-lg p-5 shadow-sm border border-gray-200 h-full">
      <div className="flex items-start justify-between mb-3">
        <div
          className={`w-10 h-10 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center`}
        >
          <i data-lucide={icon} className="w-5 h-5 text-white"></i>
        </div>
        <span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-medium rounded flex items-center">
          <i
            data-lucide={change > 0 ? "trending-up" : "trending-down"}
            className="w-3 h-3 mr-1"
          ></i>
          {change > 0 ? "+" : ""}
          {change}%
        </span>
      </div>
      <h3 className="text-2xl font-semibold text-gray-900 mb-0.5">{value}</h3>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-xs text-gray-400 mt-1">
        on <span className="font-medium">{websiteName}</span>
      </p>
    </div>
  );
}
