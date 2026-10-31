
import { useEffect, useMemo, useState } from "react";
import {
  LayoutDashboard,
  ListTodo,
  CheckCircle2,
  Plus,
  Search,
  Bell,
  CalendarDays,
  Settings,
  LogOut,
  Menu,
  X,
  Pencil,
  Trash2,
  Circle,
  Check,
  Target,
  Sparkles,
  Clock3,
  ClipboardList,
  Activity,
  Command,
  Filter
} from "lucide-react";
import "./App.css";

const initialTasks = [
  {
    id: 1,
    title: "Complete React Dashboard",
    description: "Build a responsive SaaS dashboard.",
    category: "Development",
    priority: "High",
    status: "In Progress",
    due: "2026-11-02"
  },
  {
    id: 2,
    title: "Prepare Project Documentation",
    description: "Write professional README documentation.",
    category: "Work",
    priority: "Medium",
    status: "Todo",
    due: "2026-11-04"
  },
  {
    id: 3,
    title: "Update Portfolio",
    description: "Add recent projects to portfolio.",
    category: "Personal",
    priority: "Low",
    status: "Done",
    due: "2026-10-29"
  }
];

function getSavedData(key, fallback) {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : fallback;
  } catch {
    return fallback;
  }
}

function App() {
  const [user, setUser] = useState(() =>
    getSavedData("taskflow_user", null)
  );

  const [tasks, setTasks] = useState(() =>
    getSavedData("taskflow_tasks", initialTasks)
  );

  const [activePage, setActivePage] = useState("Overview");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    localStorage.setItem("taskflow_tasks", JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    if (user) {
      localStorage.setItem("taskflow_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("taskflow_user");
    }
  }, [user]);

  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(timer);
  }, [toast]);

  const completed = tasks.filter(
    task => task.status === "Done"
  ).length;

  const inProgress = tasks.filter(
    task => task.status === "In Progress"
  ).length;

  const overdue = tasks.filter(
    task => task.status !== "Done" &&
      task.due &&
      task.due < new Date().toISOString().slice(0, 10)
  ).length;

  const filteredTasks = useMemo(() => {
    return tasks.filter(task => {
      const matchesSearch =
        `${task.title} ${task.description} ${task.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesStatus =
        statusFilter === "All" ||
        task.status === statusFilter;

      const matchesPriority =
        priorityFilter === "All" ||
        task.priority === priorityFilter;

      const matchesPage =
        activePage === "My Tasks"
          ? task.status !== "Done"
          : activePage === "Completed"
            ? task.status === "Done"
            : true;

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPriority &&
        matchesPage
      );
    });
  }, [tasks, search, statusFilter, priorityFilter, activePage]);

  function login(name, email) {
    if (!name.trim() || !email.trim()) {
      setToast("Please enter your name and email");
      return;
    }

    setUser({
      name: name.trim(),
      email: email.trim()
    });

    setToast("Welcome to TaskFlow!");
  }

  function logout() {
    setUser(null);
    setToast("Successfully signed out");
  }

  function saveTask(taskData) {
    if (editingTask) {
      setTasks(previous =>
        previous.map(task =>
          task.id === editingTask.id
            ? { ...taskData, id: editingTask.id }
            : task
        )
      );

      setToast("Task updated successfully");
    } else {
      setTasks(previous => [
        { ...taskData, id: Date.now() },
        ...previous
      ]);

      setToast("New task created successfully");
    }

    setShowModal(false);
    setEditingTask(null);
  }

  function deleteTask(id) {
    if (!window.confirm("Are you sure you want to delete this task?")) {
      return;
    }

    setTasks(previous =>
      previous.filter(task => task.id !== id)
    );

    setToast("Task deleted successfully");
  }

  function toggleTask(task) {
    setTasks(previous =>
      previous.map(item =>
        item.id === task.id
          ? {
              ...item,
              status:
                item.status === "Done" ? "Todo" : "Done"
            }
          : item
      )
    );

    setToast(
      task.status === "Done"
        ? "Task reopened"
        : "Congratulations! Task completed"
    );
  }

  function openEdit(task) {
    setEditingTask(task);
    setShowModal(true);
  }

  if (!user) {
    return (
      <LoginPage onLogin={login} toast={toast} />
    );
  }

  return (
    <div className="app-container">

      {/* SIDEBAR */}

      <aside className={`sidebar ${mobileMenu ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <Command size={22} />
          </div>
          <h2>TaskFlow<span>.</span></h2>

          <button
            className="mobile-close"
            onClick={() => setMobileMenu(false)}
          >
            <X />
          </button>
        </div>

        <div className="workspace">
          <div className="workspace-avatar">T</div>
          <div>
            <strong>Team Workspace</strong>
            <small>Free Plan</small>
          </div>
        </div>

        <p className="sidebar-label">MENU</p>

        <nav className="sidebar-nav">

          <button
            className={activePage === "Overview" ? "active" : ""}
            onClick={() => setActivePage("Overview")}
          >
            <LayoutDashboard size={19} />
            Overview
          </button>

          <button
            className={activePage === "My Tasks" ? "active" : ""}
            onClick={() => setActivePage("My Tasks")}
          >
            <ListTodo size={19} />
            My Tasks
            <span className="nav-count">
              {tasks.filter(t => t.status !== "Done").length}
            </span>
          </button>

          <button
            className={activePage === "Completed" ? "active" : ""}
            onClick={() => setActivePage("Completed")}
          >
            <CheckCircle2 size={19} />
            Completed
          </button>

        </nav>

        <div className="sidebar-bottom">

          <div className="upgrade-card">
            <Sparkles size={22} />
            <h4>Stay productive!</h4>
            <p>Organize your work and achieve your goals.</p>
          </div>

          <button className="sidebar-setting">
            <Settings size={18} />
            Settings
          </button>

          <div className="user-profile">
            <div className="user-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>

            <div className="user-details">
              <strong>{user.name}</strong>
              <small>{user.email}</small>
            </div>

            <button onClick={logout} title="Logout">
              <LogOut size={18} />
            </button>
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}

      <main className="main-content">

        <header className="topbar">

          <button
            className="menu-toggle"
            onClick={() => setMobileMenu(true)}
          >
            <Menu />
          </button>

          <div className="breadcrumb">
            Workspace / <strong>{activePage}</strong>
          </div>

          <div className="topbar-right">
            <span className="today">
              <CalendarDays size={16} />
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric"
              })}
            </span>

            <button
              className="notification-btn"
              onClick={() => setToast("You are all caught up!")}
            >
              <Bell size={19} />
            </button>

            <div className="top-avatar">
              {user.name.charAt(0).toUpperCase()}
            </div>
          </div>

        </header>

        <div className="dashboard-content">

          {/* WELCOME */}

          <section className="welcome-section">

            <div>
              <span className="welcome-label">
                <Sparkles size={15} />
                YOUR PERSONAL WORKSPACE
              </span>

              <h1>
                Good morning, {user.name.split(" ")[0]}!
              </h1>

              <p>
                A clear mind starts with a clear plan.
                Let's make today count.
              </p>
            </div>

            <button
              className="primary-btn"
              onClick={() => {
                setEditingTask(null);
                setShowModal(true);
              }}
            >
              <Plus size={19} />
              Add New Task
            </button>

          </section>

          {/* STATISTICS */}

          <section className="stats-grid">

            <StatCard
              icon={<ClipboardList />}
              title="Total Tasks"
              value={tasks.length}
              color="purple"
            />

            <StatCard
              icon={<Activity />}
              title="In Progress"
              value={inProgress}
              color="blue"
            />

            <StatCard
              icon={<CheckCircle2 />}
              title="Completed"
              value={completed}
              color="green"
            />

            <StatCard
              icon={<Clock3 />}
              title="Overdue"
              value={overdue}
              color="orange"
            />

          </section>

          {/* TASK SECTION */}

          <section className="tasks-section">

            <div className="section-heading">
              <div>
                <h2>{activePage === "Overview" ? "Your Tasks" : activePage}</h2>
                <p>Manage your daily activities and priorities.</p>
              </div>

              <button
                className="view-all"
                onClick={() => setActivePage("My Tasks")}
              >
                View Active Tasks →
              </button>
            </div>

            {/* SEARCH AND FILTER */}

            <div className="toolbar">

              <div className="search-box">
                <Search size={18} />

                <input
                  type="text"
                  placeholder="Search tasks..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>

              <div className="filter-controls">
                <Filter size={17} />

                <select
                  value={statusFilter}
                  onChange={e => setStatusFilter(e.target.value)}
                >
                  <option value="All">All Status</option>
                  <option value="Todo">To Do</option>
                  <option value="In Progress">In Progress</option>
                  <option value="Done">Completed</option>
                </select>

                <select
                  value={priorityFilter}
                  onChange={e => setPriorityFilter(e.target.value)}
                >
                  <option value="All">All Priority</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

            </div>

            {/* TASK LIST */}

            <div className="task-list">

              {filteredTasks.length > 0 ? (
                filteredTasks.map(task => (

                  <article className="task-item" key={task.id}>

                    <button
                      className={`task-check ${task.status === "Done" ? "checked" : ""}`}
                      onClick={() => toggleTask(task)}
                      title="Change task status"
                    >
                      {task.status === "Done"
                        ? <Check size={16} />
                        : <Circle size={19} />
                      }
                    </button>

                    <div className="task-info">

                      <h3 className={task.status === "Done" ? "completed-title" : ""}>
                        {task.title}
                      </h3>

                      <p>{task.description}</p>

                      <div className="task-meta">
                        <span className="category">
                          {task.category}
                        </span>

                        <span className={`priority ${task.priority.toLowerCase()}`}>
                          ● {task.priority}
                        </span>

                        <span className="due-date">
                          <CalendarDays size={13} />
                          {task.due || "No due date"}
                        </span>
                      </div>

                    </div>

                    <span className={`status ${task.status.toLowerCase().replace(" ", "-")}`}>
                      {task.status}
                    </span>

                    <div className="task-actions">

                      <button
                        onClick={() => openEdit(task)}
                        title="Edit task"
                      >
                        <Pencil size={16} />
                      </button>

                      <button
                        onClick={() => deleteTask(task.id)}
                        title="Delete task"
                      >
                        <Trash2 size={16} />
                      </button>

                    </div>

                  </article>

                ))
              ) : (

                <div className="empty-state">
                  <Target size={35} />
                  <h3>No Tasks Found</h3>
                  <p>Create a task or change your search filters.</p>

                  <button
                    className="primary-btn"
                    onClick={() => {
                      setEditingTask(null);
                      setShowModal(true);
                    }}
                  >
                    <Plus size={18} />
                    Create Task
                  </button>
                </div>

              )}

            </div>

          </section>

          <footer className="dashboard-footer">
            <span>© 2026 TaskFlow. All rights reserved.</span>
            <span>● All changes saved locally</span>
          </footer>

        </div>

      </main>

      {/* TASK MODAL */}

      {showModal && (
        <TaskModal
          task={editingTask}
          onClose={() => {
            setShowModal(false);
            setEditingTask(null);
          }}
          onSave={saveTask}
        />
      )}

      {/* TOAST */}

      {toast && (
        <div className="toast-message">
          <CheckCircle2 size={18} />
          {toast}
        </div>
      )}

    </div>
  );
}

