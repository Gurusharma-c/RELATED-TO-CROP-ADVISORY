import { useLocation, useNavigate } from "react-router-dom";
import { CropCard } from "@/components/CropCard";
import { EnvironmentInfo } from "@/components/EnvironmentInfo";

interface Recommendation {
  crop: string;
  soilType: string;
  season: string;
  yield: number;
  variety: string;
  fertilizer: string;
  marketPrice: number;
  estimatedYield: string;
  estimatedProfit: string;
  suitabilityScore: number;
}

interface RecommendationResponse {
  recommendations: Recommendation[];
  weather: {
    temp: number;
    rainfall: number;
  };
  soil: {
    soilType: string;
  };
}

const Recommendations = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { recommendations: RecommendationResponse } | undefined;

  if (!state || !state.recommendations) {
    // If no recommendations, redirect back to form
    navigate("/home", { replace: true });
    return null;
  }

  const { recommendations, weather, soil } = state.recommendations;

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Environmental Conditions
            </h2>
            <p className="text-muted-foreground">
              Current conditions at your location
            </p>
          </div>
          <div className="flex justify-center">
            <EnvironmentInfo weather={weather} soil={soil} />
          </div>
          <div className="text-center pt-8">
            <h2 className="text-3xl font-bold text-foreground mb-2">
              Top Crop Recommendations
            </h2>
            <p className="text-muted-foreground">
              Based on your land and environmental conditions
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {recommendations.map((rec, index) => (
              <div
                key={index}
                className="animate-in fade-in slide-in-from-bottom-8 duration-700"
                style={{ animationDelay: `${index * 150}ms` }}
              >
                <CropCard recommendation={rec} rank={index + 1} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recommendations;