import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import HomeCmsSections from "@/components/cms/HomeCmsSections";

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FeaturedCategories />
      <HomeCmsSections />
    </div>
  );
}
