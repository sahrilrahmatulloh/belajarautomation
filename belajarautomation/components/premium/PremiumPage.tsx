import PremiumBenefits from "./PremiumBenefits";
import PremiumHero from "./PremiumHero";
import PremiumPricing from "./PremiumPricing";

export default function PremiumPage() {
  return (
    <div className="mx-auto max-w-6xl space-y-16">
      <PremiumHero />

      <PremiumBenefits />

      <PremiumPricing />
    </div>
  );
}