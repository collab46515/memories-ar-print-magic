import Hero from "@/components/Hero";
import Navigation from "@/components/Navigation";
import UploadInterface from "@/components/UploadInterface";
import MobileInterface from "@/components/MobileInterface";
import MobileDevelopment from "@/components/MobileDevelopment";
import BackendInfo from "@/components/BackendInfo";

const Index = () => {
  return (
    <div className="min-h-screen">
      <Navigation />
      <main>
        <Hero />
        <UploadInterface />
        <MobileInterface />
        <MobileDevelopment />
        <BackendInfo />
      </main>
    </div>
  );
};

export default Index;
