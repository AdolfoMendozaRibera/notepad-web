// src/api/noteService.ts
import { CreateNoteDto, UpdateNoteDto } from "../types";
import { apiClient } from "./client";

export const noteService = {
    async getAllNotes() {
        try {
            const response = await apiClient.get('/notes');
            return response.data;
        } catch (error) {
            console.error('Error fetching notes:', error);
            throw error;
        }
    },

    async createNote(noteData: Omit<CreateNoteDto, 'id'>) { // id es generado automáticamente
        try {
            const response = await apiClient.post('/notes', noteData);
            return response.data;
        } catch (error) {
            console.error('Error creating note:', error);
            throw error;
        }
    },

    async updateNote(updateData: UpdateNoteDto) {
        try {
            const response = await apiClient.patch('/notes', updateData);
            return response.data;
        } catch (error) {
            console.error('Error updating note:', error);
            throw error;
        }
    },

    async deleteNote(id: number) {  
        try {
            const response = await apiClient.delete(`/notes/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error deleting note:', error);
            throw error;
        }
    }
}