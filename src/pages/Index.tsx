
import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { HeroSection } from "@/components/HeroSection";
import { UploadFlow } from "@/components/UploadFlow";
import { DollGallery } from "@/components/DollGallery";
import { BrandBenefits } from "@/components/BrandBenefits";
import { CallToAction } from "@/components/CallToAction";
import { BrandShowcase } from "@/components/BrandShowcase";

const Index = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    // Check if this is a brand login request
    if (searchParams.get('brand') === 'login') {
      // Simple redirect to brand dashboard (no auth needed)
      navigate('/brand/dashboard');
    }
  }, [searchParams, navigate]);

  return (
    <div className="min-h-screen bg-magic-gradient">
      <HeroSection />
      <UploadFlow />
      <DollGallery />
      <BrandShowcase />
      <BrandBenefits />
      <CallToAction />
    </div>
  );
};

export default Index;
