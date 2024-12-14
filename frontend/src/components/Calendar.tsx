import React, { useState } from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

interface CalendarComponentProps {
  onDateSelect: (date: Date) => void;
}

const CalendarComponent: React.FC<CalendarComponentProps> = ({ onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  // Function to disable weekends
  const isWeekday = ({ date }: { date: Date }): boolean => {
    const day = date.getDay();
    return day !== 0 && day !== 6; // 0 = Sunday, 6 = Saturday
  };

  const handleDateChange = (value: Date | [Date, Date] | null) => {
    if (value && !Array.isArray(value)) {
      setSelectedDate(value);
      onDateSelect(value);
    }
  };

  return (
    <div>
      <h3>Select a Date</h3>
      <Calendar
        onChange={(value) => handleDateChange(value as Date | [Date, Date] | null)}
        value={selectedDate}
        tileDisabled={({ date }) => !isWeekday({ date })} // Disable weekends
        selectRange={false} // Ensure single date selection
      />
    </div>
  );
};

export default CalendarComponent;
