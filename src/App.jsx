import { useEffect, useState } from "react";
import './App.css'

import Tabs from "./components/Tabs";
import TodoForm from "./components/TodoForm";
import TodoList from "./components/TodoList";
import CalendarView from "./components/CalendarView";
import PrettoProgressSlider from "./components/PrettoProgressSlider";

function App() {
  const [activeTab, setActiveTab] = useState("todo");
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState(""); 
  const [description, setDescription] = useState("");
  const [toast, setToast] = useState(null);
  const [hasLoaded, setHasLoaded] = useState(false);

  const todayISO = () => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`; };

  const [selectedDate, setSelectedDate] = useState(todayISO());
  
  const [editingTask,setEditingTask]= useState (null);
  const openEdit=(task)=>{
    setEditingTask({
      ...task,
      progress:task.progress ?? 0,
      priority:task.priority ?? "medium",
    });
  };

  const closeEdit=()=>setEditingTask(null);

    const normalizeTask=(t)=>({
    ...t,
    priority:t.priority ?? "medium",
  });

  const [priority, setPriority] = useState("medium");

  //load tasks
  useEffect(()=>{
    try{
      const storedTasks = localStorage.getItem("tasks");
      if(storedTasks){
        const parsed=JSON.parse(storedTasks);
        const normalized=Array.isArray(parsed) ? parsed.map(normalizeTask) : [];
        setTasks (normalized);
      }
    } catch (error){
      console.error("Error loading tasks from localStorage:", error);
    } finally{
      setHasLoaded (true);
    }
  },[]);

  //save tasks
  useEffect(()=>{
    if (!hasLoaded) return;
    localStorage.setItem("tasks",JSON.stringify(tasks));
  },[tasks, hasLoaded]);


  const addTask = () => {
    const cleanTitle = title.trim();
    if(!cleanTitle){
      setToast({ type: "error", text: "Title cannot be empty" });
      setTimeout(() => setToast(null), 2500);
      return;
    }

    const dateISO =todayISO();
    const newTask = {
      id:crypto.randomUUID(),
      title:cleanTitle,
      description:description.trim(),
      date:dateISO,
      progress: 0,
      status:"todo",
      priority:priority ?? "medium",
      createdAt:Date.now(),
    };

    setTasks((prev)=>[newTask,...prev]);
    setTitle("");
    setDescription("");
    setPriority("medium");
    
    setToast({ type: "success", text: "Task Added Successfully" });
    setTimeout(() => setToast(null), 2500);

  };

  const deleteTask = (taskId) => {
    setTasks((prev)=> prev.filter((t)=> t.id !== taskId));

    setToast({ type: "success", text: "Task Deleted Successfully" });
    setTimeout(() => setToast(null), 2500);
  };

  const markTaskDone=(taskId) => {
    setTasks((prev)=>
    prev.map((t)=> (t.id === taskId ? {...t, status:"done"} : t))
  );

  setToast({ type: "success", text: "Task Done" });
  setTimeout(() => setToast(null), 2500);
  };

  const updateTask=(updated)=>{
    const cleanTitle= updated.title.trim();
    if(!cleanTitle){
      setToast({type:"error", text:"Title cannot be empty"});
      return;
    }

    setTasks((prev)=>
    prev.map((t)=>
    t.id===updated.id?{...t,
      title:cleanTitle,
      description:(updated.description ?? "").trim(),
      date:updated.date,
      progress:Number(updated.progress ?? 0),
      priority:updated.priority ?? t.priority ?? "medium",
    }
  :t));
  
  setToast({type:"success", text:"Task Updated Successfully"});
  setTimeout(() => setToast(null), 2500);
  closeEdit();

  };

  const updateTaskProgress = (taskId, newProgress) => {
  setTasks((prev) =>
    prev.map((t) =>
      t.id === taskId ? { ...t, progress: Number(newProgress) } : t
    )
  );};



  return (
  <div className="min-h-screen flex flex-col items-center pt-16">

    {toast && (
      <div className="fixed top-4 right-4 z-[99999]">
        <div className={`alert ${toast.type === "success" ? "alert-success" : "alert-error"} shadow-lg`}>
          <span>{toast.text}</span>
        </div>
      </div>
    )}


    <h1 className="text-5xl font-bold mb-10 text-white">
      {activeTab === "todo" ? "To Do List" : "Calendar"}
    </h1>

    <div className="bg-pink-200 border border-black w-[1100px] max-w-[95vw] shadow-xl mx-auto rounded-xl overflow-hidden">
      

      <Tabs activeTab={activeTab} onChangeTab={setActiveTab} />


      <div className="bg-white min-h-[520px] p-10 border-t border-black">
        {activeTab === "todo" ? (
    <>
      <div className="mt-4">
        <p className="text-xl font-medium text-black">Title</p>

        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title of your task"
          className="mt-3 w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-black text-lg outline-none placeholder:text-white/60 focus:border-black"
        />
      </div>

      <div className="mt-6">
        <p className="text-xl font-medium text-black">Description</p>

        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description of your task"
          className="mt-3 w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-black text-lg outline-none placeholder:text-white/60 focus:border-black"
          rows={4}
        />
      </div>

      <div className="mt-6">
        <p className="text-xl font-medium text-black">Priority</p>
        <select
        className="mt-3 w-full border-2 border-gray-400 rounded-lg px-4 py-3 text-black text-lg outline-none focus:border-black"
        value={priority}
        onChange={(e)=>setPriority(e.target.value)}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>

        <div className="mt-6 flex justify-end">
        <button
          type="button"
          onClick={addTask}
          className="px-6 py-3 bg-pink-200 border-2 border-black text-black font-medium rounded-lg hover:bg-pink-300">
          Add
        </button>
        </div>
      </div>
    </>
        ) : (
          <CalendarView 
          selectedDate={selectedDate}
           onChangeDate={setSelectedDate} 
           tasks={tasks}
           onMarkDone={markTaskDone}
           onDeleteTask={deleteTask}
           onEditTask={openEdit}
           />
        )}
      </div>
    </div>


    {editingTask && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
        <div className="w-full max-w-xl rounded-xl bg-white border-2 border-black p-6">
          <div className="flex items-center justify-between">

            <h2 className="text-2xl font-bold">Edit Task</h2>

            <button className="px-3 py-2 border-2 border-black rounded-lg hover:bg-gray-100"
            onClick={closeEdit}>
              X
            </button>
          </div>

          <div className="mt-5 space-y-4">
            <div>
              <p className="font-medium text-black">Title</p>
              <input
              className="mt-2 w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black outline-none focus:border-black"
              value={editingTask.title}
              onChange={(e) => setEditingTask((prev) => ({ ...prev, title: e.target.value }))}
              />
            </div>

            <div>
              <p className="font-medium text-black">Description</p>
              <textarea
              className="mt-2 w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black outline-none focus:border-black"
              rows={4}
              value={editingTask.description ?? ""}
              onChange={(e)=> setEditingTask((prev)=>({...prev,description:e.target.value}))}
              />
            </div>

            <div>
              <p className="font-medium text-black">Progress</p>

              <div className="mt-2 flex items-center gap-4">
                <div className="flex-1">
                  <PrettoProgressSlider
                  value={editingTask.progress ?? 0}
                  onChange={(val)=>
                    setEditingTask((prev)=>({...prev,progress:val}))
                  }
                  />
                </div>

                <span className="w-12 text-right text-sm text-gray-700">
                  {editingTask.progress ?? 0}%
                </span>
              </div>
            </div>

            <div>
              <p className="font-medium text-black">Priority</p>
              <select
              className="mt-2 w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black outline-none focus:border-black"
              value={editingTask.priority ?? "medium"}
              onChange={(e)=>
                setEditingTask((prev)=>({...prev,priority:e.target.value}))
              }>
                <option value="high">High</option>
                <option value="medium">Medium</option>
                <option value="low">Low</option>
              </select>
            </div>

            <div>
              <p className="font-medium text-black">Date</p>
              <input
              type="date"
              className="mt-2 w-full border-2 border-gray-300 rounded-lg px-4 py-3 text-black outline-none focus:border-black"
              value={editingTask.date}
              onChange={(e)=> setEditingTask((prev)=>({...prev,date:e.target.value}))}
              />
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button className="px-5 py-3 border-2 border-black rounded-lg hover:bg-gray-100"
              onClick={closeEdit}>
                Cancel
              </button>

              <button className="px-5 py-3 bg-pink-200 border-2 border-black rounded-lg hover:bg-pink-300"
              onClick={()=>updateTask(editingTask)}>
                Save Changes
              </button>

            </div>

          </div>

        </div>

      </div>
    )}
  </div>
  );

}

export default App;
