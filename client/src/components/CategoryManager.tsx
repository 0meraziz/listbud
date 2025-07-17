import React, { useState, useEffect } from 'react';
import { Plus, X, Edit3, Palette, Tag } from 'lucide-react';
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
    { color: '#3b82f6', name: 'Blue' },
    { color: '#ef4444', name: 'Red' },
    { color: '#10b981', name: 'Green' },
    { color: '#f59e0b', name: 'Yellow' },
    { color: '#8b5cf6', name: 'Purple' },
    { color: '#ec4899', name: 'Pink' },
    { color: '#06b6d4', name: 'Cyan' },
    { color: '#84cc16', name: 'Lime' },
    { color: '#f97316', name: 'Orange' },
    { color: '#6366f1', name: 'Indigo' },
    { color: '#14b8a6', name: 'Teal' },
    { color: '#eab308', name: 'Amber' }
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
    <Card variant="elevated" padding="lg">
      <Stack spacing="lg">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold text-gray-900">Categories</h3>
            <p className="text-sm text-gray-500 mt-1">
              Organize your places with custom categories and colors
            </p>
          </div>
          {!isCreating && categories.length > 0 && (
            <Button
              variant="primary"
              size="sm"
              onClick={() => setIsCreating(true)}
              leftIcon={Plus}
            >
              Add Category
            </Button>
          )}
        </div>

        {isCreating && (
          <Card variant="outlined" padding="md" className="bg-gray-50 border-dashed">
            <Stack spacing="md">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center">
                  <Plus className="w-4 h-4 text-blue-600" />
                </div>
                <h4 className="text-sm font-semibold text-gray-900">Create New Category</h4>
              </div>

              <Input
                label="Category Name"
                placeholder="e.g., Restaurants, Must Visit, Favorites"
                value={newCategory.name}
                onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                autoFocus
                helperText="Choose a descriptive name for your category"
              />

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Color
                </label>
                <div className="flex flex-wrap gap-2">
                  {predefinedColors.map(colorOption => (
                    <button
                      key={colorOption.color}
                      onClick={() => setNewCategory({ ...newCategory, color: colorOption.color })}
                      className={`w-10 h-10 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                        newCategory.color === colorOption.color
                          ? 'border-gray-900 scale-105 shadow-md'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      style={{ backgroundColor: colorOption.color }}
                      title={colorOption.name}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <Button
                  variant="primary"
                  onClick={handleCreateCategory}
                  loading={isLoading}
                  disabled={!newCategory.name.trim()}
                  className="flex-1"
                >
                  Create Category
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsCreating(false);
                    setNewCategory({ name: '', color: '#3b82f6' });
                  }}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </Stack>
          </Card>
        )}

        {categories.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Tag className="w-8 h-8 text-gray-400" />
            </div>
            <h4 className="text-lg font-medium text-gray-900 mb-2">No categories yet</h4>
            <p className="text-sm text-gray-500 mb-6">Create your first category to organize your places by type, mood, or any system that works for you.</p>
            <Button
              variant="primary"
              onClick={() => setIsCreating(true)}
              leftIcon={Plus}
              disabled={isCreating}
            >
              Create First Category
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {categories.map(category => (
              <div
                key={category.id}
                className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl hover:border-gray-300 hover:shadow-sm transition-all duration-200 group"
              >
                <div className="flex items-center gap-3">
                  <div
                    className="w-5 h-5 rounded-lg shadow-sm"
                    style={{ backgroundColor: category.color }}
                  />
                  <div>
                    <span className="text-sm font-semibold text-gray-900">
                      {category.name}
                    </span>
                    <p className="text-xs text-gray-500 mt-0.5">
                      Category • Created recently
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleDeleteCategory(category.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity text-red-500 hover:text-red-700 hover:bg-red-50"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </Stack>
    </Card>
  );
};

export default CategoryManager;
