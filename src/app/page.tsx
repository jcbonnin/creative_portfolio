import data from "../data/portfolio.json";
import MasonryGallery from "../components/MasonryGallery";

export default function Home() {
  return (
    <div className="space-y-12 pb-24">
      <div className="max-w-4xl pt-8">
        <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl mb-6">
          Creative <span className="text-blue-600">Portfolio</span>
        </h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          A comprehensive showcase of my work in graphic design, video production, and public health communication.
        </p>
      </div>
      
      <MasonryGallery items={data} />
    </div>
  );
}
