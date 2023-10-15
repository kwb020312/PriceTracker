import HeroCarousel from "@/components/HeroCarousel";
import Searchbar from "@/components/Searchbar";
import Image from "next/image";
import { getAllProducts } from "@/lib/actions";
import ProductCard from "@/components/ProductCard";

const Home = async () => {
  const allProducts = await getAllProducts();
  return (
    <>
      <section className="px-6  md:px-20 py-24">
        <div className="flex max-xl:flex-col gap-16">
          <div className="flex flex-col justify-center">
            <p className="small-text">
              선택할 수 있는 가장 똑똑한 쇼핑:
              <Image
                src="/assets/icons/arrow-right.svg"
                alt="arrow-right"
                width={16}
                height={16}
              />
            </p>
            <h1 className="head-text break-keep">
              항상 빠른 속도로 최적의 가격을 찾아주는{" "}
              <span className="text-primary">PriceTracer</span>
            </h1>
            <p className="mt-6">
              검색될 수록 강력해지고 발전되며, 성장하는 분석 스크래퍼
            </p>
            <Searchbar />
          </div>
          <HeroCarousel />
        </div>
      </section>

      <section className="trending-section">
        <h2 className="section-text">인기 상품</h2>

        <div className="flex flex-wrap gap-x-8 gap-y-16">
          {allProducts?.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
