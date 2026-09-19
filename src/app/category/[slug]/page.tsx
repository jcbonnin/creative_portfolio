import data from "../../../data/portfolio.json";
import MasonryGallery from "../../../components/MasonryGallery";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  
  const validCategories = ["Design", "Video", "IEC MATERIALS"];
  if (!validCategories.includes(decodedSlug)) {
    notFound();
  }

  const categoryItems = data.filter(item => item.category === decodedSlug);

  return (
    <div className="space-y-12 pb-24">
      <div className="max-w-4xl pt-8 border-b border-gray-200 pb-8">
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-4">{decodedSlug}</h1>
        <p className="text-xl text-gray-500">
          A curated collection of my {decodedSlug === "IEC MATERIALS" ? "IEC materials" : decodedSlug.toLowerCase()} projects.
        </p>
      </div>
      
      <MasonryGallery items={categoryItems} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: 'Design' },
    { slug: 'Video' },
    { slug: 'IEC MATERIALS' },
  ];
}
