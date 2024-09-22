'use client';

import useTodoData from '@/hooks/SWR/useTodoData';
import { useState } from 'react';
import { useSWRConfig } from 'swr';

const addNewTodo = async (newTodo: string) => {
  const response = await fetch('/api/todo', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ title: newTodo }),
  });

  if (!response.ok) {
    console.error('Failed to add new todo');
    return;
  }
};

const deleteTodo = async (id: string) => {
  const response = await fetch('/api/todo', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id }),
  });

  if (!response.ok) {
    console.error('Failed to delete todo');
    return;
  }
};

const toggleTodo = async (id: string, completed: boolean) => {
  const response = await fetch('/api/todo', {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id, completed }),
  });

  if (!response.ok) {
    console.error('Failed to toggle todo');
    return;
  }
};

const TodoPage = () => {
  const { mutate } = useSWRConfig();
  const { todos, isError, isLoading } = useTodoData();
  const [newTodo, setNewTodo] = useState('');

  if (isLoading || !todos) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-xl font-semibold'>Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className='flex h-screen items-center justify-center'>
        <div className='text-xl font-semibold text-red-500'>Error loading todos</div>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNewTodo('');
    if (!newTodo) return;
    await mutate('/api/todo', async () => {
      await addNewTodo(newTodo);
      return {
        data: [
          ...todos,
          {
            id: `${todos.length + 1}`,
            title: newTodo,
            completed: false,
            createdAt: new Date().toISOString(),
          },
        ],
        revalidate: false,
        populateCache: true,
        rollbackOnError: true,
      };
    });
  };

  const handleDelete = async (id: string) => {
    await mutate('/api/todo', async () => {
      await deleteTodo(id);
      return {
        data: todos.filter((todo) => todo.id !== id),
        revalidate: false,
        populateCache: true,
        rollbackOnError: true,
      };
    });
  };

  const handleToggle = async (id: string) => {
    const todo = todos.find((todo) => todo.id === id);
    if (!todo) {
      console.error('Todo not found');
      return;
    }

    await mutate('/api/todo', async () => {
      await toggleTodo(id, !todo.completed);
      return {
        data: todos.map((todo) =>
          todo.id === id ? { ...todo, completed: !todo.completed } : todo,
        ),
        revalidate: false,
        populateCache: true,
        rollbackOnError: true,
      };
    });
  };

  return (
    <div className='flex min-h-screen items-center justify-center bg-gray-100 p-4'>
      <div className='w-full max-w-md rounded-lg bg-white p-6 shadow-lg'>
        <h1 className='mb-6 text-2xl font-bold'>Todo List</h1>

        <form onSubmit={handleSubmit} className='mb-6 flex'>
          <input
            type='text'
            value={newTodo}
            onChange={(e) => setNewTodo(e.target.value)}
            placeholder='Enter new todo'
            className='grow rounded-l-lg border border-gray-300 px-4 py-2 focus:outline-none focus:ring-0'
          />
          <button
            type='submit'
            className='rounded-r-lg bg-black px-4 py-2 text-white hover:bg-black/90 focus:outline-none focus:ring-0'
          >
            Add
          </button>
        </form>

        <div className='space-y-4'>
          {todos.map((todo) => (
            <div
              key={todo.id}
              className='flex items-center justify-between rounded-lg bg-gray-50 p-4 shadow'
            >
              <div className='flex items-center space-x-3'>
                <input
                  type='checkbox'
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  className='size-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500'
                  readOnly
                  onClick={() => handleToggle(todo.id)}
                />
                <label
                  htmlFor={`todo-${todo.id}`}
                  className={`text-sm font-medium ${todo.completed ? 'text-gray-500 line-through' : 'text-gray-900'}`}
                >
                  {todo.title}
                </label>
              </div>
              <button
                className='rounded-md bg-red-600 px-2 py-1.5 text-xs font-medium text-white'
                onClick={() => handleDelete(todo.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TodoPage;
