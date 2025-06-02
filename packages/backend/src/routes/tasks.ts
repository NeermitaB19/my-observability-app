import { Router } from 'express';
import { getTasks, createTask, getTaskById, updateTaskStatus } from '../controllers/tasksController';

const router = Router();

router.get('/', getTasks);
router.post('/', createTask);
router.get('/:id', getTaskById);
router.patch('/:id', updateTaskStatus);
export default router;
