import jwt, { SignOptions } from "jsonwebtoken";
import config from "../../../environments.config";

export class JwtService 
{
  private secret: string;
  private expiresIn: string;

  constructor() 
  {
    this.secret = config.JWT_SECRET as string;
    this.expiresIn = "1h";
  }

  generateToken(payload: object): string 
  {
    const options: SignOptions = { expiresIn: this.expiresIn };
    return jwt.sign(payload, this.secret, options);
  }

  verifyToken(token: string): object | null 
  {
    try 
    {
      return jwt.verify(token, this.secret);
    } catch (err) 
    {
      return null;
    }
  }
}
