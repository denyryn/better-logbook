export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null | undefined;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserSignUp {
  name: string;
  email: string;
  password: string;
}

export interface UserLogin {
  email: string;
  password: string;
}
