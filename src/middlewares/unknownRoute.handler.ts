import { NotFoundException } from '../Exceptions'

export const UnknownRoutesHandler = () => 
{
  throw new NotFoundException(`La resource demandée n'existe pas`)
}