'use server';

export interface FlightData {
  flightNumber: string;
  airline: string;
  origin: string;
  destination: string;
  departureTime: string; // ISO string
  arrivalTime: string; // ISO string
  date: string;
  terminal?: string;
  gate?: string;
  status?: string;
}

export interface FlightSearchResult {
  flights: FlightData[];
  source: string;
  error?: string;
}

/**
 * Server action to search for flights by flight number using real flight data APIs
 * 
 * @param flightNumber - Flight number (e.g., "DL1107", "DL2089")
 * @returns Promise<FlightSearchResult> - Flight data or error from real APIs
 */
export async function searchFlightData(flightNumber: string): Promise<FlightSearchResult> {
  if (!flightNumber || !flightNumber.trim()) {
    return {
      flights: [],
      source: 'none',
      error: 'Flight number is required'
    };
  }

  try {
    // Try OpenSky Network API first (free, no key required)
    const flights = await searchOpenSkyNetwork(flightNumber);
    return { flights, source: 'opensky' };
  } catch (openskyError) {
    console.warn('OpenSky failed:', openskyError);
    
    // Try AviationStack API if key is available
    try {
      const flights = await searchAviationStack(flightNumber);
      return { flights, source: 'aviationstack' };
    } catch (aviationStackError) {
      console.warn('AviationStack failed:', aviationStackError);
      
      // Try FlightLabs API (has free tier)
      try {
        const flights = await searchFlightLabs(flightNumber);
        return { flights, source: 'flightlabs' };
      } catch (flightLabsError) {
        console.warn('FlightLabs failed:', flightLabsError);
        
        // Return error with helpful message
        return {
          flights: [],
          source: 'none',
          error: 'Unable to fetch flight data from available sources. Please verify the flight number and try again.',
        };
      }
    }
  }
}

/**
 * Search flights using AviationStack API
 */
