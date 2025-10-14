import React, { useState, useEffect } from "react";
import { HelmetProvider } from "react-helmet-async";
import Modal from "react-modal";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { BrowserRouter as Router, useLocation } from "react-router-dom";
import "@fortawesome/fontawesome-free/css/all.min.css";
import { DataProvider } from "./contexts/DataProvider";
import { ScrollProvider } from "./contexts/ScrollProvider";
import ScrollToTopButton from "../shared/ui/ScrollToTopButton";
import AppRoutes from "./routes";
import Headermain from "../shared/ui/Header";
import Preloader from "../shared/ui/Preloader";


gsap.registerPlugin(ScrollTrigger, useGSAP);

if (typeof document !== "undefined") {
    Modal.setAppElement(document.body);
}

interface MainContentProps {
    isLoading: boolean;
}

export default function App(): React.ReactElement {
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    if (isLoading) {
      const timer = setTimeout(() => {
        setIsLoading(false);
        sessionStorage.setItem("isLoaded", "true"); // Set in session storage that loading has completed
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  useEffect(() => {
    const setFavicon = (darkMode: boolean): void => {
      const link = document.querySelector(
        "link[rel~='icon']"
      ) as HTMLLinkElement;
      if (!link) return;
      // Use .ico files that exist in /public; default + light variant
      link.href = darkMode ? "/favicon-light.ico" : "/favicon.ico";
      link.type = "image/x-icon";
    };

    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    setFavicon(mediaQuery.matches);

    const handleChange = (e: MediaQueryListEvent): void => {
      setFavicon(e.matches);
    };

    mediaQuery.addListener(handleChange);
    return () => {
      mediaQuery.removeListener(handleChange);
    };
  }, []);

  return (
    <HelmetProvider>
      <DataProvider>
        <ScrollProvider>
          <Router basename={import.meta.env.BASE_URL}>
            <MainContent isLoading={isLoading} />
            
          </Router>
        </ScrollProvider>
      </DataProvider>
    </HelmetProvider>
  );
}

function MainContent({ isLoading }: MainContentProps): React.ReactElement {
    const location = useLocation();
    const hideHeader = location.pathname.startsWith("/dashboard");
    
    return isLoading ? (
        <Preloader />
    ) : (
        <>
            {!hideHeader && <Headermain />}
            <AppRoutes />
            <ScrollToTopButton />
        </>
    );
}








