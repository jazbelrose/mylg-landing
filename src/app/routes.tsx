import React, { useState, useLayoutEffect, Suspense } from "react";
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
  const { pathname } = useLocation();
  const { opacity, setOpacity } = useData();
  const opacityClass = opacity === 1 ? "opacity-low" : "opacity-high";
  const [prevPathname, setPrevPathname] = useState<string>("");
  
  useLayoutEffect(() => {
    const blogPostRouteRegex = /^\/works\/[^/]+$/;
    const isBlogPost = blogPostRouteRegex.test(pathname);
    const wasBlogPost = blogPostRouteRegex.test(prevPathname);
    const shouldAnimate = !isBlogPost && !wasBlogPost;
    
    let timer: number;
    
    if (shouldAnimate) {
      setOpacity(0);
      window.scrollTo(0, 0);
      timer = setTimeout(() => {
        setOpacity(1);
      }, 300);
    } else {
      setOpacity(1);
    }
    
    setPrevPathname(pathname);
    
    return () => {
      clearTimeout(timer);
      if (shouldAnimate) {
        setOpacity(0);
      }
    };
  }, [pathname, setOpacity, prevPathname]);
  
  return <div className={`page-fade ${opacityClass}`} />;
};

const pageVariants: Variants = {
  initial: { opacity: 0, y: "100vh" },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: "100vh" },
};

const pageTransition = {
  type: "tween" as const,
  ease: "anticipate",
  duration: 1,
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
    <AnimatePresence mode="wait">
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












