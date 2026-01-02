
/**
 * Simple tab navigation for switching between "To Do List" and "Calendar"
 */
export default function TopTabs({ activeTab, onChangeTab }) {
  
  /**
   * Shared base styles for tab buttons
   */
  const base =
    "h-12 px-6 flex items-center text-sm font-medium transition border border-black border-b-0 rounded-none";

  // Styles for the active tab
  const active = "bg-white text-gray-900 -mb-px";

  // Styles for inactive tabs
  const inactive = "bg-pink-200 text-gray-800 hover:bg-pink-300";

  return (
    // Container for tabs with a bottom border
    <div className="flex items-stretch bg-pink-200 border-b border-black rounded-t-xl overflow-hidden">
      
      {/* "To Do List" tab */}
      <button
        type="button"
        className={`${base} ${activeTab === "todo" ? active : inactive}`}
        onClick={() => onChangeTab("todo")}
      >
        To Do List
      </button>

      {/* "Calendar" tab */}
      <button
        type="button"
        className={`${base} ${activeTab === "calendar" ? active : inactive}`}
        onClick={() => onChangeTab("calendar")}
      >
        Calendar
      </button>

      {/* Filler area to keep the top bar pink across the full width */}
      <div className="flex-1 border-t border-black" />
    </div>
  );
}
