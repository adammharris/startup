import { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import Spinner from "react-bootstrap/Spinner";
import Button from "react-bootstrap/Button";

// Define interfaces for weather data
interface WeatherData {
  current: {
    temperature_2m: number;
    weather_code: number;
    is_day: number;
  };
  current_units: {
    temperature_2m: string;
  };
}

const WeatherWidget: React.FC = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [usingDefaultLocation, setUsingDefaultLocation] =
    useState<boolean>(true);

  // Function to get weather emoji based on weather code
  const getWeatherEmoji = (code: number, isDay: number): string => {
    // Weather codes from Open-Meteo API
    if (code === 0) return isDay ? "☀️" : "🌙"; // Clear sky
    if (code <= 3) return "☁️"; // Cloudy
    if (code <= 48) return "🌫️"; // Fog
    if (code <= 57) return "🌧️"; // Drizzle
    if (code <= 65) return "🌧️"; // Rain
    if (code <= 77) return "❄️"; // Snow
    if (code <= 82) return "🌦️"; // Rain showers
    if (code <= 86) return "🌨️"; // Snow showers
    if (code <= 99) return "⛈️"; // Thunderstorm
    return "🌈"; // Default
  };

  const fetchWeather = async (useUserLocation = false) => {
    setLoading(true);
    setError(null);

    try {
      // Default to coordinates for Provo, UT
      let lat = 40.2338;
      let lon = -111.6585;

      // Try to get user's current location only if requested
      if (useUserLocation && navigator.geolocation) {
        try {
          const position = await new Promise<GeolocationPosition>(
            (resolve, reject) => {
              navigator.geolocation.getCurrentPosition(resolve, reject, {
                timeout: 10000,
                enableHighAccuracy: false,
              });
            },
          );

          lat = position.coords.latitude;
          lon = position.coords.longitude;
          setUsingDefaultLocation(false);
        } catch (err) {
          console.warn("Could not get location, using default:", err);
          setUsingDefaultLocation(true);
        }
      }

      // Fetch weather from Open-Meteo API
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,weather_code,is_day`,
      );

      if (!response.ok) {
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data = await response.json();
      setWeather(data);
    } catch (err) {
      console.error("Failed to fetch weather:", err);
      setError("Could not load weather data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch weather with default location on component mount
  /*useEffect(() => {
    fetchWeather();
    }, []);*/

  // Handler for the location button
  const handleUseMyLocation = () => {
    fetchWeather(true);
  };

  return (
    <Card className="mb-4 shadow-sm">
      <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
          <Card.Title>Current Weather</Card.Title>
          <Button onClick={() => fetchWeather()} className="p-0">
            🔄
          </Button>
        </div>
        {loading ? (
          <div className="text-center py-3">
            <Spinner animation="border" size="sm" />
            <span className="ms-2">Loading weather...</span>
          </div>
        ) : error ? (
          <p className="text-muted">{error}</p>
        ) : weather ? (
          <>
            <div className="d-flex align-items-center mb-2">
              <span style={{ fontSize: "2rem" }}>
                {getWeatherEmoji(
                  weather.current.weather_code,
                  weather.current.is_day,
                )}
              </span>
              <div className="ms-3">
                <h3 className="mb-0">
                  {weather.current.temperature_2m}
                  {weather.current_units.temperature_2m}
                </h3>
                {usingDefaultLocation && (
                  <small className="text-muted">Showing for Provo, UT</small>
                )}
              </div>
            </div>
            {usingDefaultLocation && (
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleUseMyLocation}
                className="mt-2"
              >
                Use my location
              </Button>
            )}
          </>
        ) : (
          <p className="text-muted">Weather information unavailable</p>
        )}
      </Card.Body>
    </Card>
  );
};

export default WeatherWidget;
