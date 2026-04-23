// Utility functions for managing user profile data in localStorage

const STORAGE_KEY = "recipenest_user_profiles";

export interface UserProfile {
  userId: string;
  bio: string;
  joinedDate: string;
}

export function getUserProfile(userId: string): UserProfile | null {
  try {
    const profiles = localStorage.getItem(STORAGE_KEY);
    const allProfiles: UserProfile[] = profiles ? JSON.parse(profiles) : [];
    return allProfiles.find((p) => p.userId === userId) || null;
  } catch (error) {
    console.error("Error reading user profile:", error);
    return null;
  }
}

export function updateUserProfile(userId: string, bio: string): boolean {
  try {
    const profiles = localStorage.getItem(STORAGE_KEY);
    let allProfiles: UserProfile[] = profiles ? JSON.parse(profiles) : [];

    const existingIndex = allProfiles.findIndex((p) => p.userId === userId);

    if (existingIndex >= 0) {
      allProfiles[existingIndex].bio = bio;
    } else {
      allProfiles.push({
        userId,
        bio,
        joinedDate: new Date().toISOString(),
      });
    }

    localStorage.setItem(STORAGE_KEY, JSON.stringify(allProfiles));
    return true;
  } catch (error) {
    console.error("Error updating user profile:", error);
    return false;
  }
}
