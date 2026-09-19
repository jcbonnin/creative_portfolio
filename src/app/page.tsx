import data from "../data/portfolio.json";
import MasonryGallery from "../components/MasonryGallery";
import Link from "next/link";
import { ExternalLink, Mail, MapPin } from "lucide-react";

export default function Home() {
  return (
    <div className="space-y-16 pb-24">
      {/* Landing / Bio Section */}
      <div className="pt-12 pb-8 border-b border-gray-200">
        <div className="flex flex-col md:flex-row gap-12 items-start md:items-center">
          <div className="flex-1 space-y-6">
            <h1 className="text-5xl font-extrabold tracking-tight text-gray-900 sm:text-6xl">
              Juan Javier Bonnin
            </h1>
            <h2 className="text-2xl text-blue-600 font-medium">
              Public Health Communicator & Creative Designer
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed max-w-2xl">
              I specialize in bridging the gap between complex public health information and community engagement. Through striking graphic design, compelling video production, and strategic IEC (Information, Education, and Communication) materials, I create campaigns that resonate and educate.
            </p>
            <div className="flex flex-wrap gap-4 pt-2">
              <a href="https://www.linkedin.com/in/juan-javier-bonnin/" target="_blank" rel="noreferrer" className="inline-flex items-center px-4 py-2 bg-[#0077b5] hover:bg-[#005e93] text-white rounded-md font-medium transition-colors">
                LinkedIn Profile <ExternalLink size={16} className="ml-2" />
              </a>
              <a href="mailto:youremail@example.com" className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-md font-medium transition-colors">
                Contact Me <Mail size={16} className="ml-2" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl">
        <h2 className="text-3xl font-bold tracking-tight text-gray-900 mb-6">
          Selected Works
        </h2>
      </div>
      
      <MasonryGallery items={data} />
    </div>
  );
}
