import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CropRecommendationForm, FormData } from '@/components/CropRecommendationForm';
import { CropCard } from '@/components/CropCard';
import { EnvironmentInfo } from '@/components/EnvironmentInfo';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Sprout, Leaf } from 'lucide-react';

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

const Index = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (formData: FormData) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('crop-recommendation', {
        body: formData,
      });
      if (error) throw error;
      toast({
        title: "Success!",
        description: `Found ${data.recommendations.length} suitable crops for your land`,
      });
      // Navigate to recommendations page with results
      navigate("/recommendations", { state: { recommendations: data } });
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to get recommendations. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-muted/30 to-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary via-primary to-secondary py-16 px-4">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        <div className="relative max-w-6xl mx-auto text-center">
          <div className="flex justify-center mb-6">
            <div className="p-4 bg-white/20 backdrop-blur-sm rounded-full">
              <Sprout className="h-16 w-16 text-white" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4 drop-shadow-lg">
            Smart Crop Advisory System
          </h1>
          <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto drop-shadow">
            Get AI-powered crop recommendations based on your land, soil, and weather conditions
          </p>
          <div className="flex justify-center gap-4 mt-8">
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Leaf className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Soil Analysis</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Leaf className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Weather Data</span>
            </div>
            <div className="flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full">
              <Leaf className="h-5 w-5 text-white" />
              <span className="text-white font-semibold">Profit Estimates</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex flex-col items-center gap-12">
          {/* Form Section */}
          <div className="w-full bg-card rounded-2xl shadow-lg p-8 border border-border">
            <h2 className="text-2xl font-bold text-foreground mb-6 text-center">
              Enter Your Farm Details
            </h2>
            <div className="flex justify-center">
              <CropRecommendationForm onSubmit={handleSubmit} isLoading={isLoading} />
            </div>
          </div>

          {/* Results Section moved to Recommendations page */}

          {/* Info Cards */}
          {!isLoading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full mt-8">
              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🌱</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Soil Analysis</h3>
                <p className="text-muted-foreground text-sm">
                  Automatically detect soil type using SoilGrids API for accurate recommendations
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">🌤️</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Weather Integration</h3>
                <p className="text-muted-foreground text-sm">
                  Real-time weather data from OpenWeatherMap to match crops with current conditions
                </p>
              </div>

              <div className="bg-card p-6 rounded-xl border border-border hover:shadow-md transition-shadow">
                <div className="text-4xl mb-4">💰</div>
                <h3 className="text-lg font-bold text-foreground mb-2">Profit Estimates</h3>
                <p className="text-muted-foreground text-sm">
                  Calculate potential yield and profit based on market prices and land size
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-card border-t border-border mt-20 py-8">
        <div className="max-w-6xl mx-auto px-4 text-center text-muted-foreground">
          <p>© 2025 Smart Crop Advisory System. Empowering farmers with data-driven decisions.</p>
        </div>
      </footer>
    </div>
  );
};

export default Index;