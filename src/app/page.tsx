import data from "../data/portfolio.json";
import MasonryGallery from "../components/MasonryGallery";
import Link from "next/link";
import { ExternalLink, Mail, MapPin } from "lucide-react";
import config from "../data/config.json";

export default function Home() {
  const featuredItems = data.slice(0, 10); // Show first 10 items as featured

  return (
    <div className="space-y-16 pb-24">
      {/* Landing / Bio Section */}
      <section className="pt-12 pb-8 border-b border-gray-200">
        <div className="max-w-4xl flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="flex-1 space-y-6">
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl mb-2">
                {config.name}
              </h1>
              <p className="text-xl font-medium text-emerald-600">
                {config.role}
              </p>
            </div>
            
            <p className="text-lg text-gray-600 leading-relaxed">
              {config.bio}
            </p>
            
            <div className="flex flex-wrap gap-4 pt-2">
              <a href={config.linkedin} target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-[#0077b5] hover:bg-[#005e93] text-white rounded-md font-medium transition-colors">
                LinkedIn Profile <ExternalLink size={16} className="ml-2" />
              </a>
              <a href={`mailto:${config.email}`} className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors">
                Contact Me <Mail size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </section>

      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Selected Works
        </h2>
      </div>
      
      <MasonryGallery items={data} />
    </div>
  );
}
