import React from 'react';
import CalendarHeatmap from 'react-calendar-heatmap';
import 'react-calendar-heatmap/dist/styles.css';

// Data point type
export interface CalendarDay {
  date: string; // ISO yyyy-MM-dd
  count: number;
}

interface ContributionCalendarProps {
  data: CalendarDay[];
}

/**
 * GitHub-style contribution calendar for T-mobilitat validations.
 * We keep types permissive (`any`) inside callbacks to avoid the generic complexity
 * of `react-calendar-heatmap`, while still guarding against missing values.
 */
const ContributionCalendar: React.FC<ContributionCalendarProps> = ({ data }) => {
  if (!data || data.length === 0) return null;

  const today = new Date();
  const lastDateStr = data.reduce((max, d) => (d.date > max ? d.date : max), data[0].date);
  const lastDate = new Date(lastDateStr);
  const startDate = new Date(lastDate.getFullYear(), 0, 1);

  const getTooltipDataAttrs = (value: any) => {
    if (!value || !value.date) return {};
    const dateObj = new Date(value.date);
    const dateString = dateObj.toLocaleDateString('ca-ES', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
    return {
      'data-tooltip-id': 'heatmap-tooltip',
      'data-tooltip-content': `${dateString}: ${value.count} validacions`,
    };
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mt-8">
      <h3 className="text-xl font-bold mb-4 text-gray-800">Calendari d'ús</h3>
      <CalendarHeatmap
        startDate={startDate}
        endDate={today}
        values={data as any}
        classForValue={(value: any) => {
          if (!value || value.count === 0) return 'color-empty';
          const level = Math.min(4, value.count); // clamp 0-4
          return `color-scale-${level}`;
        }}
        tooltipDataAttrs={getTooltipDataAttrs}
        showWeekdayLabels
      />
    </div>
  );
};

export default ContributionCalendar;
