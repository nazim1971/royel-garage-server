export interface TLogin {
  email: string;
  password: string;
}

export type TSingleUser = {
  name?: string;
  email?: string;
  isBlocked?: boolean;
  role?: string
}