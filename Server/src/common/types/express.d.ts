import type { JwtPayload } from 'jsonwebtoken';

declare global {
  interface UserDecode extends JwtPayload {
    _id: string;
    isAdmin: boolean;
  }
  namespace Express {
    interface Request {
      user?: UserDecode | JwtPayload;
    }
  }
}
