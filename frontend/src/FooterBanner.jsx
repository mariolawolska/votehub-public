import VenomBanner from "../components/VenomBanner";


export default function FooterBanner() {
  return (
    <div className="relative min-h-[40vh] md:min-h-[200px]">

      {/* Venom background */}
      <div className="absolute inset-0 -z-10">
        <VenomBanner height="h-full" />
      </div>

      {/* Overlay */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm"></div>

      {/* Content */}
      <div className="relative w-full text-center pb-6 px-6 text-white">
        <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide drop-shadow-lg">
          Join the Movie World
        </h2>

        <p className="mt-2 text-sm opacity-90">
          Discover, vote and explore the best films on VoteHub
        </p>
      </div>
    </div>
  );
}
