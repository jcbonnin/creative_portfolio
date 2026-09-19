import data from "../../../data/portfolio.json";
import MediaGrid from "../../../components/MediaGrid";
import { notFound } from "next/navigation";

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const decodedSlug = decodeURIComponent(resolvedParams.slug);
  
  const validCategories = ["Design", "Video", "IEC Materials"];
  if (!validCategories.includes(decodedSlug)) {
    notFound();
  }

  const categoryItems = data.filter(item => item.category === decodedSlug);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">{decodedSlug}</h1>
        <p className="mt-4 max-w-3xl text-xl text-gray-500">
          Viewing my work in {decodedSlug.toLowerCase()}.
        </p>
      </div>
      
      <MediaGrid items={categoryItems} />
    </div>
  );
}

export function generateStaticParams() {
  return [
    { slug: 'Design' },
    { slug: 'Video' },
    { slug: 'IEC Materials' },
  ];
}
