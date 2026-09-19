import data from "../../data/portfolio.json";
import MasonryGallery from "../../components/MasonryGallery";

export default function HealthCommunicationPage() {
  const healthCommItems = data.filter(item => item.isHealthCommunication);

  return (
    <div className="space-y-12 pb-24">
      <div className="max-w-4xl pt-8 border-b border-emerald-200 pb-10">
        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-800 sm:text-5xl mb-6">Health Communication</h1>
        <p className="text-xl text-gray-600 leading-relaxed">
          A dedicated collection of my work focusing on public health communication, community health projects, and IEC (Information, Education, and Communication) materials. These projects reflect my commitment to translating complex health information into accessible, engaging formats for diverse communities.
        </p>
      </div>
      
      <MasonryGallery items={healthCommItems} />
    </div>
  );
}
