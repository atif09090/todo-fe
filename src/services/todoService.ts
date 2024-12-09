import { Todo } from "@/lib/types/todo";
import api from "./axios";

export const getTodos = async () => {
    try {
        const response = await api.get('todo');
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};


export const postTodo = async (body: Omit<Todo, 'uuid'>) => {
    try {
        const response = await api.post('todo', body);
        if (!response.statusText) {
            throw new Error(response.statusText);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const updateTodo = async (id: string, body: Partial<Todo>) => {
    try {
        const response = await api.put(`todo/${id}`, body);
        if (!response.statusText) {
            throw new Error(response.statusText);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};


export const deleteTodo = async (id: string) => {
    try {
        const response = await api.delete(`todo/${id}`);
        if (!response.statusText) {
            throw new Error(response.statusText);
        }
        return response.data;
    } catch (error) {
        throw error;
    }
};