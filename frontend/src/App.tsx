import { Routes, Route } from "react-router-dom";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import { WhatsAppButton } from "@/components/whatsapp-button";
import { ScrollToTop } from "@/components/scroll-to-top";
import { Home } from "@/pages/Home";
import { Services } from "@/pages/Services";
import { Work } from "@/pages/Work";
import { Pricing } from "@/pages/Pricing";
import { About } from "@/pages/About";
import { Contact } from "@/pages/Contact";
import { NotFound } from "@/pages/NotFound";

export default function App() {
  return (
    <>
      <ScrollToTop />
      <SiteHeader />
      <main>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/services" element={<Services />} />
          <Route path="/work" element={<Work />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <SiteFooter />
      <WhatsAppButton />
    </>
  );
}
