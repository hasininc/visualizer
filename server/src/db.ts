import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Store database json file in server/data/workspaces.json
const DB_FILE = path.join(__dirname, '..', 'data', 'workspaces.json');

export interface Workspace {
  id: string;
  name: string;
  dsType: string;
  elements: any[];
  updatedAt: string;
}

// Helper to ensure database file exists
async function ensureDbExists() {
  try {
    await fs.mkdir(path.dirname(DB_FILE), { recursive: true });
    try {
      await fs.access(DB_FILE);
    } catch {
      await fs.writeFile(DB_FILE, JSON.stringify([], null, 2), 'utf-8');
    }
  } catch (error) {
    console.error('Error ensuring DB file exists:', error);
  }
}

export async function getAllWorkspaces(): Promise<Workspace[]> {
  await ensureDbExists();
  try {
    const data = await fs.readFile(DB_FILE, 'utf-8');
    return JSON.parse(data) as Workspace[];
  } catch (error) {
    console.error('Error reading workspaces:', error);
    return [];
  }
}

export async function getWorkspaceById(id: string): Promise<Workspace | null> {
  const workspaces = await getAllWorkspaces();
  return workspaces.find((w) => w.id === id) || null;
}

export async function saveWorkspace(
  name: string,
  dsType: string,
  elements: any[]
): Promise<Workspace> {
  await ensureDbExists();
  const workspaces = await getAllWorkspaces();
  
  // Clean elements parentId structure if any element references parents that were deleted
  const elementIds = new Set(elements.map(el => el.id));
  const cleanedElements = elements.map(el => {
    if (el.parentId && !elementIds.has(el.parentId)) {
      const { parentId: _parentId, ...rest } = el;
      return rest;
    }
    return el;
  });

  // Check if workspace with same name and dsType exists to update it, otherwise create new
  const existingIdx = workspaces.findIndex(
    (w) => w.name.toLowerCase() === name.toLowerCase() && w.dsType === dsType
  );

  const now = new Date().toISOString();
  let savedWorkspace: Workspace;

  if (existingIdx !== -1) {
    // Update
    workspaces[existingIdx] = {
      ...workspaces[existingIdx],
      elements: cleanedElements,
      updatedAt: now,
    };
    savedWorkspace = workspaces[existingIdx];
  } else {
    // Insert
    savedWorkspace = {
      id: `ws-${Math.random().toString().slice(2, 10)}`,
      name,
      dsType,
      elements: cleanedElements,
      updatedAt: now,
    };
    workspaces.push(savedWorkspace);
  }

  await fs.writeFile(DB_FILE, JSON.stringify(workspaces, null, 2), 'utf-8');
  return savedWorkspace;
}

export async function deleteWorkspace(id: string): Promise<boolean> {
  await ensureDbExists();
  const workspaces = await getAllWorkspaces();
  const initialLength = workspaces.length;
  const filtered = workspaces.filter((w) => w.id !== id);
  
  if (filtered.length === initialLength) {
    return false;
  }
  
  await fs.writeFile(DB_FILE, JSON.stringify(filtered, null, 2), 'utf-8');
  return true;
}
