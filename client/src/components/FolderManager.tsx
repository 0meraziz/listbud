import React, { useState } from 'react';
import { Plus, Edit, Trash2, FolderIcon } from 'lucide-react';
import { foldersService } from '../services/api';
import { Folder } from '../types';
import { Button, Input, Card, Stack } from './ui';

interface FolderManagerProps {
  folders: Folder[];
  onFoldersChange: () => void;
}

const FolderManager: React.FC<FolderManagerProps> = ({ folders, onFoldersChange }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCreateFolder = async () => {
    if (!newFolderName.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await foldersService.createFolder(newFolderName.trim(), newFolderColor);
      setNewFolderName('');
      setNewFolderColor('#3B82F6');
      setIsCreating(false);
      onFoldersChange();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to create folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateFolder = async (id: string, name: string, color: string) => {
    if (!name.trim()) {
      setError('Folder name is required');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await foldersService.updateFolder(id, name.trim(), color);
      setEditingId(null);
      onFoldersChange();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to update folder');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteFolder = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this folder? Places will be moved to "Uncategorized".')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      await foldersService.deleteFolder(id);
      onFoldersChange();
    } catch (err: any) {
      setError(err.response?.data?.error || 'Failed to delete folder');
    } finally {
      setIsLoading(false);
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setNewFolderName('');
    setNewFolderColor('#3B82F6');
    setError('');
  };

  return (
    <Card padding="md">
      <Stack spacing="sm">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gray-900">Folders</h2>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            leftIcon={Plus}
            disabled={isCreating}
          >
            Add Folder
          </Button>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        {isCreating && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Stack spacing="sm">
              <div className="flex gap-2">
                <Input
                  type="text"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="Folder name"
                  className="flex-1"
                />
                <input
                  type="color"
                  value={newFolderColor}
                  onChange={(e) => setNewFolderColor(e.target.value)}
                  className="w-10 h-10 rounded border border-gray-300"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateFolder}
                  disabled={isLoading}
                >
                  {isLoading ? 'Creating...' : 'Create'}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={cancelEdit}
                  disabled={isLoading}
                >
                  Cancel
                </Button>
              </div>
            </Stack>
          </div>
        )}

        <div className="space-y-2">
          {folders.map((folder) => (
            <div
              key={folder.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              {editingId === folder.id ? (
                <EditFolderForm
                  folder={folder}
                  onSave={handleUpdateFolder}
                  onCancel={cancelEdit}
                  isLoading={isLoading}
                />
              ) : (
                <>
                  <div className="flex items-center gap-3">
                    <FolderIcon
                      className="w-5 h-5"
                      style={{ color: folder.color }}
                    />
                    <div>
                      <p className="font-medium text-gray-900">{folder.name}</p>
                      <p className="text-sm text-gray-500">
                        {folder.placeCount} place{folder.placeCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => setEditingId(folder.id)}
                      className="text-gray-500 hover:text-blue-600"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="xs"
                      onClick={() => handleDeleteFolder(folder.id)}
                      className="text-gray-500 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {folders.length === 0 && !isCreating && (
          <div className="text-center py-8">
            <FolderIcon className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500">No folders yet. Create one to organize your places!</p>
          </div>
        )}
      </Stack>
    </Card>
  );
};

interface EditFolderFormProps {
  folder: Folder;
  onSave: (id: string, name: string, color: string) => void;
  onCancel: () => void;
  isLoading: boolean;
}

const EditFolderForm: React.FC<EditFolderFormProps> = ({ folder, onSave, onCancel, isLoading }) => {
  const [name, setName] = useState(folder.name);
  const [color, setColor] = useState(folder.color);

  return (
    <div className="flex-1">
      <Stack spacing="sm">
        <div className="flex gap-2">
          <Input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Folder name"
            className="flex-1"
          />
          <input
            type="color"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className="w-10 h-10 rounded border border-gray-300"
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            onClick={() => onSave(folder.id, name, color)}
            disabled={isLoading}
          >
            {isLoading ? 'Saving...' : 'Save'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={onCancel}
            disabled={isLoading}
          >
            Cancel
          </Button>
        </div>
      </Stack>
    </div>
  );
};

export default FolderManager;
