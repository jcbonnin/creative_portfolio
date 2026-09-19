import data from "../../data/portfolio.json";
import MediaGrid from "../../components/MediaGrid";

export default function HealthCommunicationPage() {
  const healthCommItems = data.filter(item => item.isHealthCommunication);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-4xl font-extrabold tracking-tight text-emerald-700 sm:text-5xl">Health Communication</h1>
        <p className="mt-4 max-w-3xl text-xl text-gray-500">
          A dedicated collection of my work focusing on public health communication, community health projects, and IEC (Information, Education, and Communication) materials.
        </p>
      </div>
      
      <MediaGrid items={healthCommItems} />
    </div>
  );
}
