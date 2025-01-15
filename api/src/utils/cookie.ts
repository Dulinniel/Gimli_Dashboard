import { Request, Response } from "express";

export function getCookies( req: Request, res: Response ): object | string {
  const { headers: { cookie } } = req;
  if ( !cookie ) return ""; 
  
  const values = cookie.split(";").reduce(( res, item ) => 
  {
    const data = item.trim().split("=");
    return {...res, [ data[0] ] : data[1]};
  }, {});
  return values;
}
