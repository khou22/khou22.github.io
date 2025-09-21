interface CalendarEventData {
  title: string;
  startTime: Date;
  endTime: Date;
  timezone: string;
  description?: string;
  location?: string;
}

/**
 * Generates a Google Calendar URL for creating a new event
 * 
 * @param eventData - Event details including title, times, timezone, etc.
 * @returns URL string for Google Calendar event creation
 */
export const generateGoogleCalendarUrl = (eventData: CalendarEventData): string => {
  const baseUrl = "https://calendar.google.com/calendar/render";
  
  // Format dates to YYYYMMDDTHHMMSSZ format for Google Calendar
  const formatDateForCalendar = (date: Date): string => {
    return date.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
  };

  const startFormatted = formatDateForCalendar(eventData.startTime);
  const endFormatted = formatDateForCalendar(eventData.endTime);
  
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: eventData.title,
    dates: `${startFormatted}/${endFormatted}`,
  });

  if (eventData.description) {
    params.append('details', eventData.description);
  }

  if (eventData.location) {
    params.append('location', eventData.location);
  }

  return `${baseUrl}?${params.toString()}`;
};

/**
 * Converts a local date/time to UTC for calendar API usage
 * 
 * @param date - Local date
 * @param timezone - Timezone string (e.g., "America/New_York")
 * @returns UTC Date object
 */
export const convertToUTC = (date: Date, timezone: string): Date => {
  // For now, return the date as-is since we're getting UTC times from the API
  // In the future, we could use a library like date-fns-tz for proper timezone conversion
  return date;
};
