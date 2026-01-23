import { useEffect, useState } from "react";

function TaskApp() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [filter, setFilter] = useState("all"); // ✅ FILTER STATE
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // FETCH TASKS
  const fetchTasks = async () => {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:5000/tasks/list-tasks");
      const data = await res.json();
      setTasks(data);
    } catch (err) {
      setError("Failed to load tasks");
    }

    setLoading(false);
  };

  // ADD TASK
  const addTask = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/tasks/create-tasks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, description, status }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      setStatus("pending");
      fetchTasks();
    } else {
      alert("Task not added");
    }
  };

  const updateTask = async (task) => {
    await fetch(`http://localhost:5000/tasks/update-task/${task._id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(task),
    });

    fetchTasks();
  };

  const deleteTask = async (id) => {
    await fetch(`http://localhost:5000/tasks/delete-task/${id}`, {
      method: "DELETE",
    });

    fetchTasks();
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  // ✅ FILTER LOGIC
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.status === filter);

  return (
    <div className="text-center pt-6 max-w-2xl mx-auto p-6 bg-white shadow-md rounded-lg mt-8">
      <h2 className="text-2xl font-bold mb-4 text-indigo-600">Create Task</h2>

      {/* CREATE TASK */}
      <form onSubmit={addTask} className="space-y-4">
        <input
          className="w-full p-3 border rounded-md"
          placeholder="Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <input
          className="w-full p-3 border rounded-md"
          placeholder="Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <select
          className="w-full p-3 border rounded-md"
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="pending">Pending</option>
          <option value="success">Completed</option>
          <option value="failed">Failed</option>
        </select>

        <button className="w-full bg-indigo-600 text-white p-3 rounded-md">
          Add Task
        </button>
      </form>

      <hr className="my-6" />

      {/* ✅ FILTER DROPDOWN */}
      <select
        className="border p-2 rounded-md mb-4"
        value={filter}
        onChange={(e) => setFilter(e.target.value)}
      >
        <option value="all">All Tasks</option>
        <option value="pending">Pending</option>
        <option value="success">Completed</option>
        <option value="failed">Failed</option>
      </select>

      {/* TASK LIST */}
      <ul className="space-y-3">
        {filteredTasks.map((task) => (
          <li
            key={task._id}
            className="border rounded-lg p-4 grid grid-cols-12 gap-3 items-center bg-gray-50"
          >
            <input
              value={task.title}
              onChange={(e) =>
                setTasks(tasks.map(t =>
                  t._id === task._id ? { ...t, title: e.target.value } : t
                ))
              }
              className="col-span-3 border px-2 py-1 rounded-md"
            />

            <input
              value={task.description}
              onChange={(e) =>
                setTasks(tasks.map(t =>
                  t._id === task._id ? { ...t, description: e.target.value } : t
                ))
              }
              className="col-span-4 border px-2 py-1 rounded-md"
            />

            <select
              value={task.status}
              onChange={(e) =>
                setTasks(tasks.map(t =>
                  t._id === task._id ? { ...t, status: e.target.value } : t
                ))
              }
              className="col-span-3 border p-1 rounded-md"
            >
              <option value="pending">Pending</option>
              <option value="success">Completed</option>
              <option value="failed">Failed</option>
            </select>

            <div className="col-span-2 flex gap-2">
              <button
                onClick={() => updateTask(task)}
                className="bg-green-500 text-white px-3 py-1 rounded-md"
              >
                Update
              </button>

              <button
                onClick={() => deleteTask(task._id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default TaskApp;