function StatCard({ icon, title, value, color }) {
  return (
    <article className="stat-card">
      <div className={`stat-icon ${color}`}>
        {icon}
      </div>
      <p>{title}</p>
      <h2>{value}</h2>
      <small>Updated automatically</small>
    </article>
  );
}

function LoginPage({ onLogin, toast }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mode, setMode] = useState("login");

  function handleSubmit(e) {
    e.preventDefault();

    if (!name.trim()) {
      alert("Please enter your name");
      return;
    }

    if (!/^\S+@\S+\.\S+$/.test(email)) {
      alert("Please enter a valid email");
      return;
    }

    onLogin(name, email);
  }

  return (
    <div className="login-page">

      <div className="login-card">

        <div className="login-brand">
          <div className="brand-icon">
            <Command size={22} />
          </div>
          <h2>TaskFlow<span>.</span></h2>
        </div>

        <div className="login-icon">
          <Sparkles size={25} />
        </div>

        <h1>
          {mode === "login" ? "Welcome Back!" : "Create Account"}
        </h1>

        <p>Plan your work. Protect your focus. Make progress.</p>

        <div className="login-tabs">
          <button
            className={mode === "login" ? "selected" : ""}
            onClick={() => setMode("login")}
            type="button"
          >
            Sign In
          </button>

          <button
            className={mode === "signup" ? "selected" : ""}
            onClick={() => setMode("signup")}
            type="button"
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit}>

          <label>Your Name</label>
          <input
            type="text"
            placeholder="Enter your name"
            value={name}
            onChange={e => setName(e.target.value)}
          />

          <label>Email Address</label>
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={e => setEmail(e.target.value)}
          />

          <button className="primary-btn login-submit" type="submit">
            Continue to Dashboard →
          </button>

        </form>

        <div className="login-note">
          Demo authentication — no password required.
        </div>

      </div>

      {toast && <div className="toast-message">{toast}</div>}

    </div>
  );
}

