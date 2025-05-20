import { HeroSection } from "@/components/home/HeroSection";
import { SearchSection } from "@/components/home/SearchSection";
import { FeaturedListings } from "@/components/home/FeaturedListings";
import { PremiumPackage } from "@/components/home/PremiumPackage";
import { HowItWorks } from "@/components/home/HowItWorks";
import { TestimonialsSection } from "@/components/home/TestimonialsSection";
import { CTASection } from "@/components/home/CTASection";
import { Helmet } from "react-helmet";

export default function HomePage() {
  return (
    <>
      <Helmet>
        <title>HomeDirect | For Sale By Owner Real Estate</title>
        <meta
          name="description"
          content="Sell your home without the middleman. List your property, connect with buyers, and save thousands in agent commissions."
        />
        <meta property="og:title" content="HomeDirect | For Sale By Owner Real Estate" />
        <meta
          property="og:description"
          content="Sell your home without the middleman. List your property, connect with buyers, and save thousands in agent commissions."
        />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://homedirect.com" />
      </Helmet>
      
      <HeroSection />
      <SearchSection />
      <FeaturedListings />
      <PremiumPackage />
      <HowItWorks />
      <TestimonialsSection />
      <CTASection />
    </>
  );
}
