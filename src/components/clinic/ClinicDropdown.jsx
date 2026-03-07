import { useEffect } from "react";
import { useWebsiteStore } from "../../store/store";
import { Layout, CheckCircle, Plus } from "lucide-react";

export default function WebsiteDropdown({ dropdownOpen, setDropdownOpen, onNewWebsite }) {
  const {
    websites,
    selectedWebsite,
    setSelectedWebsite,
    fetchWebsites,
    loading,
  } = useWebsiteStore();

  const handleSelectWebsite = (website) => {
    setSelectedWebsite(website);
    setDropdownOpen(false);
  };

  const handleNewWebsite = () => {
    setDropdownOpen(false);
    if (onNewWebsite) {
      onNewWebsite();
    }
  };
  useEffect(() => {
    fetchWebsites();
  }, []);

  return (
    <div
      id="websiteDropdown"
      className={`absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50 transition-all duration-200 ${dropdownOpen
        ? "opacity-100 translate-y-0 pointer-events-auto"
        : "opacity-0 -translate-y-2 pointer-events-none"
        }`}
    >
      <div className="p-3 border-b border-gray-100">
        <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
          Your Websites
        </p>
      </div>

      <div className="max-h-80 overflow-y-auto p-2 dropdown-scroll">
        {websites.map((website) => (
          <button
            key={website.id}
            onClick={() => handleSelectWebsite(website)}
            className={`website-item w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-left transition-colors ${selectedWebsite?.id === website.id
              ? "bg-indigo-50 text-indigo-700"
              : "hover:bg-gray-50"
              }`}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Layout className="w-4 h-4 text-white" />
            </div>

            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {website.name}
              </p>
              <p className="text-xs text-gray-500 truncate">{website.domain}</p>
            </div>

            {selectedWebsite?.id === website.id && (
              <CheckCircle className="w-4 h-4 text-indigo-600 flex-shrink-0" />
            )}
          </button>
        ))}
      </div>

      <div className="p-3 border-t border-gray-100">
        <button
          onClick={handleNewWebsite}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:shadow-lg transition-all text-sm font-medium hover:brightness-105"
        >
          <Plus className="w-4 h-4" />
          <span>New Website</span>
        </button>
      </div>
    </div>
  );
}
