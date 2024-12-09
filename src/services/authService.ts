/* eslint-disable @typescript-eslint/no-explicit-any */
import api from "./axios";

export const Login = async (body: any) => {
    try {
        const response = await api.post('auth/login', body);
        if (!response.statusText) {
            throw new Error("Invalid credentials or server error");
          }
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};


export const Register = async (body: any) => {
    try {
        const response = await api.post('auth/register', body);
        if (!response.statusText) {
            throw new Error("server error");
          }
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};


export const Logout = async () => {
    try {
        const response = await api.post('auth/logout', {});
        if (!response.statusText) {
            throw new Error("server error");
          }
        return response.data;
    } catch (error) {
        console.error('Error fetching logs:', error);
        throw error;
    }
};