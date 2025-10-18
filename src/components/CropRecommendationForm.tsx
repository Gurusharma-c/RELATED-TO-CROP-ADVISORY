import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Loader2, Sprout } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface CropRecommendationFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  isLoading: boolean;
}

export interface FormData {
  landSize: number;
  latitude: number;
  longitude: number;
  season: string;
}

export const CropRecommendationForm = ({ onSubmit, isLoading }: CropRecommendationFormProps) => {
  const { toast } = useToast();
  const [formData, setFormData] = useState<FormData>({
    landSize: 1,
    latitude: 28.7041,
    longitude: 77.1025,
    season: 'Kharif',
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (formData.landSize <= 0) {
      toast({
        title: "Invalid Input",
        description: "Land size must be greater than 0",
        variant: "destructive",
      });
      return;
    }

    if (formData.latitude < -90 || formData.latitude > 90) {
      toast({
        title: "Invalid Latitude",
        description: "Latitude must be between -90 and 90",
        variant: "destructive",
      });
      return;
    }

    if (formData.longitude < -180 || formData.longitude > 180) {
      toast({
        title: "Invalid Longitude",
        description: "Longitude must be between -180 and 180",
        variant: "destructive",
      });
      return;
    }

    await onSubmit(formData);
  };

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setFormData({
            ...formData,
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
          toast({
            title: "Location Updated",
            description: "Your current location has been set",
          });
        },
        (error) => {
          toast({
            title: "Location Error",
            description: "Could not get your location. Using default location.",
            variant: "destructive",
          });
        }
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 w-full max-w-2xl">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="landSize" className="text-foreground font-medium">
            Land Size (hectares)
          </Label>
          <Input
            id="landSize"
            type="number"
            step="0.1"
            min="0.1"
            value={formData.landSize}
            onChange={(e) => setFormData({ ...formData, landSize: parseFloat(e.target.value) })}
            className="bg-card border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="season" className="text-foreground font-medium">
            Season
          </Label>
          <Select
            value={formData.season}
            onValueChange={(value) => setFormData({ ...formData, season: value })}
          >
            <SelectTrigger id="season" className="bg-card border-border">
              <SelectValue placeholder="Select season" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Kharif">Kharif (Monsoon)</SelectItem>
              <SelectItem value="Rabi">Rabi (Winter)</SelectItem>
              <SelectItem value="Summer">Summer</SelectItem>
              <SelectItem value="Year-round">Year-round</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="latitude" className="text-foreground font-medium">
            Latitude
          </Label>
          <Input
            id="latitude"
            type="number"
            step="0.0001"
            value={formData.latitude}
            onChange={(e) => setFormData({ ...formData, latitude: parseFloat(e.target.value) })}
            className="bg-card border-border"
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="longitude" className="text-foreground font-medium">
            Longitude
          </Label>
          <Input
            id="longitude"
            type="number"
            step="0.0001"
            value={formData.longitude}
            onChange={(e) => setFormData({ ...formData, longitude: parseFloat(e.target.value) })}
            className="bg-card border-border"
            required
          />
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={getCurrentLocation}
          className="flex-1 border-primary text-primary hover:bg-primary hover:text-primary-foreground"
        >
          Use My Location
        </Button>
        <Button
          type="submit"
          disabled={isLoading}
          className="flex-1 bg-gradient-to-r from-primary to-secondary hover:opacity-90 text-white font-semibold"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Analyzing...
            </>
          ) : (
            <>
              <Sprout className="mr-2 h-4 w-4" />
              Get Recommendations
            </>
          )}
        </Button>
      </div>
    </form>
  );
};