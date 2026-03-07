import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import { ChevronDown, Globe, Plus, Check, LogOut } from "lucide-react";
import axiosInstance from "../../api/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useWebsiteStore } from "../../store/store";
import AppLoader from "../ui/loaders/AppLoader";

const WebsiteSelect = ({ onDone }) => {
  const [selectedWebsite, setSelectedWebsite] = useState(null);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [websiteName, setWebsiteName] = useState("");
  const [creating, setCreating] = useState(false);
  const [createError, setCreateError] = useState("");
  const [visible, setVisible] = useState(false);
  const triggerRef = useRef(null);
  const dropdownRef = useRef(null);

  const navigate = useNavigate();
  const {
    setSelectedWebsite: setStoreWebsite,
    selectedWebsite: storedWebsite,
    websites,
    loading,
    error,
    fetchWebsites,
    addWebsite,
  } = useWebsiteStore();

  useEffect(() => {
    checkWebsiteSelection();
  }, []);

  const checkWebsiteSelection = async () => {
    try {
      const token = localStorage.getItem("accessToken");

      if (!token) {
        navigate("/login");
        return;
      }

      const fetchedWebsites = await fetchWebsites();

      const stored = localStorage.getItem("selectedWebsite");
      if (stored) {
        setStoreWebsite(JSON.parse(stored));
      }

      if (fetchedWebsites.length === 0) {
        setShowForm(true);
      } else {
        setSelectedWebsite(
          stored ? JSON.parse(stored) : fetchedWebsites[0]
        );
      }

      setVisible(true);
    } catch (err) {
      if (err.response?.status === 401) {
        localStorage.removeItem("accessToken");
        navigate("/login");
      } else {
        setVisible(true);
      }
    }
  };

  const handleWebsiteSelect = (website) => {
    setSelectedWebsite(website);
    setShowDropdown(false);
  };

  const handleEnter = () => {
    if (selectedWebsite) {
      setStoreWebsite(selectedWebsite);
      localStorage.setItem("selectedWebsite", JSON.stringify(selectedWebsite));
      setVisible(false);
      onDone?.();
    }
  };

  const handleCreateWebsite = async (e) => {
    e.preventDefault();

    if (!websiteName.trim()) {
      setCreateError("Website name is required");
      return;
    }

    setCreating(true);
    setCreateError("");

    try {
      const response = await axiosInstance.post("/websites/create", {
        name: websiteName,
      });

      const newWebsite = response.data.data.website;
      addWebsite(newWebsite);
      setSelectedWebsite(newWebsite);
      setShowForm(false);
      setWebsiteName("");
      setStoreWebsite(newWebsite);
      localStorage.setItem("selectedWebsite", JSON.stringify(newWebsite));
      setVisible(false);
      onDone?.();
    } catch (err) {
      setCreateError(err.response?.data?.message || "Failed to create website");
    } finally {
      setCreating(false);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("selectedWebsite");
    setStoreWebsite(null);
    navigate("/logout");
  };

  useEffect(() => {
    if (!showDropdown) return;

    const onDown = (e) => {
      if (triggerRef.current?.contains(e.target)) return;
      if (dropdownRef.current?.contains(e.target)) return;
      setShowDropdown(false);
    };

    window.addEventListener("mousedown", onDown);
    return () => window.removeEventListener("mousedown", onDown);
  }, [showDropdown]);

  if (loading) {
    return <AppLoader />;
  }

  if (!visible) {
    return null;
  }

  return (
    <>
      <div className="fixed inset-0 workspace-bg z-50">
        <div className="bg-grain z-0"></div>
        <div className="bg-gradient-1 z-0"></div>
        <div className="bg-gradient-2 z-0"></div>

        <button
          onClick={handleSignOut}
          className="fixed top-8 right-8 flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-all duration-300 group z-[999999]"
        >
          <span className="font-medium tracking-wide">Sign out</span>
          <LogOut className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
        </button>
        <div className="relative z-50 isolate flex items-center justify-center min-h-screen p-4">
          <div className="relative z-50 w-full max-w-lg workspace-card">
            <div className="text-center mb-12 stagger-item-1">
              <div className="inline-block mb-6 workspace-icon-wrapper">
                <div className="workspace-icon">
                  <Globe className="w-7 h-7 text-white" strokeWidth={1.5} />
                </div>
              </div>
              <h1 className="text-4xl font-light text-gray-900 mb-3 tracking-tight">
                Select Workspace
              </h1>
              <p className="text-gray-600 text-base font-light tracking-wide">
                Choose a website to continue to your dashboard
              </p>
            </div>

            {error && (
              <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg backdrop-blur-sm stagger-item-2">
                <p className="text-red-600 text-sm font-light">{error}</p>
              </div>
            )}

            {!showForm ? (
              <div className="space-y-6">
                <div className="relative stagger-item-3">
                  <button
                    ref={triggerRef}
                    type="button"
                    onClick={() => setShowDropdown((v) => !v)}
                    className="w-full flex items-center justify-between p-5 bg-white border border-gray-200 rounded-lg hover:border-indigo-500 transition-all duration-300 group shadow-sm"
                  >
                    <div className="flex items-center gap-4">
                      <div className="website-icon-small">
                        <Globe
                          className="w-4 h-4 text-indigo-600"
                          strokeWidth={1.5}
                        />
                      </div>
                      <div className="text-left">
                        <p className="font-medium text-gray-900 tracking-wide">
                          {selectedWebsite
                            ? selectedWebsite.name
                            : "Select a website"}
                        </p>
                        {selectedWebsite && (
                          <p className="text-xs text-gray-500 mt-0.5 font-light">
                            {selectedWebsite.slug}
                          </p>
                        )}
                      </div>
                    </div>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 transition-all duration-300 ${showDropdown ? "rotate-180 text-indigo-600" : ""
                        }`}
                      strokeWidth={1.5}
                    />
                  </button>
                  {showDropdown &&
                    websites.length > 0 &&
                    triggerRef.current &&
                    createPortal(
                      (() => {
                        const rect = triggerRef.current.getBoundingClientRect();
                        const top = rect.bottom + 8;
                        const left = rect.left;
                        const width = rect.width;

                        return (
                          <div
                            ref={dropdownRef}
                            style={{
                              position: "fixed",
                              top,
                              left,
                              width,
                              zIndex: 999999,
                            }}
                          >
                            <div className="bg-white/95 border border-gray-200 rounded-lg shadow-xl max-h-64 overflow-y-auto backdrop-blur-xl">
                              {websites.map((website) => (
                                <button
                                  key={website.id}
                                  type="button"
                                  onMouseDown={(e) => e.preventDefault()}
                                  onClick={() => handleWebsiteSelect(website)}
                                  className="w-full flex items-center justify-between p-4 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-200 group border-b border-gray-100 last:border-0 cursor-pointer active:scale-[0.98]"
                                >
                                  <div className="flex items-center gap-3">
                                    <div className="website-icon-tiny">
                                      <Globe
                                        className="w-3.5 h-3.5 text-indigo-600"
                                        strokeWidth={1.5}
                                      />
                                    </div>
                                    <div className="text-left">
                                      <p className="font-medium text-gray-900 text-sm tracking-wide">
                                        {website.name}
                                      </p>
                                      <p className="text-xs text-gray-500 mt-0.5 font-light">
                                        {website.slug}
                                      </p>
                                    </div>
                                  </div>

                                  {selectedWebsite?.id === website.id && (
                                    <Check
                                      className="w-4 h-4 text-indigo-600"
                                      strokeWidth={2}
                                    />
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        );
                      })(),
                      document.body,
                    )}
                </div>

                <div className="flex items-center justify-center gap-4 py-2 stagger-item-4">
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                  <span className="text-xs text-gray-500 font-light tracking-widest uppercase">
                    or
                  </span>
                  <div className="flex-1 h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent"></div>
                </div>

                <button
                  type="button"
                  onClick={() => setShowForm(true)}
                  className="w-full flex items-center justify-center gap-3 p-5 border border-dashed border-gray-300 rounded-lg hover:border-indigo-500 hover:bg-gradient-to-r hover:from-indigo-50 hover:to-purple-50 transition-all duration-300 group stagger-item-5"
                >
                  <Plus
                    className="w-5 h-5 text-gray-400 group-hover:text-indigo-600 transition-colors"
                    strokeWidth={1.5}
                  />
                  <span className="font-medium text-gray-700 group-hover:text-indigo-600 tracking-wide transition-colors">
                    Create New Website
                  </span>
                </button>

                <button
                  type="button"
                  onClick={handleEnter}
                  disabled={!selectedWebsite}
                  className="w-full py-4 px-6 rounded-lg text-white font-medium tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5 stagger-item-6"
                >
                  Enter Dashboard
                </button>
              </div>
            ) : (
              <form onSubmit={handleCreateWebsite} className="space-y-6">
                <div className="stagger-item-3">
                  <label className="block text-sm font-medium text-gray-700 mb-3 tracking-wide">
                    Website Name
                  </label>
                  <input
                    type="text"
                    value={websiteName}
                    onChange={(e) => {
                      setWebsiteName(e.target.value);
                      setCreateError("");
                    }}
                    placeholder="Enter website name"
                    className="w-full px-5 py-4 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300"
                    autoFocus
                  />
                  {createError && (
                    <p className="mt-2 text-sm text-red-600 font-light">
                      {createError}
                    </p>
                  )}
                  <p className="mt-3 text-sm text-gray-500 font-light">
                    This will create a new website workspace
                  </p>
                </div>

                <div className="flex gap-3 stagger-item-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForm(false);
                      setWebsiteName("");
                      setCreateError("");
                      if (websites.length > 0 && !selectedWebsite) {
                        setSelectedWebsite(websites[0]);
                      }
                    }}
                    className="flex-1 py-4 px-6 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 tracking-wide"
                    disabled={creating}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={creating}
                    className="flex-1 py-4 px-6 rounded-lg text-white font-medium tracking-wide bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                  >
                    {creating ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-2 border-white/20 border-t-white"></div>
                      </div>
                    ) : (
                      "Create Website"
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>

      <style jsx>{`
        .workspace-bg {
          background: linear-gradient(
            to bottom right,
            #eef2ff 0%,
            #faf5ff 100%
          );
          position: relative;
          overflow: hidden;
        }

        .bg-grain {
          position: absolute;
          inset: 0;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.02'/%3E%3C/svg%3E");
          opacity: 1;
          pointer-events: none;
        }

        .bg-gradient-1 {
          position: absolute;
          top: -50%;
          left: -20%;
          width: 80%;
          height: 80%;
          background: radial-gradient(
            circle,
            rgba(99, 102, 241, 0.08) 0%,
            transparent 70%
          );
          animation: float1 20s ease-in-out infinite;
          pointer-events: none;
        }

        .bg-gradient-2 {
          position: absolute;
          bottom: -40%;
          right: -20%;
          width: 70%;
          height: 70%;
          background: radial-gradient(
            circle,
            rgba(139, 92, 246, 0.08) 0%,
            transparent 70%
          );
          animation: float2 25s ease-in-out infinite;
          pointer-events: none;
        }

        @keyframes float1 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -30px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
        }

        @keyframes float2 {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(-30px, 30px) scale(0.9);
          }
          66% {
            transform: translate(20px, -20px) scale(1.1);
          }
        }

        .bg-grain,
        .bg-gradient-1,
        .bg-gradient-2 {
          z-index: 0;
        }

        .workspace-card {
          position: relative;
          z-index: 50;
        }

        @keyframes cardEnter {
          from {
            opacity: 0;
            transform: translateY(30px) scale(0.95);
          }
          to {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }

        .stagger-item-1 {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.1s forwards;
          opacity: 0;
        }
        .stagger-item-2 {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.15s forwards;
          opacity: 0;
        }
        .stagger-item-3 {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.2s forwards;
          opacity: 0;
        }
        .stagger-item-4 {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
          opacity: 0;
        }
        .stagger-item-5 {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.3s forwards;
          opacity: 0;
        }
        .stagger-item-6 {
          animation: fadeInUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) 0.35s forwards;
          opacity: 0;
        }

        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .workspace-icon-wrapper {
          animation: iconFloat 3s ease-in-out infinite;
        }

        .workspace-icon {
          width: 64px;
          height: 64px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          overflow: hidden;
          box-shadow: 0 10px 40px rgba(99, 102, 241, 0.3);
        }

        .workspace-icon::before {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            135deg,
            rgba(255, 255, 255, 0.2) 0%,
            transparent 100%
          );
        }

        @keyframes iconFloat {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }

        .website-icon-small {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .website-icon-tiny {
          width: 32px;
          height: 32px;
          background: linear-gradient(135deg, #eef2ff 0%, #faf5ff 100%);
          border: 1px solid rgba(99, 102, 241, 0.1);
          border-radius: 6px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .dropdown-enter {
          animation: dropdownSlide 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .loading-orb {
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
          border-radius: 50%;
          animation: pulse 2s ease-in-out infinite;
        }

        .loading-ring {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 48px;
          height: 48px;
          margin: -24px 0 0 -24px;
          border: 2px solid rgba(99, 102, 241, 0.2);
          border-top-color: #6366f1;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes pulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 1;
          }
          50% {
            transform: scale(1.2);
            opacity: 0.7;
          }
        }

        @keyframes spin {
          to {
            transform: rotate(360deg);
          }
        }

        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.02);
        }

        ::-webkit-scrollbar-thumb {
          background: rgba(99, 102, 241, 0.2);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: rgba(99, 102, 241, 0.3);
        }
      `}</style>
    </>
  );
};

export default WebsiteSelect;