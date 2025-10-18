import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, Sprout, DollarSign, Beaker, TreePine } from 'lucide-react';

interface CropRecommendation {
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

interface CropCardProps {
  recommendation: CropRecommendation;
  rank: number;
}

export const CropCard = ({ recommendation, rank }: CropCardProps) => {
  const getBadgeColor = (rank: number) => {
    switch (rank) {
      case 1:
        return 'bg-gradient-to-r from-yellow-400 to-yellow-600 text-white';
      case 2:
        return 'bg-gradient-to-r from-gray-300 to-gray-500 text-white';
      case 3:
        return 'bg-gradient-to-r from-orange-400 to-orange-600 text-white';
      default:
        return 'bg-primary';
    }
  };

  return (
    <Card className="relative overflow-hidden hover:shadow-lg transition-all duration-300 border-border bg-gradient-to-br from-card to-muted/30">
      <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-primary/10 to-secondary/10 rounded-bl-[100px] -z-0" />
      
      <CardHeader className="relative">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold text-foreground flex items-center gap-2">
            <TreePine className="h-6 w-6 text-primary" />
            {recommendation.crop}
          </CardTitle>
          <Badge className={`${getBadgeColor(rank)} font-bold`}>
            #{rank}
          </Badge>
        </div>
        <div className="flex flex-wrap gap-2 mt-2">
          <Badge variant="outline" className="border-primary text-primary">
            {recommendation.season}
          </Badge>
          <Badge variant="outline" className="border-accent text-accent">
            {recommendation.soilType}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 relative">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span>Estimated Yield</span>
            </div>
            <p className="text-xl font-bold text-foreground">
              {recommendation.estimatedYield} t
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <DollarSign className="h-4 w-4 text-secondary" />
              <span>Est. Profit</span>
            </div>
            <p className="text-xl font-bold text-secondary">
              ₹{parseInt(recommendation.estimatedProfit).toLocaleString()}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Sprout className="h-4 w-4 text-accent" />
              <span>Variety</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {recommendation.variety}
            </p>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Beaker className="h-4 w-4 text-accent" />
              <span>Fertilizer</span>
            </div>
            <p className="text-sm font-semibold text-foreground">
              {recommendation.fertilizer}
            </p>
          </div>
        </div>

        <div className="pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Suitability Score</span>
            <div className="flex items-center gap-2">
              <div className="h-2 w-32 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-secondary rounded-full transition-all duration-500"
                  style={{ width: `${recommendation.suitabilityScore}%` }}
                />
              </div>
              <span className="text-sm font-bold text-primary">
                {Math.round(recommendation.suitabilityScore)}%
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};