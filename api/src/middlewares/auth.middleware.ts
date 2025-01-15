import { Request, Response, NextFunction } from "express";
import { JwtService } from "~/services/jwt.service";

const jwtService = new JwtService();

export function authMiddleware(request: Request, response: Response, next: NextFunction) 
{
  const token: string = request.cookies.auth_token || request.headers.authorization?.split(" ")[1];

  if (!token) return response.status(401).send({ error: "Unauthorized" });

  const payload = jwtService.verifyToken(token);

  if (!payload) return response.status(401).send({ error: "Invalid or expired token" });

  request.user = payload;
  next();
}
