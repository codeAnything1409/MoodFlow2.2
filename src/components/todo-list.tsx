'use client';

import { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Checkbox } from '@/components/ui/checkbox';
import { X, Plus, Pencil } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { cn } from '@/lib/utils';

type Task = {
  id: number;
  text: string;
  completed: boolean;
};

export default function TodoList() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
  const [editingText, setEditingText] = useState('');
  const editInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editingTaskId !== null) {
        editInputRef.current?.focus();
    }
  }, [editingTaskId]);

  const handleAddTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue.trim() === '') return;
    setTasks([
      ...tasks,
      { id: Date.now(), text: inputValue.trim(), completed: false },
    ]);
    setInputValue('');
  };

  const toggleTask = (id: number) => {
    setTasks(
      tasks.map((task: Task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  const deleteTask = (id: number) => {
    setTasks(tasks.filter((task: Task) => task.id !== id));
  };
  
  const handleEdit = (task: Task) => {
    setEditingTaskId(task.id);
    setEditingText(task.text);
  };

  const handleSaveEdit = (id: number) => {
    const trimmedText = editingText.trim();
    if (trimmedText === '') {
        deleteTask(id);
    } else {
        setTasks(tasks.map((task: Task) => task.id === id ? {...task, text: trimmedText} : task));
    }
    setEditingTaskId(null);
    setEditingText('');
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, id: number) => {
    if (e.key === 'Enter') {
        handleSaveEdit(id);
    } else if (e.key === 'Escape') {
        setEditingTaskId(null);
        setEditingText('');
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleAddTask} className="flex items-center gap-2" aria-label="Add new task form">
        <Input
          type="text"
          placeholder="Add a new task..."
          value={inputValue}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInputValue(e.target.value)}
          aria-label="Task input"
        />
        <Button type="submit" size="icon" aria-label="Add task">
          <Plus className="h-4 w-4" />
        </Button>
      </form>
      <ScrollArea className="h-48 pr-4">
        <div className="space-y-2">
            <AnimatePresence mode="popLayout">
            {tasks.map((task: Task) => (
                <motion.div
                key={task.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                className="flex items-center gap-3 p-2 rounded-md hover:bg-muted/50 transition-colors group"
                >
                <Checkbox
                    id={`task-${task.id}`}
                    checked={task.completed}
                    onCheckedChange={() => toggleTask(task.id)}
                    aria-label={`Complete task: ${task.text}`}
                />
                {editingTaskId === task.id ? (
                    <Input
                        ref={editInputRef}
                        value={editingText}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEditingText(e.target.value)}
                        onBlur={() => {
                          if (editingTaskId === task.id) {
                            handleSaveEdit(task.id);
                          }
                        }}
                        onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => handleKeyDown(e, task.id)}
                        className="h-8 flex-1"
                        aria-label={`Edit task: ${task.text}`}
                        autoFocus
                    />
                ) : (
                    <label
                        htmlFor={`task-${task.id}`}
                        className={cn(
                        'flex-1 text-sm font-medium transition-colors cursor-pointer',
                        task.completed ? 'text-muted-foreground line-through' : 'text-foreground'
                        )}
                        onDoubleClick={() => handleEdit(task)}
                    >
                        {task.text}
                    </label>
                )}
                <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-foreground"
                        onClick={() => handleEdit(task)}
                        aria-label={`Edit task: ${task.text}`}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 text-muted-foreground hover:text-destructive"
                        onClick={() => deleteTask(task.id)}
                        aria-label={`Delete task: ${task.text}`}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                </motion.div>
            ))}
            </AnimatePresence>
            {tasks.length === 0 && (
                <p key="empty-state" className="text-sm text-center text-muted-foreground py-8">
                    Your task list is empty. Add a task to get started!
                </p>
            )}
        </div>
      </ScrollArea>
    </div>
  );
}
