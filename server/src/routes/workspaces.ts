import { Router, Request, Response } from 'express';
import {
  getAllWorkspaces,
  getWorkspaceById,
  saveWorkspace,
  deleteWorkspace,
} from '../db.js';

const router = Router();

// GET all workspaces
router.get('/', async (req: Request, res: Response) => {
  try {
    const list = await getAllWorkspaces();
    res.json(list);
  } catch (error) {
    console.error('Failed to fetch workspaces:', error);
    res.status(500).json({ error: 'Failed to fetch workspaces' });
  }
});

// GET workspace by ID
router.get('/:id', async (req: Request, res: Response) => {
  try {
    const ws = await getWorkspaceById(req.params.id);
    if (!ws) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    res.json(ws);
  } catch (error) {
    console.error('Failed to fetch workspace:', error);
    res.status(500).json({ error: 'Failed to fetch workspace' });
  }
});

// POST save workspace
router.post('/', async (req: Request, res: Response) => {
  try {
    const { name, dsType, elements } = req.body;
    if (!name || !dsType || !Array.isArray(elements)) {
      return res.status(400).json({ error: 'Missing name, dsType, or elements' });
    }
    const ws = await saveWorkspace(name, dsType, elements);
    res.status(201).json(ws);
  } catch (error) {
    console.error('Failed to save workspace:', error);
    res.status(500).json({ error: 'Failed to save workspace' });
  }
});

// DELETE workspace
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const success = await deleteWorkspace(req.params.id);
    if (!success) {
      return res.status(404).json({ error: 'Workspace not found' });
    }
    res.json({ success: true, message: 'Workspace deleted' });
  } catch (error) {
    console.error('Failed to delete workspace:', error);
    res.status(500).json({ error: 'Failed to delete workspace' });
  }
});

export default router;
