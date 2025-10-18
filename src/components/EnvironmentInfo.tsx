import { Card, CardContent } from '@/components/ui/card';
import { Cloud, Thermometer, Mountain } from 'lucide-react';

interface EnvironmentInfoProps {
  weather: {
    temp: number;
    rainfall: number;
  };
  soil: {
    soilType: string;
  };
}

export const EnvironmentInfo = ({ weather, soil }: EnvironmentInfoProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 w-full max-w-4xl">
      <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-blue-500 rounded-lg">
              <Thermometer className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Temperature</p>
              <p className="text-2xl font-bold text-foreground">{weather.temp.toFixed(1)}°C</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-950 dark:to-cyan-900 border-cyan-200 dark:border-cyan-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-cyan-500 rounded-lg">
              <Cloud className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Rainfall</p>
              <p className="text-2xl font-bold text-foreground">{weather.rainfall.toFixed(1)} mm</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-gradient-to-br from-amber-50 to-amber-100 dark:from-amber-950 dark:to-amber-900 border-amber-200 dark:border-amber-800">
        <CardContent className="pt-6">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-amber-600 rounded-lg">
              <Mountain className="h-6 w-6 text-white" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Soil Type</p>
              <p className="text-xl font-bold text-foreground">{soil.soilType}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};