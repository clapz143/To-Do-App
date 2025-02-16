import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FaCalendarAlt, FaTasks, FaSpinner, FaCheckCircle, FaBars, FaList } from 'react-icons/fa';
import logo from './assets/Lexmeet.png';
import './App.css';

function App() {
  const [tasks, setTasks] = useState([]);
  const [task, setTask] = useState({ name: '', priority: 'Medium', status: 'Not Started', startDate: '', endDate: '' });
  const [filter, setFilter] = useState('All');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const addTask = () => {
    if (!task.name.trim() || !task.startDate || !task.endDate) {
      alert('Please complete all fields before adding a task.');
      return;
    }
    setTasks(prevTasks => [...prevTasks, { ...task, id: Date.now() }]);
    setTask({ name: '', priority: 'Medium', status: 'Not Started', startDate: '', endDate: '' });
  };

  const removeTask = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const clearAllTasks = () => {
    if (tasks.length === 0) {
      alert('No tasks to delete.');
      return;
    }
    if (window.confirm('Are you sure you want to delete all tasks?')) {
      setTasks([]);
    }
  };

  const updateStatus = (id, newStatus) => {
    setTasks(tasks.map(task => task.id === id ? { ...task, status: newStatus } : task));
  };

  const calculateCount = (key, value) => {
    return tasks.filter(task => task[key] === value).length;
  };

  return (
    <div className="container-fluid d-flex m-0">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <button className="sidebar-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
          <FaBars />
        </button>
        <h2 className="sidebar-title">MENU</h2>
        <ul className="list-group">
          <li className={`list-group-item ${filter === 'All' ? 'active' : ''}`} onClick={() => setFilter('All')}>
            <FaList className="icon" /> <span className="sidebar-text">All Tasks</span>
          </li>
          <li className={`list-group-item ${filter === 'Not Started' ? 'active' : ''}`} onClick={() => setFilter('Not Started')}>
            <FaTasks className="icon" /> <span className="sidebar-text">Not Started</span>
          </li>
          <li className={`list-group-item ${filter === 'In Progress' ? 'active' : ''}`} onClick={() => setFilter('In Progress')}>
            <FaSpinner className="icon" /> <span className="sidebar-text">In Progress</span>
          </li>
          <li className={`list-group-item ${filter === 'Completed' ? 'active' : ''}`} onClick={() => setFilter('Completed')}>
            <FaCheckCircle className="icon" /> <span className="sidebar-text">Completed</span>
          </li>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="main-content p-4 w-100">
        <header className="header d-flex justify-content-between align-items-center mb-3">
          <img src={logo} alt="LexMeet Logo" className="logo" />
        </header>

        {/* Progress Bar */}
        <div className="progress-summary mt-3">
          <h3>Priority Progress</h3>
          <div className="progress-row">
            <span className="progress-label high">High</span>
            <div className="progress flex-grow-1">
              <div className="progress-bar bg-danger" style={{ width: `${calculateCount('priority', 'High') * 10}%` }}></div>
            </div>
          </div>

          <div className="progress-row">
            <span className="progress-label medium">Medium</span>
            <div className="progress flex-grow-1">
              <div className="progress-bar bg-warning" style={{ width: `${calculateCount('priority', 'Medium') * 10}%` }}></div>
            </div>
          </div>

          <div className="progress-row">
            <span className="progress-label low">Low</span>
            <div className="progress flex-grow-1">
              <div className="progress-bar bg-primary" style={{ width: `${calculateCount('priority', 'Low') * 10}%` }}></div>
            </div>
          </div>
        </div>

        {/* Task Input */}
        <div className="task-container bg-light p-4 rounded shadow-sm">
          <h1 className="title">Turn your to-do list into a ‘DONE’ list!</h1>
          <div className="row g-2 mb-3">
            <div className="col-md-3">
              <label className="form-label">Task</label>
              <input type="text" className="form-control" value={task.name} onChange={(e) => setTask({ ...task, name: e.target.value })} placeholder="Enter a task" />
            </div>
            <div className="col-md-2">
              <label className="form-label">Priority</label>
              <select className="form-select" onChange={(e) => setTask({ ...task, priority: e.target.value })} value={task.priority}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-md-2">
              <label className="form-label">Start Date</label>
              <div className="input-group">
                <span className="input-group-text" onClick={() => document.getElementById('startDate').showPicker()}><FaCalendarAlt /></span>
                <input id="startDate" type="date" className="form-control" value={task.startDate} onChange={(e) => setTask({ ...task, startDate: e.target.value })} />
              </div>
            </div>
            <div className="col-md-2">
              <label className="form-label">End Date</label>
              <div className="input-group">
                <span className="input-group-text" onClick={() => document.getElementById('endDate').showPicker()}><FaCalendarAlt /></span>
                <input id="endDate" type="date" className="form-control" value={task.endDate} onChange={(e) => setTask({ ...task, endDate: e.target.value })} />
              </div>
            </div>
          </div>

          {/* Task List */}
          <ul className="list-group">
            {tasks.filter(task => filter === 'All' || task.status === filter).map(t => (
              <li key={t.id} className="list-group-item d-flex justify-content-between align-items-center">
                <div>
                  <strong className={`priority-${t.priority.toLowerCase()}`}>{t.name}</strong> 
                  [<span className={`badge badge-${t.priority.toLowerCase()}`}>{t.priority}</span>]
                  <p className="text-muted small mb-1">
                    <strong>Start:</strong> {t.startDate} | <strong>End:</strong> {t.endDate}
                  </p>
                </div>
                <select className="form-select w-auto" onChange={(e) => updateStatus(t.id, e.target.value)} value={t.status}>
                  <option value="Not Started">Not Started</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Completed">Completed</option>
                </select>
                <button onClick={() => removeTask(t.id)} className="btn btn-danger btn-sm">Remove</button>
              </li>
            ))}
          </ul>

          <div className="d-flex justify-content-between mt-3">
            <button className="btn btn-danger" onClick={clearAllTasks}>Delete All</button>
            <button className="btn btn-success" onClick={addTask}>Add Task</button>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
