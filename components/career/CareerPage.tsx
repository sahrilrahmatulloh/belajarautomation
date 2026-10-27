import CareerHeader from "./CareerHeader";
import CareerResources from "./CareerResources";
import CareerStats from "./CareerStats";

export default function CareerPage() {
  return (
    <div className="space-y-8">
      <CareerHeader />
      <CareerStats />
      <CareerResources />
    </div>
  );
}