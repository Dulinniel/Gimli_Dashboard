import { Request } from "express";
import { JwtPayload } from "../jwt/JWT";

export interface AuthenticatedRequest extends Request 
{
  user?: JwtPayload;
}
