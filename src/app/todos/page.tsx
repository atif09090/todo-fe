"use client"

import { useState, useMemo, useEffect } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format, isAfter, isBefore, isToday } from "date-fns"
import { CalendarIcon, Edit2Icon } from 'lucide-react'
import { toast } from 'react-toastify'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { Todo, SortOption, FilterOption } from '@/lib/types/todo'
import { Textarea } from '@/components/ui/textarea'
import { getTodos, postTodo, deleteTodo as deleteTodoById, updateTodo } from '@/services/todoService'
import { useRouter } from 'next/navigation'


export default function TodoPage() {
  const router = useRouter();
  const [todos, setTodos] = useState<Todo[]>([])
  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newDueDate, setNewDueDate] = useState<Date | undefined>(undefined)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDescription, setEditDescription] = useState('')
  const [editDueDate, setEditDueDate] = useState<Date | undefined>(undefined)
  const [sortOption, setSortOption] = useState<SortOption>('dueDate')
  const [filterOption, setFilterOption] = useState<FilterOption>('all')

  const addTodo = async () => {
    if (newTitle.trim() && newDueDate) {
      const response = await postTodo({
        title: newTitle,
        description: newDescription,
        status: false,
        dueDate: newDueDate
      })
      if (response) {

        setNewTitle('')
        setNewDescription('')
        setNewDueDate(undefined)
        toast.success('Todo added successfully!')
        getTodoList()
      } else {
        toast.error(response)
      }
    } else {
      toast.error('Please enter a title and select a due date')
    }
  }

  const deleteTodo = async (id: string) => {
    const todoToDelete = todos.find(todo => todo.uuid === id)
    if (todoToDelete && isExpired(todoToDelete.dueDate)) {
      toast.error('Cannot delete an expired todo')
      return
    }

    const response = await deleteTodoById(String(id));
    if (response) {
      getTodoList()
      toast.success('Todo deleted successfully!')
    } else {
      toast.error(response)
    }
  }

  const toggleTodo = async (id: string) => {

    const response = await updateTodo(id, {
      status: true,
    })

    if (response) {
      getTodoList()
    }

  }

  const startEditing = (todo: Todo) => {
    if (isExpired(todo.dueDate)) {
      toast.error('Cannot edit an expired todo')
      return
    }
    setEditingId(todo.uuid)
    setEditTitle(todo.title)
    setEditDescription(todo.description)
    setEditDueDate(todo.dueDate)
  }

  const finishEditing = async () => {
    if (editingId === null) return

  
    const response = await await updateTodo(editingId, {
      title: editTitle,
      description: editDescription,
      dueDate: editDueDate
    })

    if(response){
      setEditingId(null)
      setEditTitle('')
      setEditDescription('')
      setEditDueDate(undefined)
      toast.success('Todo updated successfully!')
      getTodoList()
    }else{
      toast.error(response)
    }
  }

  const isExpired = (dueDate: Date) => {
    return isAfter(new Date(), dueDate)
  }

  const getDateStatus = (dueDate: Date) => {
    if (isExpired(dueDate)) return 'Expired'
    if (isToday(dueDate)) return 'Today'
    if (isBefore(dueDate, new Date())) return 'Overdue'
    return 'Upcoming'
  }

  const sortedAndFilteredTodos = useMemo(() => {
    let filteredTodos = todos

    switch (filterOption) {
      case 'active':
        filteredTodos = todos.filter(todo => !todo.status && !isExpired(todo.dueDate))
        break
      case 'completed':
        filteredTodos = todos.filter(todo => todo.status)
        break
      case 'expired':
        filteredTodos = todos.filter(todo => isExpired(todo.dueDate))
        break
      case 'today':
        filteredTodos = todos.filter(todo => isToday(todo.dueDate))
        break
    }

    return filteredTodos.sort((a:Todo, b:Todo) => {
      switch (sortOption) {
        case 'dueDate':
          return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        case 'added':
          return Number(a.uuid) - Number(b.uuid)
        case 'alphabetical':
          return a.title.localeCompare(b.title)
        default:
          return 0
      }
    })
  }, [todos, sortOption, filterOption])

  const getTodoList = async () => {
    const list = await getTodos();
    setTodos(list.todos);
  }

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    }
  }, [router]);

  useEffect(() => {
    getTodoList()
  }, [])

  return (
    <div className="min-h-screen bg-background p-8">
      <Card className="w-full max-w-3xl mx-auto">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Todo List</CardTitle>
          <ThemeToggle />
        </CardHeader>
        <CardContent>
          <div className="flex flex-col space-y-2 mb-4">
            <Input
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Add a new todo title"
            />
            <Textarea
              value={newDescription}
              onChange={(e) => setNewDescription(e.target.value)}
              placeholder="Add a description..."
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !newDueDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {newDueDate ? format(newDueDate, "PPP") : <span>Pick a due date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={newDueDate}
                  onSelect={setNewDueDate}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
            <Button onClick={addTodo}>Add Todo</Button>
          </div>
          <div className="flex justify-between mb-4">
            <Select value={sortOption} onValueChange={(value: SortOption) => setSortOption(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Sort by Due Date</SelectItem>
                <SelectItem value="added">Sort by Added Date</SelectItem>
                <SelectItem value="alphabetical">Sort Alphabetically</SelectItem>
              </SelectContent>
            </Select>
            <Select value={filterOption} onValueChange={(value: FilterOption) => setFilterOption(value)}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Show All</SelectItem>
                <SelectItem value="active">Show Active</SelectItem>
                <SelectItem value="completed">Show Completed</SelectItem>
                <SelectItem value="expired">Show Expired</SelectItem>
                <SelectItem value="today">Show Today`s</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <ul className="space-y-4">
            {sortedAndFilteredTodos.map((todo,index) => (
              <li key={index} className="bg-secondary p-4 rounded-md">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <Checkbox
                      checked={todo.status}
                      onCheckedChange={() => toggleTodo(todo.uuid)}
                      disabled={isExpired(todo.dueDate)}
                    />
                    {editingId === todo.uuid ? (
                      <Input
                        value={editTitle}
                        onChange={(e) => setEditTitle(e.target.value)}
                        className="flex-grow"
                      />
                    ) : (
                      <h3 className={cn(
                        "text-lg font-semibold",
                        todo.status && "line-through text-muted-foreground",
                        isExpired(todo.dueDate) && "text-destructive"
                      )}>
                        {todo.title}
                      </h3>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <span className={cn(
                      "text-sm px-2 py-1 rounded-full",
                      getDateStatus(todo.dueDate) === 'Expired' && "bg-destructive text-destructive-foreground",
                      getDateStatus(todo.dueDate) === 'Today' && "bg-yellow-500 text-yellow-950",
                      getDateStatus(todo.dueDate) === 'Overdue' && "bg-orange-500 text-orange-950",
                      getDateStatus(todo.dueDate) === 'Upcoming' && "bg-green-500 text-green-950"
                    )}>
                      {getDateStatus(todo.dueDate)}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => startEditing(todo)}
                      disabled={isExpired(todo.dueDate)}
                    >
                      <Edit2Icon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => deleteTodo(todo.uuid)}
                      disabled={isExpired(todo.dueDate)}
                    >
                      <span className="sr-only">Delete</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                        <path d="M3 6h18"></path>
                        <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                        <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                        <line x1="10" y1="11" x2="10" y2="17"></line>
                        <line x1="14" y1="11" x2="14" y2="17"></line>
                      </svg>
                    </Button>
                  </div>
                </div>
                {editingId === todo.uuid ? (
                  <div className="space-y-2">
                    <Textarea
                      value={editDescription}
                      onChange={(e) => setEditDescription(e.target.value)}
                      className="w-full"
                    />
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button variant="outline" className="w-full justify-start">
                          <CalendarIcon className="mr-2 h-4 w-4" />
                          {editDueDate ? format(editDueDate, "PPP") : <span>Pick a due date</span>}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={editDueDate}
                          onSelect={setEditDueDate}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <Button onClick={finishEditing}>Save Changes</Button>
                  </div>
                ) : (
                  <div>
                    <p className="text-sm text-muted-foreground">{todo.description}</p>
                    <p className="text-sm mt-2">Due: {format(todo.dueDate, "PPP")}</p>
                  </div>
                )}
              </li>
            ))}
          </ul>
        </CardContent>
      </Card>
    </div>
  )
}




