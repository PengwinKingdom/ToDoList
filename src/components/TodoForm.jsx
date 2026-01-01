import { useState } from "react";

export default function TodoForm({onAddTask}) {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [priority, setPriority] = useState("medium");
    
    const handleAdd=()=>{
        onAddTask(title,description,priority);
        setTitle("");
        setDescription("");
        setPriority("medium");
    };

    return (
    <div className="form">
      <label className="label">Title</label>
      <input
        className="input"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Ej: Terminar UI"
      />

      <label className="label">Description</label>
      <textarea
        className="textarea"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Detalles..."
      />


      <label className="form-control w-full">
        <span className="label-text">Priority</span>
        <select
        className="select select-bordered"
        value={priority}
        onChange={(e) => setPriority(e.target.value)}>

          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
      </label>


      <div className="actions">
        <button className="btn" onClick={handleAdd}>
          Add
        </button>
      </div>
    </div>
  );
}