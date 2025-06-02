import { useEffect, useState } from "react";
import Link from "next/link";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function TaskListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  function toggleTask(id: string, newStatus: boolean) {
    fetch(`http://localhost:4000/api/tasks/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ completed: newStatus }),
    })
      .then((res) => res.json())
      .then((updatedTask) => {
        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      });
  }

  useEffect(() => {
    fetch("http://localhost:4000/api/tasks") // Adjust to your backend port/service
      .then((res) => res.json())
      .then(setTasks);
  }, []);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">Tasks</h1>
      <Link
        href="/tasks/create"
        className="inline-block mt-4 bg-blue-500 text-white px-4 py-2 rounded"
      >
        + Create Task
      </Link>

      <ul className="mt-6 space-y-3">
        {tasks.map((task) => (
          <li
            key={task.id}
            className="border p-4 rounded shadow flex items-center justify-between"
          >
            <div>
              <Link href={`/tasks/${task.id}`}>
                <div className="font-semibold text-lg text-blue-600 hover:underline cursor-pointer">
                  {task.title}
                </div>
              </Link>
              <p className="text-sm text-gray-600">{task.description}</p>
            </div>
            <button
              onClick={() => toggleTask(task.id, !task.completed)}
              className={`ml-4 px-3 py-1 rounded text-white text-xs ${
                task.completed ? "bg-red-500" : "bg-green-500"
              }`}
            >
              Mark as {task.completed ? "Not Done" : "Done"}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
