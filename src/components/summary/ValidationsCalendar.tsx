import React from 'react';

import { Tooltip } from 'react-tooltip';
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore: Type definitions outdated, squareSize not included
import CalendarHeatmapOriginal from 'react-calendar-heatmap';

const Heatmap: any = CalendarHeatmapOriginal;
import { CalendarDays } from 'lucide-react';
import 'react-calendar-heatmap/dist/styles.css';

// Data point type
export interface CalendarDay {
  date: string; // ISO yyyy-MM-dd
  count: number;
}

interface ValidationsCalendarProps {
  data: CalendarDay[];
}

const ValidationsCalendar: React.FC<ValidationsCalendarProps> = ({ data }) => {
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

  // Fixed tile and SVG width for all years
  const SQUARE = 12;
  const GUTTER = 2;
  const TOTAL_WEEKS = 53; // always 53 weeks for visual consistency
  const FIXED_WIDTH = TOTAL_WEEKS * (SQUARE + GUTTER);


  const renderHeatmap = (year: number) => {
    const yearStart = new Date(year, 0, 1);
    const yearEnd = new Date(year, 11, 31);
    
    const dataMap = new Map(data.map(d => [d.date, d.count]));

    const fullYearData: CalendarDay[] = [];
    for (let d = new Date(yearStart); d <= yearEnd; d.setDate(d.getDate() + 1)) {
      const isoDate = d.toISOString().slice(0, 10);
      fullYearData.push({
        date: isoDate,
        count: dataMap.get(isoDate) || 0,
      });
    }

    return (
      <div key={year} className="mb-8" style={{ width: FIXED_WIDTH }}>
        {years.length > 1 && (
          <h4 className="text-lg font-semibold text-gray-700 mb-2">{year}</h4>
        )}
        <Heatmap
          squareSize={SQUARE}
          gutterSize={GUTTER}
          svgProps={{ width: FIXED_WIDTH, height: 90 }}
          showWeekdayLabels
          weekdayLabels={["Dg", "Dl", "Dt", "Dc", "Dj", "Dv", "Ds"]}
          monthLabels={["Gen", "Feb", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Oct", "Nov", "Des"]}
          startDate={yearStart}
          endDate={yearEnd}
          values={fullYearData as any}
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

export default ValidationsCalendar;