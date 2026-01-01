import dayjs from "dayjs";
import "dayjs/locale/es";
import ProgressBar from "react-bootstrap/ProgressBar";

import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { TextField } from "@mui/material";


export default function CalendarViewMUI({ selectedDate, onChangeDate, tasks, onDeleteTask,onMarkDone,onEditTask,onProgressChange}) {
  
  const value = selectedDate ? dayjs(selectedDate) : dayjs();
  const priorityWeight={high:3, medium:2, low:1};

  const tasksForDay = selectedDate
    ? tasks
    .filter((t) => t.date === selectedDate && t.status !== "done")
    .slice()
    .sort((a,b)=>(priorityWeight[b.priority ?? "medium"] ?? 2 - (priorityWeight[a.priority ?? "medium"] ?? 2)))
    : [];

    const priorityBadgeClass=(p)=>{
      if(p==="high") return "badge badge-error";
      if (p==="medium") return "badge badge-warning";
      return "badge badge-success";
    };

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


      {selectedDate && (
        <div className="mt-6 text-black">
          <h3 className="font-semibold">
            YOUR TASKS
          </h3>

          {tasksForDay.length === 0 ? (
            <p className="mt-2 text-gray-500">No tasks for this day</p>
          ) : (
            <ul className="mt-3 space-y-3">
              {tasksForDay.map((t) => (

                <li key={t.id} 
                className="border-2 border-gray-300 rounded-lg p-4 flex items-center justify-between gap-4">
                  
                  <div className="min-w-0 text-black">
                    <div className="flex items-center gap-2">
                      <div className="font-medium">
                        {t.title}
                      </div>

                      <span className={priorityBadgeClass(t.priority ?? "medium")}>
                        {(t.priority ?? "medium").toUpperCase()}
                      </span>
                  </div>

                  {t.description && (
                        <div className="text-sm text-gray-600">
                          {t.description}
                        </div>
                      )}

                  <div className="mt-3">
                    <div className="flex items-center text-sm text-gray-600">
                      <span>Progress </span>
                    </div>

                    <div className="w-[350px]">
                      <ProgressBar 
                    now={t.progress ?? 0}
                    striped
                    label={`${t.progress ?? 0}%`}
                    style={{ height: "20px", fontWeight: 600 }}
                    />
                    </div>
                    
                  </div>
                </div>


                  <div className="flex items-center gap-3 shrink-0">
                    
                    <button type="button" onClick={() => onMarkDone(t.id)}
                    className="px-3 py-2 border-2 border-black rounded-lg bg-white hover:bg-gray-100 text-sm text-black">
                      Done
                    </button>
                    
                    <button type="button" onClick={() => onDeleteTask(t.id)}
                    className="px-3 py-2 border-2 border-black rounded-lg bg-white hover:bg-gray-100 text-sm text-black">
                      Delete
                    </button>

                    <button type="button" onClick={() => onEditTask(t)}
                      className="px-3 py-2 border-2 border-black rounded-lg bg-white hover:bg-gray-100 text-sm">
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
