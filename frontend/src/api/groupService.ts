// src/api/groupService.ts
import { apiClient } from './client';
import { CreateGroupDto, UpdateGroupDto } from '../types'; // Definiremos estos tipos después

export const groupService = {
  async getAllGroups() {
    try {
      const response = await apiClient.get('/tasks');
      return response.data;
    } catch (error) {
      console.error('Error fetching groups:', error);
      throw error;
    }
  },

  async getGroupById(id: number) {
    try {
      const response = await apiClient.get(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching group with id ${id}:`, error);
      throw error;
    }
  },

  async createGroup(groupData: CreateGroupDto) {
    try {
      const response = await apiClient.post('/tasks', groupData);
      return response.data;
    } catch (error) {
      console.error('Error creating group:', error);
      throw error;
    }
  },

  async updateGroup(updateData: UpdateGroupDto) {
    try {
      const response = await apiClient.patch('/tasks', updateData);
      return response.data;
    } catch (error) {
      console.error('Error updating group:', error);
      throw error;
    }
  },

  async deleteGroup(id: number) {
    try {
      const response = await apiClient.delete(`/tasks/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting group:', error);
      throw error;
    }
  },
};