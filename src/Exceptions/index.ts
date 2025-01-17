import { APIException } from "../interfaces/Exceptions";

class Exception implements APIException
{
  constructor(readonly error: any, readonly status: number) {}
}

export class NotFoundException extends Exception
{
  constructor(error: any)
  {
    super(error, 404);
  }
}