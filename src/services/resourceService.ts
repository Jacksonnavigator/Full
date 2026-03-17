/**
 * HydraNet Resource Service
 * Handles CRUD operations for utilities, DMAs, teams, engineers, etc.
 * Uses HydraNet Backend API (FastAPI)
 */

import { apiGet, apiPost, apiPut, apiDelete } from './apiClient';

// ============ UTILITIES ============

export interface Utility {
  id: string;
  name: string;
  code: string;
  country?: string;
  state?: string;
  region?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getUtilities(filters?: any): Promise<Utility[]> {
  return apiGet<Utility[]>('/api/utilities', { params: filters });
}

export async function getUtility(utilityId: string): Promise<Utility> {
  return apiGet<Utility>(`/api/utilities/${utilityId}`);
}

export async function createUtility(data: Omit<Utility, 'id' | 'created_at' | 'updated_at'>): Promise<Utility> {
  return apiPost<Utility>('/api/utilities', data);
}

export async function updateUtility(utilityId: string, data: Partial<Utility>): Promise<Utility> {
  return apiPut<Utility>(`/api/utilities/${utilityId}`, data);
}

export async function deleteUtility(utilityId: string): Promise<void> {
  return apiDelete(`/api/utilities/${utilityId}`);
}

// ============ DMAs (Distribution Management Areas) ============

export interface DMA {
  id: string;
  utility_id: string;
  name: string;
  code: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getDMAs(filters?: any): Promise<DMA[]> {
  return apiGet<DMA[]>('/api/dmas', { params: filters });
}

export async function getDMA(dmaId: string): Promise<DMA> {
  return apiGet<DMA>(`/api/dmas/${dmaId}`);
}

export async function createDMA(data: Omit<DMA, 'id' | 'created_at' | 'updated_at'>): Promise<DMA> {
  return apiPost<DMA>('/api/dmas', data);
}

export async function updateDMA(dmaId: string, data: Partial<DMA>): Promise<DMA> {
  return apiPut<DMA>(`/api/dmas/${dmaId}`, data);
}

export async function deleteDMA(dmaId: string): Promise<void> {
  return apiDelete(`/api/dmas/${dmaId}`);
}

// ============ BRANCHES ============

export interface Branch {
  id: string;
  utility_id: string;
  dma_id: string;
  name: string;
  code: string;
  location?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getBranches(filters?: any): Promise<Branch[]> {
  return apiGet<Branch[]>('/api/branches', { params: filters });
}

export async function getBranch(branchId: string): Promise<Branch> {
  return apiGet<Branch>(`/api/branches/${branchId}`);
}

export async function createBranch(data: Omit<Branch, 'id' | 'created_at' | 'updated_at'>): Promise<Branch> {
  return apiPost<Branch>('/api/branches', data);
}

export async function updateBranch(branchId: string, data: Partial<Branch>): Promise<Branch> {
  return apiPut<Branch>(`/api/branches/${branchId}`, data);
}

export async function deleteBranch(branchId: string): Promise<void> {
  return apiDelete(`/api/branches/${branchId}`);
}

// ============ TEAMS ============

export interface Team {
  id: string;
  utility_id: string;
  dma_id: string;
  branch_id: string;
  name: string;
  code: string;
  team_leader_id?: string;
  members?: string[];
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getTeams(filters?: any): Promise<Team[]> {
  return apiGet<Team[]>('/api/teams', { params: filters });
}

export async function getTeam(teamId: string): Promise<Team> {
  return apiGet<Team>(`/api/teams/${teamId}`);
}

export async function createTeam(data: Omit<Team, 'id' | 'created_at' | 'updated_at'>): Promise<Team> {
  return apiPost<Team>('/api/teams', data);
}

export async function updateTeam(teamId: string, data: Partial<Team>): Promise<Team> {
  return apiPut<Team>(`/api/teams/${teamId}`, data);
}

export async function deleteTeam(teamId: string): Promise<void> {
  return apiDelete(`/api/teams/${teamId}`);
}

// ============ ENGINEERS ============

export interface Engineer {
  id: string;
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  team_id?: string;
  utility_id: string;
  dma_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getEngineers(filters?: any): Promise<Engineer[]> {
  return apiGet<Engineer[]>('/api/engineers', { params: filters });
}

export async function getEngineer(engineerId: string): Promise<Engineer> {
  return apiGet<Engineer>(`/api/engineers/${engineerId}`);
}

export async function createEngineer(data: Omit<Engineer, 'id' | 'created_at' | 'updated_at'>): Promise<Engineer> {
  return apiPost<Engineer>('/api/engineers', data);
}

export async function updateEngineer(engineerId: string, data: Partial<Engineer>): Promise<Engineer> {
  return apiPut<Engineer>(`/api/engineers/${engineerId}`, data);
}

export async function deleteEngineer(engineerId: string): Promise<void> {
  return apiDelete(`/api/engineers/${engineerId}`);
}

// ============ USERS ============

export interface User {
  id: string;
  email: string;
  name: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
  role: string;
  utility_id?: string;
  dma_id?: string;
  branch_id?: string;
  team_id?: string;
  is_approved?: boolean;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export async function getUsers(filters?: any): Promise<User[]> {
  return apiGet<User[]>('/api/users', { params: filters });
}

export async function getUser(userId: string): Promise<User> {
  return apiGet<User>(`/api/users/${userId}`);
}

export async function updateUser(userId: string, data: Partial<User>): Promise<User> {
  return apiPut<User>(`/api/users/${userId}`, data);
}

export async function deleteUser(userId: string): Promise<void> {
  return apiDelete(`/api/users/${userId}`);
}
