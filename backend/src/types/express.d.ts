export interface AuthenticatedAdmin {
  id: string;
  email: string;
  role: "owner" | "editor";
}

declare global {
  namespace Express {
    interface Request {
      admin?: AuthenticatedAdmin;
    }
  }
}
