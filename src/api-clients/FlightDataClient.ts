import { searchFlightData } from '@/actions/flightActions';

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
  status?: string;
}

/**
 * Searches for flights by flight number using real flight data APIs only
 * Now uses server actions instead of API routes for better performance
 * 
 * @param flightNumber - Flight number (e.g., "DL1107", "DL2089")
 * @returns Promise<FlightData[]> - Array of matching flights from real APIs
 * @throws Error when no flight data is available or APIs are unavailable
 */
export const searchFlights = async (flightNumber: string): Promise<FlightData[]> => {
  if (!flightNumber || !flightNumber.trim()) {
    throw new Error('Flight number is required');
  }

  try {
    // Call server action that integrates with real flight APIs
    const result = await searchFlightData(flightNumber.trim());

    // Check for errors
    if (result.error) {
      throw new Error(result.error);
    }

    // Validate we have real flight data
    if (!result.flights || result.flights.length === 0) {
      throw new Error(`No flights found for ${flightNumber.toUpperCase()}. Please verify the flight number and try again.`);
    }

    // Transform server action response to our FlightData interface
    const flights = result.flights.map(flight => ({
      flightNumber: flight.flightNumber,
      airline: flight.airline,
      origin: flight.origin,
      destination: flight.destination,
      departureTime: new Date(flight.departureTime),
      arrivalTime: new Date(flight.arrivalTime),
      date: flight.date,
      terminal: flight.terminal,
      gate: flight.gate,
      status: flight.status
    }));

    console.log(`Found ${flights.length} real flights for ${flightNumber} from ${result.source}`);
    return flights;

  } catch (error) {
    console.error(`Flight search failed for ${flightNumber}:`, error);

    // Re-throw with enhanced error message for production use
    if (error instanceof Error) {
      throw error;
    }

    throw new Error('Flight data service is currently unavailable. Please try again later.');
  }
};
