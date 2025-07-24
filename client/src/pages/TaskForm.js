import React from 'react';
import { useForm } from 'react-hook-form';
import { useMutation, useQuery, useQueryClient } from 'react-query';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../App';
import { Save, ArrowLeft, Calendar } from 'lucide-react';
import toast from 'react-hot-toast';

const TaskForm = () => {
  const { api } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const isEditing = Boolean(id);

  const {
    register,
    handleSubmit,
    formState: { errors },
    
    setValue,
  } = useForm();

  // Fetch task data if editing
const { isLoading: taskLoading } = useQuery(
  ['task', id],
  async () => {
    const response = await api.get(`/tasks/${id}`);
    return response.data;
  },
  {
    enabled: isEditing,
    onSuccess: (data) => {
      setValue('title', data.title);
      setValue('description', data.description || '');
      setValue('status', data.status);
      setValue('priority', data.priority);
      if (data.dueDate) {
        setValue('dueDate', new Date(data.dueDate).toISOString().split('T')[0]);
      }
    },
  }
);


  // Create/Update mutation
  const mutation = useMutation(
    async (data) => {
      if (isEditing) {
        await api.put(`/tasks/${id}`, data);
      } else {
        await api.post('/tasks', data);
      }
    },
    {
      onSuccess: () => {
        queryClient.invalidateQueries('tasks');
        toast.success(isEditing ? 'Task updated successfully!' : 'Task created successfully!');
        navigate('/tasks');
      },
      onError: (error) => {
        toast.error(error.response?.data?.error || 'Failed to save task');
      },
    }
  );

  const onSubmit = (data) => {
    // Convert dueDate to ISO string if provided
    if (data.dueDate) {
      data.dueDate = new Date(data.dueDate).toISOString();
    }
    mutation.mutate(data);
  };

  if (isEditing && taskLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center">
          <button
            onClick={() => navigate('/tasks')}
            className="mr-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {isEditing ? 'Edit Task' : 'Create New Task'}
            </h1>
            <p className="text-gray-600">
              {isEditing ? 'Update your task details' : 'Add a new task to your list'}
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="card">
          {/* Title */}
          <div className="mb-4">
            <label htmlFor="title" className="form-label">
              Title *
            </label>
            <input
              id="title"
              type="text"
              className={`input-field ${errors.title ? 'border-red-500' : ''}`}
              placeholder="Enter task title"
              {...register('title', {
                required: 'Title is required',
                maxLength: {
                  value: 100,
                  message: 'Title must be less than 100 characters',
                },
              })}
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
            )}
          </div>

          {/* Description */}
          <div className="mb-4">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <textarea
              id="description"
              rows="4"
              className={`input-field ${errors.description ? 'border-red-500' : ''}`}
              placeholder="Enter task description (optional)"
              {...register('description', {
                maxLength: {
                  value: 500,
                  message: 'Description must be less than 500 characters',
                },
              })}
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          {/* Status and Priority */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label htmlFor="status" className="form-label">
                Status
              </label>
              <select
                id="status"
                className={`input-field ${errors.status ? 'border-red-500' : ''}`}
                {...register('status')}
              >
                <option value="pending">Pending</option>
                <option value="in-progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
              {errors.status && (
                <p className="mt-1 text-sm text-red-600">{errors.status.message}</p>
              )}
            </div>

            <div>
              <label htmlFor="priority" className="form-label">
                Priority
              </label>
              <select
                id="priority"
                className={`input-field ${errors.priority ? 'border-red-500' : ''}`}
                {...register('priority')}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
              {errors.priority && (
                <p className="mt-1 text-sm text-red-600">{errors.priority.message}</p>
              )}
            </div>
          </div>

          {/* Due Date */}
          <div className="mb-4">
            <label htmlFor="dueDate" className="form-label">
              Due Date
            </label>
            <div className="relative">
              <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                id="dueDate"
                type="date"
                className={`input-field pl-10 ${errors.dueDate ? 'border-red-500' : ''}`}
                {...register('dueDate', {
                  validate: (value) => {
                    if (value) {
                      const selectedDate = new Date(value);
                      const today = new Date();
                      today.setHours(0, 0, 0, 0);
                      return selectedDate >= today || 'Due date cannot be in the past';
                    }
                    return true;
                  },
                })}
              />
            </div>
            {errors.dueDate && (
              <p className="mt-1 text-sm text-red-600">{errors.dueDate.message}</p>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4">
          <button
            type="button"
            onClick={() => navigate('/tasks')}
            className="btn-secondary"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={mutation.isLoading}
            className="btn-primary flex items-center"
          >
            {mutation.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                {isEditing ? 'Update Task' : 'Create Task'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default TaskForm; 