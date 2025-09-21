import { Metadata } from "next";
import { FlightCalendar } from "./FlightCalendar";
import { PageWrapper } from "@/components/organisms/PageWrapper/PageWrapper";

export const metadata: Metadata = {
  title: "Flight Calendar Tool | Kevin Hou",
  description: "Search flights by flight number and add them to Google Calendar with timezone support",
};

const FlightCalendarPage = () => {
  return (
    <PageWrapper maxWidth="wide">
      <h1 className="mb-4 text-center leading-loose">Flight Calendar Tool</h1>
      <p className="mb-8 text-center text-gray-600">
        Search for flights by flight number and add them to your Google Calendar with proper timezone support.
      </p>
      <FlightCalendar />
    </PageWrapper>
  );
};

export default FlightCalendarPage;
