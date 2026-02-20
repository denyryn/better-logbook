export interface User {
  id: string;
  name: string;
  email: string;
  image: string;
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
