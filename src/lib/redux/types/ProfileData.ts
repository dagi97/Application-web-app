export interface ProfileData {
  id: string;
  data: {
      full_name: string;
      email: string;
      role: string;
      profile_picture_url: string | null;
  }
}
