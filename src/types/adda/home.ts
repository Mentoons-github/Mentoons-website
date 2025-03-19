export interface UserStatusInterface {
  status: string;
  isWatched: boolean;
  userName: string;
  userProfilePic: string;
}

export interface RequestInterface {
  userName: string;
  accepted: boolean;
  profilePic: string;
}
