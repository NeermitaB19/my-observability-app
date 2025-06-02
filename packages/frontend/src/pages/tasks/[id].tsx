import { useRouter } from "next/router";
import { useEffect, useState } from "react";

type Task = {
  id: string;
  title: string;
  description: string;
  completed: boolean;
};

export default function TaskDetailPage() {
  const router = useRouter();
  const { id } = router.query;
  const [task, setTask] = useState<Task | null>(null);

  useEffect(() => {
    if (!id) return;
    fetch(`http://localhost:4000/api/tasks/${id}`)
      .then((res) => res.json())
      .then(setTask);
  }, [id]);

  if (!task) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold">{task.title}</h1>
      <p className="text-gray-600 mt-2">{task.description}</p>
      <p className="mt-4 text-sm text-gray-500">
        Status: {task.completed ? "✅ Done" : "❌ Not Done"}
      </p>
    </div>
  );
}
