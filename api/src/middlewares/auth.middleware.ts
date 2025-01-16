import { Request, Response, NextFunction } from "express";
import { JwtService } from "../services/jwt/jwt.service";
import { AuthenticatedRequest } from "../interfaces/express/Request";

const jwtService = new JwtService();

export function authMiddleware(request: AuthenticatedRequest, response: Response, next: NextFunction) 
{
  const token: string = request.headers.cookie?.split("=")[1] as string;

  if ( !token ) 
  {
    response.status(401).send({ error: "Unauthorized" });
    return;
  }

  const payload = jwtService.verifyToken(token);

  if ( !payload ) 
  {
    response.status(401).send({ error: "Invalid or expired token" });
    return;
  }

  request.user = payload;
  next();
}
