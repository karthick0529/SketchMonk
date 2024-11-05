import React, { useState, useEffect, useRef } from 'react';
import { MoreHorizontal } from 'lucide-react';
import PropTypes from 'prop-types';
import '../styles/TaskCard.css';

function TaskCard({ task, isEditing = false, onEditComplete, onDelete, onUpdate }) {
  const [title, setTitle] = useState(task.title);
  const [isEditMode, setIsEditMode] = useState(isEditing);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (isEditMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isEditMode]);

  useEffect(() => {
    setIsEditMode(isEditing);
  }, [isEditing]);

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      setIsEditMode(false);
      if (onEditComplete) {
        onEditComplete();
      }
    }
  };

  const handleMenuClick = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleStatusChange = (status) => {
    setIsMenuOpen(false);
    if (onUpdate) {
      onUpdate(task.id, status); // Pass the task ID and the new status
    }
  };

  const handleDelete = () => {
    setIsMenuOpen(false);
    if (onDelete) {
      onDelete(task.id); // Pass the task ID for deletion
    }
  };

  return (
    <div className="task-card">
      <div className="task-header">
        {isEditMode ? (
          <input
            ref={inputRef}
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onKeyDown={handleKeyDown}
            onBlur={() => {
              setIsEditMode(false);
              if (onEditComplete) {
                onEditComplete();
              }
            }}
            className="task-input"
          />
        ) : (
          <h3>{title}</h3>
        )}
        <button className="icon-button" onClick={handleMenuClick}>
          <MoreHorizontal size={16} />
        </button>
      </div>
      {isMenuOpen && (
        <div className="menu">
          <button onClick={handleDelete}>Delete</button>
        </div>
      )}
      <div className="task-footer">
        <div className="assignee">
          <img 
            src={task.assignee?.avatar || 'default-avatar-url.png'} 
            alt={task.assignee?.name || 'Unknown'} 
          />
        </div>
        <div className="task-meta">
          <span className="date">{task.date}</span>
          <span className="tag">{task.tag}</span>
        </div>
      </div>
    </div>
  );
}

TaskCard.propTypes = {
  task: PropTypes.shape({
    title: PropTypes.string.isRequired,
    assignee: PropTypes.shape({
      avatar: PropTypes.string,
      name: PropTypes.string,
    }),
    date: PropTypes.string.isRequired,
    tag: PropTypes.string,
    id: PropTypes.string.isRequired, // Assuming id is a string, adjust if necessary
  }).isRequired,
  isEditing: PropTypes.bool,
  onEditComplete: PropTypes.func,
  onDelete: PropTypes.func.isRequired,
  onUpdate: PropTypes.func,
};

export default TaskCard;
