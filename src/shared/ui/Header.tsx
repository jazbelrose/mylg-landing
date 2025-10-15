import React, { useRef, useState, useEffect } from "react";
import { useLocation, Link } from "react-router-dom";

// Use modular shared styles (already globally imported in main.tsx)
import "./header.css";
import Menuopened from "../../assets/svg/menu-open.svg?react";
import Menuclosed from "../../assets/svg/menu-closed.svg?react";
import { useScrollContext } from "../../app/contexts/useScrollContext";
import gsap from "gsap";
import ScrambleText from "scramble-text";

const Headermain: React.FC = () => {
    const location = useLocation();
    const [isActive, setActive] = useState<boolean>(false);
    const menuAnimation = useRef<ReturnType<typeof gsap.timeline> | null>(null);
    const scrollableDivRef = useRef<HTMLDivElement | null>(null);
    const [prevScrollPos, setPrevScrollPos] = useState<number>(0);
    const { isHeaderVisible, updateHeaderVisibility } = useScrollContext();
    const logoRef = useRef<HTMLAnchorElement | null>(null);
    const logoHoveredRef = useRef<boolean>(false);
    const [logoOriginalColor, setLogoOriginalColor] = useState<string | null>(null);
    const logoScrambleInstance = useRef<ScrambleText | null>(null);
    const scrollPositionRef = useRef<number>(0);

    // Removed dropdown state/logic completely
    const getLinkClass = (path: string): string => {
        const currentPath = location.pathname.split(/[?#]/)[0];
        const isExactMatch = currentPath === path;
        const isSubpath = path !== "/" && currentPath.startsWith(`${path}/`);
        return isExactMatch || isSubpath ? "active-link" : "";
    };

    useEffect(() => {
        // Close any open menu when location changes
    }, [location]);

    const handleScroll = (): void => {
        const currentScrollPos = window.scrollY;
        if (currentScrollPos <= 5) {
            updateHeaderVisibility(true);
        } else {
            const isScrollingUp = prevScrollPos > currentScrollPos;
            updateHeaderVisibility(isScrollingUp);
        }
        setPrevScrollPos(currentScrollPos);
    };

    useEffect(() => {
        const scrollableDiv = scrollableDivRef.current;
        if (scrollableDiv) {
            scrollableDiv.addEventListener("scroll", handleScroll);
        }
        return () => {
            if (scrollableDiv) {
                scrollableDiv.removeEventListener("scroll", handleScroll);
            }
        };
    });

    useEffect(() => {
        gsap.set(".span-open", {
            attr: { d: "M0 2S175 1 500 1s500 1 500 1V0H0Z" }
        });
        menuAnimation.current = gsap.timeline({ paused: true })
            .to(".span-open", {
                duration: 0.3,
                attr: { d: "M0 502S175 272 500 272s500 230 500 230V0H0Z" },
                ease: "Power2.easeIn",
                onStart: () => {
                    const navMenu = document.querySelector(".nav-bar-menu") as HTMLElement;
                    if (navMenu) {
                        navMenu.classList.add("opened");
                        gsap.set(".nav-bar-menu", { visibility: "visible" });
                    }
                },
                onReverseComplete: () => {
                    const navMenu = document.querySelector(".nav-bar-menu") as HTMLElement;
                    if (navMenu) {
                        navMenu.classList.remove("opened");
                    }
                }
            })
            .to(".span-open", {
                duration: 0.3,
                attr: { d: "M0,1005S175,995,500,995s500,5,500,5V0H0Z" },
                ease: "Power2.easeOut"
            })
            .to(".menu .menu-item > a", {
                duration: 0.3,
                opacity: 1,
                transform: "translateY(0)",
                stagger: 0.1,
                ease: "Power2.easeOut"
            })
            .eventCallback("onComplete", () => {
                setActive(true);
            });
    }, []);

    const handleToggle = (): void => {
        const htmlElement = document.documentElement;

        if (isActive) {
            if (menuAnimation.current) {
                menuAnimation.current.reverse();
                menuAnimation.current.eventCallback("onReverseComplete", () => {
                    setActive(false);
                    document.body.classList.remove("ovhidden");
                    htmlElement.classList.remove("globalnav--noscroll");
                    // Restore scroll position
                    document.body.style.top = '';
                    document.body.style.position = '';
                    window.scrollTo(0, scrollPositionRef.current);
                    const navMenu = document.querySelector(".nav-bar-menu") as HTMLElement | null;
                    if (navMenu) {
                        navMenu.classList.remove("opened");
                    }
                });
            } else {
                setActive(false);
                document.body.classList.remove("ovhidden");
                htmlElement.classList.remove("globalnav--noscroll");
                // Restore scroll position
                document.body.style.top = '';
                document.body.style.position = '';
                window.scrollTo(0, scrollPositionRef.current);
            }
        } else {
            // Save current scroll position
            scrollPositionRef.current = window.scrollY;
            // Apply fixed positioning to prevent scroll
            document.body.style.position = 'fixed';
            document.body.style.top = `-${scrollPositionRef.current}px`;
            
            htmlElement.classList.add("globalnav--noscroll");
            document.body.classList.add("ovhidden");
            if (menuAnimation.current) {
                menuAnimation.current.play();
                menuAnimation.current.eventCallback("onComplete", () => {
                    setActive(true);
                    htmlElement.classList.add("globalnav--noscroll");
                });
            } else {
                setActive(true);
            }
        }
    };

    const handleLogoMouseEnter = (): void => {
        if (logoScrambleInstance.current) return;
        logoHoveredRef.current = true;
        const logoElem = logoRef.current;
        const scrambledElem = logoElem?.querySelector(".scrambled") as HTMLElement;
        if (scrambledElem && logoElem) {
            logoElem.style.width = `${logoElem.offsetWidth}px`;
            logoScrambleInstance.current = new ScrambleText(scrambledElem, {
                timeOffset: 25,
                chars: ["o", "¦"],
                callback: () => {
                    if (logoHoveredRef.current) {
                        scrambledElem.style.color = "#FA3356";
                    }
                    logoScrambleInstance.current = null;
                }
            });
            logoScrambleInstance.current.start().play();
        }
    };

    const handleLogoMouseLeave = (): void => {
        logoHoveredRef.current = false;
        const scrambledElem = logoRef.current?.querySelector(".scrambled") as HTMLElement;
        if (scrambledElem) {
            scrambledElem.style.color = logoOriginalColor || "var(--text-color)";
        }
    };

    useEffect(() => {
        const scrambledElem = logoRef.current?.querySelector(".scrambled") as HTMLElement;
        if (scrambledElem) {
            setLogoOriginalColor(getComputedStyle(scrambledElem).color);
        }
        const handleResize = (): void => {
            const logoElem = logoRef.current;
            if (logoElem) {
                logoElem.style.width = "auto";
            }
        };
        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <>
            <header className={`header ${isHeaderVisible ? "" : "hide"}`}>
                <div className="nav-bar">
                    <Link 
                        to="/" 
                        className="site-logo" 
                        ref={logoRef} 
                        onMouseEnter={handleLogoMouseEnter} 
                        onMouseLeave={handleLogoMouseLeave}
                    >
                        <span className="scrambled">*MYLG!*</span>
                    </Link>
                    <div className="nav-links">
                        <Link to="/" className={`nav-link ${getLinkClass("/")}`}>
                            HOME
                        </Link>
                        <Link to="/works" className={`nav-link ${getLinkClass("/works")}`}>
                            SHOWCASE
                        </Link>
                        <a href="https://app.mylg.studio" className="nav-link" target="_blank" rel="noopener noreferrer">
                            DASHBOARD
                        </a>
                    </div>
                    <div className="right-bar">
                        <button className="toggle-button" onClick={handleToggle}>
                            {isActive ? <Menuopened /> : <Menuclosed />}
                        </button>
                    </div>
                </div>
                <div className="nav-bar-menu">
                    <div className="svg-wrapper">
                        <svg viewBox="0 0 1000 1000" preserveAspectRatio="none">
                            <path 
                                className="span-open" 
                                d="M0 2S175 1 500 1s500 1 500 1V0H0Z" 
                                fill="#0c0c0c" 
                            />
                        </svg>
                    </div>
                    <div className="menu-wrapper">
                        <div className="menu-container">
                            <ul className="menu">
                                <li className="menu-item">
                                    <Link onClick={handleToggle} to="/" className="my-3">
                                        HOME
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <Link 
                                        onClick={handleToggle} 
                                        to="/works" 
                                        className={`my-3 sign-out-link ${getLinkClass("/works")}`}
                                    >
                                        SHOWCASE
                                    </Link>
                                </li>
                                <li className="menu-item">
                                    <a href="https://app.mylg.studio" className="my-3" target="_blank" rel="noopener noreferrer" onClick={handleToggle}>
                                        DASHBOARD
                                    </a>
                                </li>
                                <li className="menu-item">
                                    <Link 
                                        onClick={handleToggle} 
                                        to="/terms-and-privacy" 
                                        className={`my-3 ${getLinkClass("/terms-and-privacy")}`}
                                    >
                                        PRIVACY
                                    </Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </header>
        </>
    );
};

export default Headermain;








