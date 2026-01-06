import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CycleCalendarProps {
    startDate: string;
    onSelectEndDate: (date: string) => void;
    selectedEndDate: string;
}

export const CycleCalendar: React.FC<CycleCalendarProps> = ({ startDate, onSelectEndDate, selectedEndDate }) => {
    const [viewDate, setViewDate] = useState(new Date());
    
    useEffect(() => {
        if (startDate) {
            setViewDate(new Date(startDate));
        }
    }, [startDate]);

    const start = new Date(startDate);
    const validStart = !isNaN(start.getTime());

    const getDaysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
    const getFirstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

    const currentYear = viewDate.getFullYear();
    const currentMonth = viewDate.getMonth();
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);

    const prevMonth = () => setViewDate(new Date(currentYear, currentMonth - 1, 1));
    const nextMonth = () => setViewDate(new Date(currentYear, currentMonth + 1, 1));

    const isCycleDate = (date: Date) => {
        if (!validStart) return false;
        const diffTime = date.getTime() - start.getTime();
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays > 0 && diffDays % 56 === 0;
    };

    const isStartDate = (date: Date) => {
        return validStart && date.getTime() === start.getTime();
    };

    const isSelected = (date: Date) => {
        if (!selectedEndDate) return false;
        return date.getTime() === new Date(selectedEndDate).getTime();
    };

    const formatDate = (date: Date) => {
        return date.toISOString().split('T')[0];
    };

    const renderDays = () => {
        const days = [];
        // Empty slots for previous month
        for (let i = 0; i < firstDay; i++) {
            days.push(<div key={`empty-${i}`} className="h-10"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            const date = new Date(currentYear, currentMonth, d);
            // Reset hours for accurate comparison
            date.setHours(0,0,0,0);
            if(validStart) start.setHours(0,0,0,0);

            const isCycle = isCycleDate(date);
            const isStart = isStartDate(date);
            const isSel = isSelected(date);
            
            // Allow selection if it IS a cycle date or just any date? 
            // Requirement: "mark calender for 8 week cycles... then admin can easily choose end date"
            // Suggestion: Allow any date, but Highlight cycle dates strongly.
            
            days.push(
                <button
                    key={d}
                    onClick={() => onSelectEndDate(formatDate(date))}
                    className={`h-10 w-full rounded flex items-center justify-center text-sm relative transition-all
                        ${isStart ? 'bg-blue-600 text-white font-bold' : ''}
                        ${isSel ? 'ring-2 ring-white z-10' : ''}
                        ${isCycle ? 'bg-amber-500/20 text-amber-500 font-bold border border-amber-500/50 hover:bg-amber-500 hover:text-white' : 'hover:bg-slate-700 text-slate-300'}
                    `}
                    title={isCycle ? "End of 8-Week Cycle" : ""}
                >
                    {d}
                    {isCycle && <div className="absolute -top-1 -right-1 w-2 h-2 bg-amber-500 rounded-full"></div>}
                </button>
            );
        }
        return days;
    };

    return (
        <div className="bg-slate-800 border border-slate-700 rounded-lg p-4 max-w-sm">
             <div className="flex items-center justify-between mb-4">
                <button onClick={prevMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                    <ChevronLeft size={20} />
                </button>
                <h4 className="font-semibold text-white">
                    {viewDate.toLocaleString('default', { month: 'long', year: 'numeric' })}
                </h4>
                <button onClick={nextMonth} className="p-1 hover:bg-slate-700 rounded text-slate-400 hover:text-white">
                    <ChevronRight size={20} />
                </button>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-2">
                {['Su', 'Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa'].map(day => (
                    <div key={day} className="text-center text-xs text-slate-500 font-medium py-1">
                        {day}
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-7 gap-1">
                {renderDays()}
            </div>

            {validStart && (
                <div className="mt-4 pt-4 border-t border-slate-700">
                    <div className="flex items-center gap-2 text-xs text-amber-500 mb-1">
                        <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                        <span>8-Week Cycle markers (56 days)</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-blue-400">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                        <span>Start Date</span>
                    </div>
                </div>
            )}
        </div>
    );
};