async function searchAviationStack(flightNumber: string): Promise<FlightData[]> {
  const apiKey = process.env.AVIATIONSTACK_API_KEY;
  if (!apiKey) {
    throw new Error('AviationStack API key not configured');
  }
  
  const url = `http://api.aviationstack.com/v1/flights?access_key=${apiKey}&flight_iata=${flightNumber}`;
  
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'FlightCalendarTool/1.0'
    }
  });
  
  if (!response.ok) {
    throw new Error(`AviationStack API failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    throw new Error('No flights found');
  }
  
  return data.data.map((flight: any) => ({
    flightNumber: flight.flight?.iata || flightNumber,
    airline: flight.airline?.name || 'Unknown',
    origin: flight.departure?.iata || 'Unknown',
    destination: flight.arrival?.iata || 'Unknown',
    departureTime: flight.departure?.scheduled || new Date().toISOString(),
    arrivalTime: flight.arrival?.scheduled || new Date().toISOString(),
    date: flight.flight_date || new Date().toISOString().split('T')[0],
    terminal: flight.departure?.terminal,
    gate: flight.departure?.gate,
    status: flight.flight_status
  }));
}

/**
 * Search using OpenSky Network API (free, limited data)
 */
async function searchOpenSkyNetwork(flightNumber: string): Promise<FlightData[]> {
  // Try current flights first
  try {
    const currentUrl = `https://opensky-network.org/api/states/all`;
    const currentResponse = await fetch(currentUrl);
    
    if (currentResponse.ok) {
      const currentData = await currentResponse.json();
      const currentFlights = currentData.states || [];
      
      // Filter for matching callsign (flight number)
      const matchedCurrentFlights = currentFlights.filter((state: any[]) => {
        const callsign = state[1]; // Callsign is at index 1
        return callsign && callsign.trim().toUpperCase().includes(flightNumber.toUpperCase());
      });
      
      if (matchedCurrentFlights.length > 0) {
        // Convert current flight states to our format
        return matchedCurrentFlights.slice(0, 5).map((state: any[]) => {
          const now = new Date();
          const departureTime = new Date(now.getTime() - 2 * 60 * 60 * 1000); // Estimate 2 hours ago
          const arrivalTime = new Date(now.getTime() + 2 * 60 * 60 * 1000); // Estimate 2 hours from now
          
          return {
            flightNumber: state[1]?.trim() || flightNumber,
            airline: extractAirlineFromCallsign(state[1]?.trim() || flightNumber),
            origin: state[2] || 'Unknown', // Origin country
            destination: 'Unknown',
            departureTime: departureTime.toISOString(),
            arrivalTime: arrivalTime.toISOString(),
            date: now.toISOString().split('T')[0],
            status: 'live'
          };
        });
      }
    }
  } catch (error) {
    console.warn('Current flights API failed, trying historical');
  }
  
  // Fallback to historical data
  const historicalUrl = `https://opensky-network.org/api/flights/all?begin=${Math.floor(Date.now()/1000) - 86400}&end=${Math.floor(Date.now()/1000)}`;
  
  const response = await fetch(historicalUrl);
  if (!response.ok) {
    throw new Error(`OpenSky Network failed: ${response.status}`);
  }
  
  const flights = await response.json();
  
  // Filter for matching callsign (flight number)
  const matchedFlights = flights.filter((flight: any) => 
    flight.callsign && flight.callsign.trim().toUpperCase().includes(flightNumber.toUpperCase())
  );
  
  if (matchedFlights.length === 0) {
    throw new Error('No matching flights found in OpenSky data');
  }
  
  // Convert OpenSky data to our format (limited info available)
  return matchedFlights.slice(0, 10).map((flight: any) => {
    const departureTime = new Date(flight.firstSeen * 1000);
    const arrivalTime = new Date(flight.lastSeen * 1000);
    
    return {
      flightNumber: flight.callsign?.trim() || flightNumber,
      airline: extractAirlineFromCallsign(flight.callsign?.trim() || flightNumber),
      origin: flight.estDepartureAirport || 'Unknown',
      destination: flight.estArrivalAirport || 'Unknown',
      departureTime: departureTime.toISOString(),
      arrivalTime: arrivalTime.toISOString(),
      date: departureTime.toISOString().split('T')[0],
      status: 'historical'
    };
  });
}

/**
 * Search using FlightLabs API (has free tier)
 */
async function searchFlightLabs(flightNumber: string): Promise<FlightData[]> {
  const apiKey = process.env.FLIGHTLABS_API_KEY;
  if (!apiKey) {
    throw new Error('FlightLabs API key not configured');
  }
  
  const url = `https://api.flightlabs.io/schedules?flight_iata=${flightNumber}&api_key=${apiKey}`;
  
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`FlightLabs API failed: ${response.status}`);
  }
  
  const data = await response.json();
  
  if (!data.data || data.data.length === 0) {
    throw new Error('No flights found in FlightLabs data');
  }
  
  return data.data.map((flight: any) => ({
    flightNumber: flight.flight_iata || flightNumber,
    airline: flight.airline_name || 'Unknown',
    origin: flight.dep_iata || 'Unknown',
    destination: flight.arr_iata || 'Unknown',
    departureTime: flight.dep_time || new Date().toISOString(),
    arrivalTime: flight.arr_time || new Date().toISOString(),
    date: flight.flight_date || new Date().toISOString().split('T')[0],
    terminal: flight.dep_terminal,
    gate: flight.dep_gate,
    status: flight.status
  }));
}

/**
 * Extract airline name from flight callsign
 */
function extractAirlineFromCallsign(callsign: string): string {
  const airlineMapping: Record<string, string> = {
    'DL': 'Delta Air Lines',
    'AA': 'American Airlines', 
    'UA': 'United Airlines',
    'SW': 'Southwest Airlines',
    'B6': 'JetBlue Airways',
    'AS': 'Alaska Airlines',
    'NK': 'Spirit Airlines',
    'F9': 'Frontier Airlines'
  };
  
  const prefix = callsign.substring(0, 2).toUpperCase();
  return airlineMapping[prefix] || 'Unknown Airline';
}
