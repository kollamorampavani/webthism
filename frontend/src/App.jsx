import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2, Plus, ListTodo } from 'lucide-react';
import './App.css';

const API_URL = 'http://localhost:5000/todos';

function App() {
  const [todos, setTodos] = useState([]);
  const [newTask, setNewTask] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);

  // Fetch all todos on mount
  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error('Error fetching todos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTodo = async (e) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    setIsAdding(true);
    try {
      const response = await axios.post(API_URL, { title: newTask.trim() });
      setTodos([...todos, response.data]);
      setNewTask('');
    } catch (error) {
      console.error('Error adding todo:', error);
    } finally {
      setIsAdding(false);
    }
  };

  const handleDeleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setTodos(todos.filter(todo => todo.id !== id));
    } catch (error) {
      console.error('Error deleting todo:', error);
    }
  };

  return (
    <div className="app-container">
      <div className="header">
        <h1>Task Manager</h1>
        <p>Stay organized, focused, and productive.</p>
      </div>

      <form onSubmit={handleAddTodo} className="add-todo-form">
        <input
          type="text"
          value={newTask}
          onChange={(e) => setNewTask(e.target.value)}
          placeholder="What needs to be done?"
          className="todo-input"
          disabled={isAdding}
        />
        <button 
          type="submit" 
          className="add-btn" 
          disabled={isAdding || !newTask.trim()}
        >
          <Plus size={20} />
          {isAdding ? 'Adding...' : 'Add'}
        </button>
      </form>

      {loading ? (
        <div className="loading">Loading tasks...</div>
      ) : todos.length === 0 ? (
        <div className="empty-state">
          <ListTodo size={48} className="empty-state-icon" />
          <p>No tasks yet. Add one above!</p>
        </div>
      ) : (
        <ul className="todo-list">
          {todos.map(todo => (
            <li key={todo.id} className="todo-item">
              <div className="todo-content">
                <span className="todo-text">{todo.title}</span>
              </div>
              <button 
                onClick={() => handleDeleteTodo(todo.id)} 
                className="delete-btn"
                aria-label="Delete task"
              >
                <Trash2 size={18} />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
