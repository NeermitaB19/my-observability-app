import Link from "next/link";

export default function HomePage() {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Schema Studio - Task Tracker</h1>
      <p className="mb-6">
        Welcome to your observability-driven task management system!
      </p>

      <Link href="/tasks">
        <span className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
          Go to Tasks
        </span>
      </Link>
    </div>
  );
}
