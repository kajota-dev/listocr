import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import PainSection from "@/components/landing/PainSection";
import QRLeadMagnet from "@/components/landing/QRLeadMagnet";
import RoleCards from "@/components/landing/RoleCards";
import PricingTable from "@/components/landing/PricingTable";
import Footer from "@/components/landing/Footer";

export default function HomePage() {
  return (
    <>
      <Navbar />
      <main>
        <HeroSection />
        <PainSection />
        <QRLeadMagnet />
        <RoleCards />
        <PricingTable />
      </main>
      <Footer />
    </>
  );
}
