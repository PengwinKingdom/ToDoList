import dayjs from "dayjs";
import "dayjs/locale/es";
import ProgressBar from "react-bootstrap/ProgressBar";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";


/**
 * CalendarViewMUI component
 * - Displays a DatePicker and a list of tasks
 * - Shows tasks for the selected date PLUS any unfinished tasks from other days
 * - Sorts tasks by manual priority (High > Medium > Low)
 */
export default function CalendarViewMUI({ selectedDate, onChangeDate, tasks, onDeleteTask,onMarkDone,onEditTask,onProgressChange}) {
  
  const value = selectedDate ? dayjs(selectedDate) : dayjs();
  const priorityWeight={high:3, medium:2, low:1};

  /**
   * Includes tasks created for the selected date 
   */
  const tasksForDay = selectedDate
    ? tasks
    .filter((t) => {
      const notFinished=t.status!=="done" && Number(t.progress ?? 0)<100;
      const sameDay=t.date===selectedDate;

      // Show tasks for the selected day OR any pending tasks from other days
      return sameDay || notFinished;
    })
    .slice() // copy array to avoid mutating the original state
    .sort((a,b)=>{
      // Sort by priority (High -> Medium -> Low)
      const wa=priorityWeight[a.priority ?? "medium"] ?? 2;
      const wb=priorityWeight[b.priority ?? "medium"] ?? 2;
      return wb-wa;
    })
    : [];


    // Returns DaisyUI badge classes based on priority
    const priorityBadgeClass=(p)=>{
      if(p==="high") return "badge badge-error";
      if (p==="medium") return "badge badge-warning";
      return "badge badge-success";
    };
    
    const actionBtn =
    "px-3 py-2 border-2 border-black rounded-lg bg-white text-sm text-black " +
    "transition-all duration-200 ease-out " +
    "hover:!bg-black hover:!text-white hover:!border-black " +
    "hover:scale-[1.03] hover:shadow-md active:scale-[0.99]";


  return (
    <div className="p-6">
      <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="es">
        
        <DatePicker
        label="Select date"
        value={value}
        onChange={(newValue) => { if (!newValue) return;
            onChangeDate(newValue.format("YYYY-MM-DD")); }}
            
            views={["year", "month", "day"]}
            openTo="day"
            
            slotProps={{
                textField: {
                fullWidth: true,},}} />
                
    </LocalizationProvider>


      {/* Task list section */}
      {selectedDate && (
        <div className="mt-6 text-black">
          <h3 className="font-semibold text-xl text-center mt-6">YOUR TASKS</h3>

          {/* Empty state */}
          {tasksForDay.length === 0 ? (
            <p className="mt-2 text-gray-500">No tasks for this day</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {tasksForDay.map((t) => (

                <li key={t.id} 
                className="border-2 border-gray-300 rounded-lg p-4 flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <div className="font-medium break-words">
                        {t.title}
                      </div>

                      {/* Priority badge */}
                      <span className={`${priorityBadgeClass(t.priority)} inline-flex items-center justify-center`}>
                        <span className="relative top-[2px]">
                          {(t.priority ?? "medium").toUpperCase()}
                        </span>
                      </span>

                  </div>

                  {t.description && (
                        <div className="text-sm text-gray-600">
                          {t.description}
                        </div>
                      )}

                  {/* Progress section */}
                  <div className="mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Progress </span>
                    </div>

                    <div className="w-full min-w-0">
                      <ProgressBar 
                    now={t.progress ?? 0}
                    striped
                    label={`${t.progress ?? 0}%`}
                    style={{ height: "20px", fontWeight: 600, width: "100%" }}
                    />
                    </div>
                    
                  </div>
                </div>


                  <div className="flex items-center gap-3 shrink-0">
                    
                    <button type="button" onClick={() => onMarkDone(t.id)}
                    className={actionBtn}>
                      Done
                    </button>
                    
                    <button type="button" onClick={() => onDeleteTask(t.id)}
                    className={actionBtn}>
                      Delete
                    </button>

                    <button type="button" onClick={() => onEditTask(t)}
                      className={actionBtn}>
                        Edit
                      </button>
                    
                    </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
