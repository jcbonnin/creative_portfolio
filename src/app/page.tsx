import data from "../data/portfolio.json";
import MediaGrid from "../components/MediaGrid";

export default function Home() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">All Work</h1>
        <p className="mt-4 max-w-3xl text-xl text-gray-500">
          A comprehensive collection of my creative media work.
        </p>
      </div>
      
      <MediaGrid items={data} />
    </div>
  );
}
