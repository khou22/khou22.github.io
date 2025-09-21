"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getCurrentTimeZone } from "@/utils/timezone";
import { generateGoogleCalendarUrl } from "@/utils/googleCalendar";
import { searchFlights } from "@/api-clients/FlightDataClient";

interface FlightData {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: Date;
  arrivalTime: Date;
  date: string;
  terminal?: string;
  gate?: string;
}

export const FlightCalendar = () => {
  const [flightNumber, setFlightNumber] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [flights, setFlights] = useState<FlightData[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = useCallback(async () => {
    if (!flightNumber.trim()) {
      toast.error("Please enter a flight number");
      return;
    }

    setIsLoading(true);
    setError(null);
    setFlights([]);

    try {
      const searchResults = await searchFlights(flightNumber.trim());
      setFlights(searchResults);
      
      if (searchResults.length === 0) {
        setError("No flights found for this flight number in the next 30 days");
      } else {
        toast.success(`Found ${searchResults.length} flights`);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to search flights";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [flightNumber]);

  const handleAddToCalendar = useCallback((flight: FlightData) => {
    try {
      const userTimezone = getCurrentTimeZone();
      const calendarUrl = generateGoogleCalendarUrl({
        title: `Flight ${flight.flightNumber} - ${flight.origin} to ${flight.destination}`,
        startTime: flight.departureTime,
        endTime: flight.arrivalTime,
        timezone: userTimezone,
        description: `${flight.airline} Flight ${flight.flightNumber}\nFrom: ${flight.origin}\nTo: ${flight.destination}${flight.terminal ? `\nTerminal: ${flight.terminal}` : ""}${flight.gate ? `\nGate: ${flight.gate}` : ""}`
      });
      
      window.open(calendarUrl, '_blank');
      toast.success("Opening Google Calendar...");
    } catch (err) {
      toast.error("Failed to create calendar event");
    }
  }, []);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString([], { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Search Form */}
      <Card>
        <CardHeader>
          <CardTitle>Search Flights</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <Label htmlFor="flightNumber">Flight Number</Label>
              <Input
                id="flightNumber"
                value={flightNumber}
                onChange={(e) => setFlightNumber(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="e.g., DL1107, BA123, AA456"
                className="flex-1"
              />
            </div>
            <div className="flex gap-2">
              <Button 
                onClick={handleSearch} 
                disabled={isLoading}
                className="flex-1"
              >
                {isLoading ? "Searching..." : "Search Flights"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="pt-6">
            <p className="text-red-600">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Flight Results */}
      {flights.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-semibold">
            Found {flights.length} flight{flights.length === 1 ? '' : 's'} in the next 30 days
          </h2>
          <div className="grid gap-4">
            {flights.map((flight, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg">{flight.airline} {flight.flightNumber}</h3>
                        <span className="text-sm text-gray-500">{flight.date}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div>
                          <span className="font-medium">{flight.origin}</span>
                          <div className="text-gray-500">
                            {formatTime(flight.departureTime)}
                          </div>
                        </div>
                        <div className="text-gray-400">→</div>
                        <div>
                          <span className="font-medium">{flight.destination}</span>
                          <div className="text-gray-500">
                            {formatTime(flight.arrivalTime)}
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {formatDate(flight.departureTime)}
                        {flight.terminal && ` • Terminal ${flight.terminal}`}
                        {flight.gate && ` • Gate ${flight.gate}`}
                      </div>
                    </div>
                    <Button 
                      onClick={() => handleAddToCalendar(flight)}
                      className="ml-4"
                    >
                      Add to Calendar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
