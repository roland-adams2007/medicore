import { useEffect } from "react";
import { useLocation, useNavigationType } from "react-router-dom";
import NProgress from "nprogress";
import "nprogress/nprogress.css";


NProgress.configure({
  showSpinner: false,
  trickleSpeed: 150,
  minimum: 0.08,
});

export default function TopLoader() {
  const location = useLocation();
  const navType = useNavigationType();

  useEffect(() => {
    NProgress.start();
    const t = setTimeout(() => NProgress.done(), 200);

    return () => clearTimeout(t);
  }, [location.pathname, location.search, location.hash, navType]);

  return null;
}
