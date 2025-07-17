import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Palette } from 'lucide-react';
import { Category } from '../types';
import { categoriesService } from '../services/api';
import { Button, Card, Stack, Input } from './ui';

interface CategoryManagerProps {
  categories: Category[];
  onCategoriesChange: () => void;
}

const CategoryManager: React.FC<CategoryManagerProps> = ({
  categories,
  onCategoriesChange
}) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', color: '#3b82f6' });
  const [isLoading, setIsLoading] = useState(false);

  const predefinedColors = [
    '#3b82f6', '#ef4444', '#10b981', '#f59e0b',
    '#8b5cf6', '#ec4899', '#06b6d4', '#84cc16',
    '#f97316', '#6366f1', '#14b8a6', '#eab308'
  ];

  const handleCreateCategory = async () => {
    if (!newCategory.name.trim()) return;

    setIsLoading(true);
    try {
      await categoriesService.createCategory(newCategory.name, newCategory.color);
      setNewCategory({ name: '', color: '#3b82f6' });
      setIsCreating(false);
      onCategoriesChange();
    } catch (error) {
      console.error('Error creating category:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) return;

    try {
      await categoriesService.deleteCategory(categoryId);
      onCategoriesChange();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  return (
    <Card padding="md">
      <Stack spacing="md">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">Categories</h3>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsCreating(true)}
            leftIcon={Plus}
            disabled={isCreating}
          >
            Add Category
          </Button>
        </div>

        {isCreating && (
          <Card padding="sm" className="bg-gray-50">
            <Stack spacing="sm">
              <Input
                placeholder="Category name"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                autoFocus
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map(color => (
                    <button
                      key={color}
                      onClick={() => setNewCategory({ ...newCategory, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        newCategory.color === color
                          ? 'border-gray-900 scale-110'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-2">
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handleCreateCategory}
                  loading={isLoading}
                  disabled={!newCategory.name.trim()}
                >
                  Create
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategory({ name: '', color: '#3b82f6' });
                  }}
                >
                  Cancel
                </Button>
              </div>
            </Stack>
          </Card>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            <Palette className="mx-auto h-12 w-12 mb-3 text-gray-400" />
            <p>No categories yet. Create your first category to organize your places!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <div
                    className="w-4 h-4 rounded-full"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm font-medium text-gray-900">
                    {category.name}
                  </span>
                </div>
                <Button
                  variant="ghost"
                  size="xs"
                  onClick={() => handleDeleteCategory(category.id)}
                  className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default CategoryManager;
