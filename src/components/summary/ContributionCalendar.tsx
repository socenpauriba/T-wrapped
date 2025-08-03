import React from 'react';

import { Tooltip } from 'react-tooltip';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Type definitions outdated, squareSize not included
import CalendarHeatmapOriginal from 'react-calendar-heatmap';
// cast to any to allow custom props like squareSize
const Heatmap: any = CalendarHeatmapOriginal;
import { CalendarDays } from 'lucide-react';
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

  
    const lastDateStr = data.reduce((max, d) => (d.date > max ? d.date : max), data[0].date);
  const firstDateStr = data.reduce((min, d) => (d.date < min ? d.date : min), data[0].date);
  const lastDate = new Date(lastDateStr);
  const startDate = new Date(firstDateStr);

  

  // Determine if range spans multiple years
  const firstYear = startDate.getFullYear();
  const lastYear = lastDate.getFullYear();
  const years: number[] = [];
  for (let y = firstYear; y <= lastYear; y += 1) years.push(y);

  const renderHeatmap = (year: number) => {
    const SQUARE = 12;
    const GUTTER = 3;
    const yearStart = year === firstYear ? startDate : new Date(year, 0, 1);
    const yearEnd = year === lastYear ? lastDate : new Date(year, 11, 31);
    // number of weeks shown (inclusive)
    const millisInWeek = 1000 * 60 * 60 * 24 * 7;
    const weeks = Math.ceil((yearEnd.getTime() - yearStart.getTime()) / millisInWeek) + 1;
    const svgWidth = weeks * (SQUARE + GUTTER);
    const yearValues = data.filter((d) => new Date(d.date).getFullYear() === year);
    return (
      <div key={year} className="mb-8">
        {years.length > 1 && (
          <h4 className="text-lg font-semibold text-gray-700 mb-2">{year}</h4>
        )}
        
        <Heatmap
          squareSize={SQUARE}
          gutterSize={GUTTER}
          svgProps={{ width: svgWidth }}
          
          showWeekdayLabels
          weekdayLabels={["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"]}
          monthLabels={["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"]}
          startDate={yearStart}
          endDate={yearEnd}
          values={yearValues as any}
          
          tooltipDataAttrs={(value: any) => {
            if (!value || !value.date) {
              return { 'data-tooltip-id': 'cal-tip', 'data-tooltip-content': '' };
            }
            const dateObj = new Date(value.date);
            const day = dateObj.getDate();
            const monthNames = ["gener","febrer","març","abril","maig","juny","juliol","agost","setembre","octubre","novembre","desembre"];
            const monthName = monthNames[dateObj.getMonth()];
            const count = value.count || 0;
            return {
              'data-tooltip-id': 'cal-tip',
              'data-tooltip-content': `${count === 0 ? 'Sense validacions' : count + ' validacions'} el ${day} de ${monthName}`,
            } as { [key: string]: string };
          }}
          classForValue={(value: any) => {
            if (!value || value.count === 0) return 'color-empty';
            const level = Math.min(4, value.count);
            return `color-scale-${level}`;
          }}
          />
      </div>
    );
  };

  return (
    <div className="p-8 bg-gradient-to-br from-[#86c04d]/10 to-[#009889]/10 rounded-lg border border-[#86c04d]/20 mt-8">
      <h3 className="flex items-center space-x-4 mb-6">
          <CalendarDays className="w-8 h-8 text-[#86c04d]" />
          <span className="text-xl md:text-2xl font-semibold text-gray-800">Calendari de Validacions</span>
        </h3>
      {years.map(renderHeatmap)}
      <Tooltip id="cal-tip" delayShow={0} />

    </div>
  );
};

export default ContributionCalendar;
