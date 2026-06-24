import { CartProvider } from "@/components/abdev/cart-context";
import { BackgroundFX } from "@/components/abdev/background-fx";
import { SiteNav } from "@/components/sections/site-nav";
import { Hero } from "@/components/sections/hero";
import { Marquee } from "@/components/sections/marquee";
import { Services } from "@/components/sections/services";
import { Projects } from "@/components/sections/projects";
import { Packages } from "@/components/sections/packages";
import { ProcessPipeline } from "@/components/sections/process-pipeline";
import { AgentDemo } from "@/components/sections/agent-demo";
import { Agenda } from "@/components/sections/agenda";
import { Contact } from "@/components/sections/contact";
import { SiteFooter } from "@/components/sections/site-footer";
import { FloatingActions } from "@/components/sections/floating-actions";

export default function Home() {
  return (
    <CartProvider>
      <div className="abdev-page">
        <BackgroundFX />
        <SiteNav />
        <main>
          <Hero />
          <Marquee />
          <Services />
          <Projects />
          <Packages />
          <ProcessPipeline />
          <AgentDemo />
          <Agenda />
          <Contact />
        </main>
        <SiteFooter />
        <FloatingActions />
      </div>
    </CartProvider>
  );
}
