import { useEffect, useState } from "react";
import { Background, CursorGlow } from "./components/ui/Background";
import { BackToTop, ScrollProgress } from "./components/ui/ScrollProgress";
import { Navbar } from "./components/Navbar";
import { Hero } from "./components/Hero";
import { About } from "./components/About";
import { Experience } from "./components/Experience";
import { Flagship } from "./components/Flagship";
import { Projects } from "./components/Projects";
import { Skills } from "./components/Skills";
import { Education } from "./components/Education";
import { Contact } from "./components/Contact";
import { Footer } from "./components/Footer";
import { Preloader } from "./components/Preloader";
import { useTheme } from "./hooks/useTheme";

export default function App() {
  const { isDark, toggle } = useTheme();
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setReady(true), 900);
    return () => clearTimeout(timer);
  }, []);

  // honour a #hash on first load once the curtain has lifted
  useEffect(() => {
    if (!ready) return;
    const id = window.location.hash.slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 120);
  }, [ready]);

  return (
    <>
      <Preloader done={ready} />

      <Background />
      <CursorGlow />
      <ScrollProgress />

      <a
        href="#about"
        className="no-print sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[70] focus:rounded-lg focus:bg-brand focus:px-4 focus:py-2 focus:text-sm focus:text-white"
      >
        Skip to content
      </a>

      <Navbar isDark={isDark} onToggleTheme={toggle} />

      <main>
        <Hero />
        <About />
        <Experience />
        <Flagship />
        <Projects />
        <Skills />
        <Education />
        <Contact />
      </main>

      <Footer />
      <BackToTop />
    </>
  );
}
