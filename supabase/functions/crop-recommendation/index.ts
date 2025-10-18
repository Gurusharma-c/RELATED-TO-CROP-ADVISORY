import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CropData {
  Crop: string;
  SoilType: string;
  Season: string;
  MinRain: number;
  MaxRain: number;
  MinTemp: number;
  MaxTemp: number;
  Yield: number;
  Variety: string;
  Fertilizer: string;
  MarketPrice: number;
}

interface WeatherData {
  temp: number;
  rainfall: number;
}

interface SoilData {
  soilType: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { landSize, latitude, longitude, season } = await req.json();
    
    console.log('Received request:', { landSize, latitude, longitude, season });

    // Fetch weather data from OpenWeatherMap
    const weatherData = await fetchWeatherData(latitude, longitude);
    console.log('Weather data:', weatherData);

    // Fetch soil data from SoilGrids
    const soilData = await fetchSoilData(latitude, longitude);
    console.log('Soil data:', soilData);

    // Load crop dataset
    const crops = await loadCropDataset();
    console.log(`Loaded ${crops.length} crops from dataset`);

    // Find matching crops
    const matchingCrops = findMatchingCrops(
      crops,
      soilData.soilType,
      season,
      weatherData.temp,
      weatherData.rainfall
    );

    console.log(`Found ${matchingCrops.length} matching crops`);

    // Calculate recommendations with profit
    const recommendations = matchingCrops
      .map(crop => ({
        crop: crop.Crop,
        soilType: crop.SoilType,
        season: crop.Season,
        yield: crop.Yield,
        variety: crop.Variety,
        fertilizer: crop.Fertilizer,
        marketPrice: crop.MarketPrice,
        estimatedYield: (crop.Yield * landSize).toFixed(2),
        estimatedProfit: ((crop.Yield * landSize * crop.MarketPrice * 1000) - (landSize * 50000)).toFixed(0), // Rough profit calculation
        suitabilityScore: calculateSuitabilityScore(crop, weatherData, season)
      }))
      .sort((a, b) => b.suitabilityScore - a.suitabilityScore)
      .slice(0, 3);

