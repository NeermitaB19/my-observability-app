import { Request, Response } from 'express';
import { Task } from '../types/task';

let tasks: Task[] = [];

export const getTasks = (req: Request, res: Response) => {
  res.json(tasks);
};

export const createTask = (req: Request, res: Response) => {
  const newTask: Task = {
    id: tasks.length + 1,
    title: req.body.title,
    description: req.body.description || "",
    completed: false
  };
  tasks.push(newTask);
  res.status(201).json(newTask);
};

export const getTaskById = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }
  return res.json(task);
};

export const updateTaskStatus = (
  req: Request<{ id: string }>,
  res: Response
) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    return res.status(404).json({ message: 'Task not found' });
  }

  // Toggle or set the status from request body
  if (typeof req.body.completed === 'boolean') {
    task.completed = req.body.completed;
  } else {
    task.completed = !task.completed; // toggle if not explicitly set
  }

  return res.json(task);
};

