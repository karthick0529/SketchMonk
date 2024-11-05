import React, { useState } from "react";
import { Plus, MoreHorizontal, Trash2 } from "lucide-react"; // Import Trash2 icon
import TaskCard from "./TaskCard";
import "../styles/KanbanColumn.css";

function KanbanColumn({
  id,
  title,
  tasks,
  onAddTask,
  onDeleteTask,
  onUpdateTaskStatus,
  onDeleteColumn,
}) {
  const [editingTaskId, setEditingTaskId] = useState(null);

  const handleAddClick = () => {
    const newTaskId = onAddTask(id);
    setEditingTaskId(newTaskId);
  };

  const handleDeleteClick = () => {
    if (window.confirm("Are you sure you want to delete this column?")) {
      onDeleteColumn(id);
    }
  };

  return (
    <div className="column">
      <div className="column-header">
        <h2>{title}</h2>
        <div className="column-actions">
          <button className="icon-button" onClick={handleAddClick}>
            <Plus size={20} />
          </button>
          <button className="icon-button" onClick={handleDeleteClick}>
            <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="task-list">
        {tasks.map((task) => {
          // Check if task has a title
          if (!task.title) {
            console.warn(`Task with ID ${task.id} has no title.`);
            return null; // Skip rendering this task
          }
          return (
            <TaskCard
              key={task.id} // Ensure task.id is unique
              task={task}
              onDelete={() => onDeleteTask(task.id, id)}
              onUpdate={onUpdateTaskStatus}
            />
          );
        })}
      </div>
      <button className="add-task-button" onClick={handleAddClick}>
        <Plus size={16} />
        Add task
      </button>
    </div>
  );
}

export default KanbanColumn;
