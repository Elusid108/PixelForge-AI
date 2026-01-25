import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, FileText, Folder } from 'lucide-react';
import { useAppStore } from '../../store/useAppStore';
import { PromptTemplate } from '../../types';
import { saveTemplate, getTemplates, deleteTemplate } from '../../services/storage/indexedDB';

const DEFAULT_CATEGORIES = ['General', 'Art', 'Photography', 'Abstract', 'Custom'];

export const PromptTemplates: React.FC = () => {
  const { showTemplates, setShowTemplates, generationOptions, setGenerationOptions, showToast } = useAppStore();
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [editingTemplate, setEditingTemplate] = useState<PromptTemplate | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [newTemplate, setNewTemplate] = useState({ name: '', prompt: '', category: 'General' });

  useEffect(() => {
    if (showTemplates) {
      loadTemplates();
    }
  }, [showTemplates]);

  const loadTemplates = async () => {
    try {
      const allTemplates = await getTemplates();
      setTemplates(allTemplates);
    } catch (error) {
      console.error('Failed to load templates', error);
    }
  };

  const filteredTemplates = selectedCategory === 'All'
    ? templates
    : templates.filter((t) => t.category === selectedCategory);

  const categories = ['All', ...DEFAULT_CATEGORIES, ...Array.from(new Set(templates.map((t) => t.category).filter((c) => !DEFAULT_CATEGORIES.includes(c))))];

  const handleSaveTemplate = async () => {
    if (!newTemplate.name.trim() || !newTemplate.prompt.trim()) {
      showToast('Name and prompt are required', 'error');
      return;
    }

    setIsSaving(true);
    try {
      const template: PromptTemplate = {
        id: editingTemplate?.id || crypto.randomUUID(),
        name: newTemplate.name,
        prompt: newTemplate.prompt,
        category: newTemplate.category,
        createdAt: editingTemplate?.createdAt || Date.now(),
      };
      await saveTemplate(template);
      await loadTemplates();
      setNewTemplate({ name: '', prompt: '', category: 'General' });
      setEditingTemplate(null);
      showToast(editingTemplate ? 'Template updated' : 'Template saved', 'success');
    } catch (error) {
      showToast('Failed to save template', 'error');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteTemplate = async (id: string) => {
    try {
      await deleteTemplate(id);
      await loadTemplates();
      showToast('Template deleted', 'success');
    } catch (error) {
      showToast('Failed to delete template', 'error');
    }
  };

  const handleEditTemplate = (template: PromptTemplate) => {
    setEditingTemplate(template);
    setNewTemplate({
      name: template.name,
      prompt: template.prompt,
      category: template.category,
    });
  };

  const handleInsertTemplate = (template: PromptTemplate) => {
    setGenerationOptions({ prompt: template.prompt });
    showToast('Template inserted', 'success');
  };

  const handleSaveCurrentPrompt = () => {
    if (!generationOptions.prompt.trim()) {
      showToast('No prompt to save', 'info');
      return;
    }
    setNewTemplate({
      name: '',
      prompt: generationOptions.prompt,
      category: 'General',
    });
    setEditingTemplate(null);
  };

  if (!showTemplates) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm overflow-y-auto"
      onClick={() => setShowTemplates(false)}
    >
      <div
        className="bg-gray-900 border border-gray-800 rounded-2xl p-6 w-full max-w-4xl shadow-2xl my-8"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2 text-purple-400">
            <FileText size={24} />
            <h2 className="text-xl font-bold">Prompt Templates</h2>
          </div>
          <button
            onClick={() => setShowTemplates(false)}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Template List */}
          <div className="lg:col-span-2 space-y-4">
            {/* Category Filter */}
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1.5 text-xs rounded-lg transition-colors flex items-center gap-1 ${
                    selectedCategory === cat
                      ? 'bg-purple-600 text-white'
                      : 'bg-gray-800 text-gray-400 hover:bg-gray-700'
                  }`}
                >
                  {cat !== 'All' && <Folder size={12} />}
                  {cat}
                </button>
              ))}
            </div>

            {/* Template List */}
            <div className="space-y-2 max-h-[60vh] overflow-y-auto">
              {filteredTemplates.length === 0 ? (
                <div className="text-center text-gray-600 py-8 text-sm">
                  No templates in this category
                </div>
              ) : (
                filteredTemplates.map((template) => (
                  <div
                    key={template.id}
                    className="p-3 bg-gray-950 border border-gray-800 rounded-lg hover:border-purple-500/50 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <h3 className="font-semibold text-gray-200 text-sm truncate">
                            {template.name}
                          </h3>
                          <span className="text-xs text-gray-500 bg-gray-800 px-2 py-0.5 rounded">
                            {template.category}
                          </span>
                        </div>
                        <p className="text-xs text-gray-400 line-clamp-2 mb-2">
                          {template.prompt}
                        </p>
                      </div>
                      <div className="flex gap-1 shrink-0">
                        <button
                          onClick={() => handleInsertTemplate(template)}
                          className="p-1.5 text-blue-400 hover:bg-blue-400/10 rounded transition-colors"
                          title="Insert into prompt"
                        >
                          <Plus size={16} />
                        </button>
                        <button
                          onClick={() => handleEditTemplate(template)}
                          className="p-1.5 text-yellow-400 hover:bg-yellow-400/10 rounded transition-colors"
                          title="Edit template"
                        >
                          <Edit2 size={16} />
                        </button>
                        <button
                          onClick={() => handleDeleteTemplate(template.id)}
                          className="p-1.5 text-red-400 hover:bg-red-400/10 rounded transition-colors"
                          title="Delete template"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right: Save/Edit Form */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-300">
                {editingTemplate ? 'Edit Template' : 'New Template'}
              </h3>
              {generationOptions.prompt && (
                <button
                  onClick={handleSaveCurrentPrompt}
                  className="text-xs text-purple-400 hover:text-purple-300 flex items-center gap-1"
                >
                  <Plus size={12} />
                  Use Current Prompt
                </button>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-gray-400 mb-1 block">Name</label>
                <input
                  type="text"
                  value={newTemplate.name}
                  onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
                  placeholder="Template name"
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-sm text-gray-200 focus:border-purple-500 outline-none"
                />
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Category</label>
                <select
                  value={newTemplate.category}
                  onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-sm text-gray-200 focus:border-purple-500 outline-none"
                >
                  {DEFAULT_CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs text-gray-400 mb-1 block">Prompt</label>
                <textarea
                  value={newTemplate.prompt}
                  onChange={(e) => setNewTemplate({ ...newTemplate, prompt: e.target.value })}
                  placeholder="Enter prompt text..."
                  rows={6}
                  className="w-full bg-gray-950 border border-gray-800 rounded-lg p-2 text-sm text-gray-200 focus:border-purple-500 outline-none resize-none"
                />
              </div>

              <button
                onClick={handleSaveTemplate}
                disabled={isSaving || !newTemplate.name.trim() || !newTemplate.prompt.trim()}
                className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-500 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {editingTemplate ? 'Update Template' : 'Save Template'}
              </button>

              {editingTemplate && (
                <button
                  onClick={() => {
                    setEditingTemplate(null);
                    setNewTemplate({ name: '', prompt: '', category: 'General' });
                  }}
                  className="w-full px-4 py-2 bg-gray-800 hover:bg-gray-700 text-gray-300 font-medium rounded-lg transition-colors"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
