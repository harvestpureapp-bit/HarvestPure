import AgriculturePlatform from "./AgriculturePlatform";
import FeaturedProducts from "./FeaturedProducts";
import HeroSection from "./HeroSection";
import HowItWorks from "./HowItWorks";

export default function HomeLayout() {
  return (
   <>
   <HeroSection/>
   <HowItWorks/>
   <AgriculturePlatform/>
   <FeaturedProducts/>
   </>
  )
}