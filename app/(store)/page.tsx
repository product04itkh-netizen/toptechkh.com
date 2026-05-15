import { Suspense } from "react";
import HeroBanner from "@/components/home/HeroBanner";
import FeaturedCategories from "@/components/home/FeaturedCategories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import DealsSection from "@/components/home/DealsSection";
import NewArrivals from "@/components/home/NewArrivals";

function ProductSkeleton() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
      {Array.from({ length: 8 }).map((_, i) => (
        <div key={i} className="bg-white border border-[#e5e8ec] rounded-lg overflow-hidden animate-pulse">
          <div className="aspect-square bg-[#f2f3f5]" />
          <div className="p-3 space-y-2">
            <div className="h-3 bg-[#f2f3f5] rounded w-1/3" />
            <div className="h-4 bg-[#f2f3f5] rounded w-full" />
            <div className="h-4 bg-[#f2f3f5] rounded w-2/3" />
            <div className="h-8 bg-[#f2f3f5] rounded" />
          </div>
        </div>
      ))}
    </div>
  );
}

export default function HomePage() {
  return (
    <div>
      <HeroBanner />
      <FeaturedCategories />
      <Suspense
        fallback={
          <section className="py-10 bg-[#f2f3f5]">
            <div className="max-w-[1290px] mx-auto px-4">
              <div className="h-7 bg-[#e5e8ec] rounded w-48 mb-6 animate-pulse" />
              <ProductSkeleton />
            </div>
          </section>
        }
      >
        <FeaturedProducts />
      </Suspense>
      <DealsSection />
      <Suspense
        fallback={
          <section className="py-10">
            <div className="max-w-[1290px] mx-auto px-4">
              <div className="h-7 bg-[#e5e8ec] rounded w-48 mb-6 animate-pulse" />
              <ProductSkeleton />
            </div>
          </section>
        }
      >
        <NewArrivals />
      </Suspense>
    </div>
  );
}
