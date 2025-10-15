import React, { Suspense } from "react";
import { Routes, Route, useLocation, Location } from "react-router-dom";
import WorkPost from "../pages/works/workpage/WorkPost";
import { AnimatePresence, motion, Variants } from "framer-motion";
import { ErrorBoundary } from "./ErrorBoundary";
import { useData } from "@/app/contexts/useData";
import NotFound from "../shared/ui/404";
import TermsAndPrivacy from "../pages/TermsAndPrivacy/TermsAndPrivacy";
import { Home } from "../pages/home/home";
import { Works } from "../pages/works/showcase";

import Spinner from "../shared/ui/Spinner";

const ScrollToTop: React.FC = () => {
  const { opacity } = useData();
  const opacityClass = opacity === 1 ? "opacity-low" : "opacity-high";

  // Disable opacity animation to prevent multiple re-mounts
  // useEffect(() => {
  //   setOpacity(0);
  //   const timer = setTimeout(() => {
  //     setOpacity(1);
  //   }, 300);

  //   return () => {
  //     clearTimeout(timer);
  //     setOpacity(0);
  //   };
  // }, [pathname, setOpacity]);

  return <div className={`page-fade ${opacityClass}`} />;
};

const pageVariants: Variants = {
  initial: { opacity: 0, y: 0 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: 0, transition: { duration: 0.15, ease: "easeIn" } },
};

const pageTransition = {
  type: "tween" as const,
  ease: "easeOut",
  duration: 0.35,
};

function AppRoutes(): React.ReactElement {
  const location = useLocation();
  
  return (
    <ErrorBoundary>
      <Suspense fallback={<Spinner />}>
        <ScrollToTop />
        <ActualRoutes location={location} />
      </Suspense>
    </ErrorBoundary>
  );
}

interface ActualRoutesProps {
  location: Location;
}

const ActualRoutes: React.FC<ActualRoutesProps> = ({ location }) => {
  
  return (
    <AnimatePresence
      mode="wait"
      initial={false}
      onExitComplete={() => {
        if (typeof window === "undefined") {
          return;
        }
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });
      }}
    >
      <Routes key={location.pathname} location={location}>
        <Route 
          path="/" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Home />
            </motion.div>
          } 
        />
        
        <Route 
          path="/works" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <Works />
            </motion.div>
          } 
        />
        
        <Route
          path="/works/:workSlug"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <WorkPost />
            </motion.div>
          }
        />
        
        <Route 
          path="/terms-and-privacy" 
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <TermsAndPrivacy />
            </motion.div>
          } 
        />
        
        <Route
          path="*"
          element={
            <motion.div
              initial="initial"
              animate="in"
              exit="out"
              variants={pageVariants}
              transition={pageTransition}
            >
              <NotFound />
            </motion.div>
          }
        />
      </Routes>
    </AnimatePresence>
  );
};

export default AppRoutes;












