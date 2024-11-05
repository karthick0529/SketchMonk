import React, { useState, useEffect } from 'react';
import { Search, Share2, Settings, Plus, Apple } from 'lucide-react';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import KanbanColumn from './components/KanbanColumn';
import './styles/App.css';

const BASE_URL = 'http://localhost:5000';

function App() {
  const [columns, setColumns] = useState([]);
  const [editingColumnId, setEditingColumnId] = useState(null);
  const [newColumnTitle, setNewColumnTitle] = useState("");
  const [newTaskTitle, setNewTaskTitle] = useState(""); // State for new task title

  useEffect(() => {
    fetchColumns();
  }, []);

  const fetchColumns = async () => {
    const response = await fetch(`${BASE_URL}/api/columns`);
    const data = await response.json();
    setColumns(data);
  };

  const handleAddTask = async (columnId) => {
    // Prompt for a custom task title
    const taskTitle = prompt("Enter task title:");
    if (!taskTitle) return; // Exit if no title is provided

    const response = await fetch(`${BASE_URL}/api/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        columnId,
        title: taskTitle, // Use the provided title
        assignee: { name: 'Me', avatar: 'https://i.pravatar.cc/40?img=5' },
        date: 'Today',
        tag: 'New',
      }),
    });
    const newTask = await response.json();
    setColumns(columns.map(column => column.id === columnId ? { ...column, tasks: [...column.tasks, newTask] } : column));
  };

  const handleDeleteTask = async (taskId, columnId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/tasks/${taskId}/${columnId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error("Failed to delete task:", response.statusText);
        return;
      }

      setColumns(columns.map(column =>
        column.id === columnId
          ? { ...column, tasks: column.tasks.filter(task => task.id !== taskId) }
          : column
      ));
      console.log("Task deleted successfully:", taskId);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const handleAddSection = async () => {
    const response = await fetch(`${BASE_URL}/api/columns`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'New Column' }),
    });
    const newColumn = await response.json();
    setColumns([...columns, newColumn]);
    setEditingColumnId(newColumn.id);
    setNewColumnTitle(newColumn.title);
  };

  const handleDeleteColumn = async (columnId) => {
    try {
      const response = await fetch(`${BASE_URL}/api/columns/${columnId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        console.error("Failed to delete column:", response.statusText);
        return;
      }

      setColumns(columns.filter(column => column.id !== columnId));
      console.log("Column deleted successfully:", columnId);
    } catch (error) {
      console.error("Error deleting column:", error);
    }
  };

  const handleTitleChange = (e) => setNewColumnTitle(e.target.value);

  const handleSaveTitle = (columnId) => {
    setColumns(columns.map(column => column.id === columnId ? { ...column, title: newColumnTitle } : column));
    setEditingColumnId(null);
    setNewColumnTitle("");
  };

  const onDragEnd = (result) => {
    const { source, destination } = result;
    if (!destination) return;

    const sourceColumn = columns.find(col => col.id === source.droppableId);
    const destinationColumn = columns.find(col => col.id === destination.droppableId);
    const [movedTask] = sourceColumn.tasks.splice(source.index, 1);

    destinationColumn.tasks.splice(destination.index, 0, movedTask);

    setColumns(columns.map(col => {
      if (col.id === sourceColumn.id) return sourceColumn;
      if (col.id === destinationColumn.id) return destinationColumn;
      return col;
    }));
  };

  return (
    <div className="app">
      <header className="header">
        <div className="header-left">
          <Apple size={24} />
          <h1>Apple</h1>
          <span className="board-info">5 boards · 24 members</span>
        </div>
        <div className="header-right">
          <div className="search-container">
            <Search size={20} />
            <input type="text" placeholder="Search" />
          </div>
          <button className="icon-button"><Share2 size={20} /></button>
          <button className="icon-button"><Settings size={20} /></button>
        </div>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="board">
          {columns.map(column => (
            <Droppable key={column.id} droppableId={column.id}>
              {(provided) => (
                <div ref={provided.innerRef} {...provided.droppableProps}>
                  {editingColumnId === column.id ? (
                    <div>
                      <input
                        type="text"
                        value={newColumnTitle}
                        onChange={handleTitleChange}
                        onBlur={() => handleSaveTitle(column.id)}
                        autoFocus
                      />
                      <button onClick={() => handleSaveTitle(column.id)}>Save</button>
                    </div>
                  ) : (
                    <KanbanColumn
                    id={column.id}
                    title={column.title}
                    tasks={column.tasks}
                    onAddTask={handleAddTask}
                    onDeleteTask={handleDeleteTask}
                    // onUpdateTaskStatus={/* Pass the function for updating task status if applicable */}
                    onDeleteColumn={handleDeleteColumn} // Pass the delete column function
                    onEditColumn={() => {
                      setEditingColumnId(column.id);
                      setNewColumnTitle(column.title);
                    }}
                  />
                  )}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          ))}
          <div className="add-section" onClick={handleAddSection}>
          <Plus size={20} /> Add Section
        </div>
        </div>
      </DragDropContext>
    </div>
  );
}

export default App;
