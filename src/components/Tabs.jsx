export default function TopTabs({ activeTab, onChangeTab }) {
  const base =
    "h-12 px-6 flex items-center text-sm font-medium transition border border-black border-b-0 rounded-none";

  const active = "bg-white text-gray-900 -mb-px";
  const inactive = "bg-pink-200 text-gray-800 hover:bg-pink-300";

  return (
    <div className="flex items-stretch bg-pink-200 border-b border-black rounded-t-xl overflow-hidden">
      <button
        type="button"
        className={`${base} ${activeTab === "todo" ? active : inactive}`}
        onClick={() => onChangeTab("todo")}
      >
        To Do List
      </button>

      <button
        type="button"
        className={`${base} ${activeTab === "calendar" ? active : inactive}`}
        onClick={() => onChangeTab("calendar")}
      >
        Calendar
      </button>

      {/* relleno rosa */}
      <div className="flex-1 border-t border-black" />
    </div>
  );
}