    return new Response(
      JSON.stringify({
        recommendations,
        weather: weatherData,
        soil: soilData,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error in crop-recommendation function:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});

async function fetchWeatherData(lat: number, lon: number): Promise<WeatherData> {
  const apiKey = Deno.env.get('OPENWEATHER_API_KEY');
  const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Weather API error: ${response.statusText}`);
  }
  
  const data = await response.json();
  
  return {
    temp: data.main.temp,
    rainfall: data.rain?.['1h'] || 0, // Current rainfall, we'll estimate yearly
  };
}

async function fetchSoilData(lat: number, lon: number): Promise<SoilData> {
  const url = `https://rest.isric.org/soilgrids/v2.0/properties/query?lon=${lon}&lat=${lat}&property=clay&property=sand&depth=0-5cm&value=mean`;
  
  try {
    const response = await fetch(url);
    if (!response.ok) {
      console.warn('SoilGrids API error, using default soil type');
      return { soilType: 'Loam' };
    }
    
    const data = await response.json();
    const clayContent = data.properties.layers[0]?.depths[0]?.values?.mean || 25;
    const sandContent = data.properties.layers[1]?.depths[0]?.values?.mean || 40;
    
    // Classify soil based on clay and sand content
    let soilType = 'Loam';
    if (clayContent > 40) soilType = 'Clay';
    else if (sandContent > 70) soilType = 'Sandy';
    else if (clayContent > 27 && sandContent < 20) soilType = 'Clay-Loam';
    else if (sandContent > 50 && clayContent < 20) soilType = 'Sandy-Loam';
    else if (clayContent < 15 && sandContent < 15) soilType = 'Black-Soil';
    
    return { soilType };
  } catch (error) {
    console.warn('Error fetching soil data:', error);
    return { soilType: 'Loam' };
  }
}

async function loadCropDataset(): Promise<CropData[]> {
  // This loads from the public folder - in production, you might want to use Supabase Storage
  const csvUrl = 'https://raw.githubusercontent.com/yourusername/yourrepo/main/public/data/crops.csv';
  
  // For now, we'll use hardcoded data since we can't easily fetch from public folder
  // In a real deployment, you'd upload this to Supabase Storage or use a CDN
  const csvData = `Crop,SoilType,Season,MinRain,MaxRain,MinTemp,MaxTemp,Yield,Variety,Fertilizer,MarketPrice
Rice,Clay,Kharif,1000,2500,20,35,4.5,Basmati,NPK 120:60:40,40
Wheat,Loam,Rabi,450,650,10,25,3.8,HD-2967,Urea 120kg/ha,25
Maize,Sandy-Loam,Kharif,600,1200,18,30,5.2,Pioneer,DAP 100kg/ha,20
Cotton,Black-Soil,Kharif,600,1000,21,32,2.8,Bt-Cotton,NPK 80:40:40,60
Sugarcane,Loam,Year-round,1500,2500,20,35,70,Co-86032,Urea 150kg/ha,3
Soybean,Loam,Kharif,750,1200,20,32,2.5,JS-335,DAP 80kg/ha,45
Potato,Sandy-Loam,Rabi,500,700,15,25,25,Kufri-Jyoti,NPK 120:80:100,15
Tomato,Loam,Year-round,600,1000,18,30,40,Pusa-Ruby,NPK 100:50:50,30
Banana,Loam,Year-round,1200,2700,15,35,40,Grand-Naine,NPK 200:100:200,35`;
  
  const lines = csvData.split('\n');
  const headers = lines[0].split(',');
  
  return lines.slice(1).map(line => {
    const values = line.split(',');
    return {
      Crop: values[0],
      SoilType: values[1],
      Season: values[2],
      MinRain: parseFloat(values[3]),
      MaxRain: parseFloat(values[4]),
      MinTemp: parseFloat(values[5]),
      MaxTemp: parseFloat(values[6]),
      Yield: parseFloat(values[7]),
      Variety: values[8],
      Fertilizer: values[9],
      MarketPrice: parseFloat(values[10]),
    };
  });
}

function findMatchingCrops(
  crops: CropData[],
  soilType: string,
  season: string,
  temp: number,
  rainfall: number
): CropData[] {
  return crops.filter(crop => {
    const soilMatch = crop.SoilType.toLowerCase().includes(soilType.toLowerCase()) || 
                     soilType.toLowerCase().includes(crop.SoilType.toLowerCase()) ||
                     crop.Season === 'Year-round';
    
    const seasonMatch = crop.Season === season || crop.Season === 'Year-round';
    
    const tempMatch = temp >= crop.MinTemp && temp <= crop.MaxTemp;
    
    // Since we only get current rainfall, we'll be more lenient
    const rainfallEstimate = rainfall * 8760; // Very rough yearly estimate
    const rainfallMatch = true; // We'll match all for rainfall since it's hard to estimate
    
    return (soilMatch || crop.Season === 'Year-round') && seasonMatch && tempMatch;
  });
}

function calculateSuitabilityScore(crop: CropData, weather: WeatherData, season: string): number {
  let score = 0;
  
  // Season match
  if (crop.Season === season) score += 40;
  if (crop.Season === 'Year-round') score += 35;
  
  // Temperature suitability
  const tempRange = crop.MaxTemp - crop.MinTemp;
  const tempPosition = (weather.temp - crop.MinTemp) / tempRange;
  if (tempPosition >= 0.3 && tempPosition <= 0.7) score += 30;
  else if (tempPosition >= 0 && tempPosition <= 1) score += 20;
  
  // Yield and market value
  const profitPotential = crop.Yield * crop.MarketPrice;
  score += Math.min(30, profitPotential / 100);
  
  return score;
}