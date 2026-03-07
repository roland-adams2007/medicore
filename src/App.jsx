import "./App.css";
import { Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/Auth/AuthContext";
import AppRoutes from "./routes/AppRoutes";
import ScrollToTop from "./utils/ScrollToTop";
import TopLoader from "./components/ui/loaders/TopLoader";
import { useEffect } from "react";
import { useClinicStore } from "./store/store";

function App() {
  const initializeStore = useClinicStore((state) => state.initialize);

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <>
      <ScrollToTop />
      <TopLoader />
      <AuthProvider>
        <Routes>
          <Route path="/*" element={<AppRoutes />} />
        </Routes>
      </AuthProvider>
    </>
  );
}

export default App;