import { UserPagesServiceInterface, OperationResult } from "@/utils/interfaces/pages.interface";
import { userService } from "@/utils/services/core/user.service";

/**
 * Service d'orchestration pour les pages utilisateur (UI)
 * Toute la logique métier doit passer par userService.
 */
class UserPagesService implements UserPagesServiceInterface {
  async getUserProfile(id?: number): Promise<OperationResult<{ user: any; details: any; preferences: any }>> {
    return userService.getUserProfile(id);
  }
  
  async updateUserProfile(id: number, data: any): Promise<OperationResult<any>> {
    return userService.updateUserProfile(id, data);
  }
  
  async updateUserPreferences(id: number, preferences: any): Promise<OperationResult<any>> {
    return userService.updateUserPreferences(id, preferences);
  }
  
  /**
   * Met à jour spécifiquement les données de profil utilisateur
   */
  async updateUserProfileData(id: number, profileData: {
    name: string;
    email: string;
    profileImage?: string;
    updatedAt: string;
  }): Promise<OperationResult<any>> {
    return userService.updateUserProfileData(id, profileData);
  }
}

export const userPagesService = new UserPagesService();