function TaskModal({ task, onClose, onSave }) {
  const [title, setTitle] = useState(task?.title || "");
  const [description, setDescription] = useState(task?.description || "");
  const [category, setCategory] = useState(task?.category || "Work");
  const [priority, setPriority] = useState(task?.priority || "Medium");
  const [status, setStatus] = useState(task?.status || "Todo");
  const [due, setDue] = useState(task?.due || "");

  function handleSubmit(e) {
    e.preventDefault();

    if (!title.trim()) {
      alert("Please enter a task title");
      return;
    }

    onSave({
      title: title.trim(),
      description: description.trim(),
      category,
      priority,
      status,
      due
    });
  }

  return (
    <div
      className="modal-overlay"
      onMouseDown={e => {
        if (e.target === e.currentTarget) onClose();
      }}
    >

      <form className="task-modal" onSubmit={handleSubmit}>

        <div className="modal-header">
          <div>
            <span>TASK DETAILS</span>
            <h2>{task ? "Edit Task" : "Create New Task"}</h2>
          </div>

          <button type="button" onClick={onClose}>
            <X />
          </button>
        </div>

        <label>Task Title</label>
        <input
          value={title}
          onChange={e => setTitle(e.target.value)}
          placeholder="Enter task title"
          autoFocus
        />

        <label>Description</label>
        <textarea
          rows="3"
          value={description}
          onChange={e => setDescription(e.target.value)}
          placeholder="Describe your task..."
        />

        <div className="form-grid">

          <div>
            <label>Category</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
            >
              <option>Work</option>
              <option>Personal</option>
              <option>Development</option>
              <option>Learning</option>
              <option>Product</option>
            </select>
          </div>

          <div>
            <label>Priority</label>
            <select
              value={priority}
              onChange={e => setPriority(e.target.value)}
            >
              <option>Low</option>
              <option>Medium</option>
              <option>High</option>
            </select>
          </div>

          <div>
            <label>Status</label>
            <select
              value={status}
              onChange={e => setStatus(e.target.value)}
            >
              <option>Todo</option>
              <option>In Progress</option>
              <option>Done</option>
            </select>
          </div>

          <div>
            <label>Due Date</label>
            <input
              type="date"
              value={due}
              onChange={e => setDue(e.target.value)}
            />
          </div>

        </div>

        <div className="modal-buttons">
          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>

          <button type="submit" className="primary-btn">
            {task ? "Save Changes" : "Create Task"}
          </button>
        </div>

      </form>

    </div>
  );
}

export default App;
