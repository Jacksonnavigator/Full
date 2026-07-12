export type UserRole = 'Administrator' | 'Engineer' | 'TeamLeader';

export interface User {
  id: string;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phoneNumber?: string;
  role: UserRole;
  utilityId?: string;
  dmaId?: string;
  dmaName?: string;
  dma_name?: string;
  teamId?: string;
  teamName?: string;
  team_name?: string;
  isApproved: boolean;
  createdAt: string;
  updatedAt: string;
  profilePhotoUrl?: string;
}
