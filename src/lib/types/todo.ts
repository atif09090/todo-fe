export interface Todo {
    uuid: string
    title: string
    description: string
    status: boolean
    dueDate: Date,
    created_at?:Date
}

export type SortOption = 'dueDate' | 'added' | 'alphabetical'
export type FilterOption = 'all' | 'active' | 'completed' | 'expired' | 'today'