import { Request, Response } from 'express';
import { Task } from '../types/task';
import  logger  from '../utils/logger';

let tasks: Task[] = [];

export const getTasks = (req: Request, res: Response) => {
  logger.info('Fetching all tasks');
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
  logger.info('Task created', { task: newTask });
  res.status(201).json(newTask);
};

export const getTaskById = (req: Request<{ id: string }>, res: Response) => {
  const task = tasks.find(t => t.id === parseInt(req.params.id));
  if (!task) {
    logger.warn('Task not found', { taskId: req.params.id });
    return res.status(404).json({ message: 'Task not found' });
  }
  logger.info('Task fetched', { task });
  return res.json(task);
};

export const updateTaskStatus = (req: Request<{ id: string }>, res: Response) => {
  const task = tasks.find((t) => t.id === parseInt(req.params.id));
  if (!task) {
    logger.warn('Task not found for update', { taskId: req.params.id });
    return res.status(404).json({ message: 'Task not found' });
  }

  const prevStatus = task.completed;

  if (typeof req.body.completed === 'boolean') {
    task.completed = req.body.completed;
  } else {
    task.completed = !task.completed;
  }

  logger.info('Task status updated', {
    taskId: task.id,
    from: prevStatus,
    to: task.completed,
  });

  return res.json(task);
};