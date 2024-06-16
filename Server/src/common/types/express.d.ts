import type { JwtPayload } from 'jsonwebtoken';

declare global {
  interface IUserDecode extends JwtPayload {
    _id: string;
    isAdmin: boolean;
  }
  namespace Express {
    interface Request {
      user?: IUserDecode | JwtPayload;
    }
  }
}
