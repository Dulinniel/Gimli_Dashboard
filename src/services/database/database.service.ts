import { Types, connect, Model } from "mongoose";

import chalk from "chalk";

type DatabaseModel = Model<any>

export class DatabaseService {

  /*
  * @name: openDatabase
  * @description: Connect to the database    
  * @return: Promise<void>
  * @params: 
    -> Mongo_URI: string - The connection string of the database
  */
  public async openDatabase(Mongo_URI: string): Promise<void>
  {
    // Connect to the database, then keep a console trace
    await connect(Mongo_URI).then(() => console.log(chalk.greenBright(`* [${chalk.bold("Connection")}] Database is ready`)));
  }

  /*
  * @name: GetInfo
  * @description: Select one element matching a query    
  * @return: Promise<null | any>
  * @params: 
    -> Schema: DatabaseModel - The model to check in the database
    -> payload: Object - The query to search the database with
  */
  public async GetInfo(Schema: DatabaseModel, payload: {}): Promise<null | any>
  {
    // Get one result matching the payload
    const data: any = await Schema.findOne(payload);
    // If it return it
    if ( data ) return data;
    // If not, it's null
    else return null;
  }

  /*
  * @name: GetEvery
  * @description: Select all element matching a query    
  * @return: Promise<null | Array<any>>
  * @params: 
    -> Schema: DatabaseModel - The model to check in the database
    -> payload: Object - The query to search the database with
  */
  public async GetEvery(Schema: DatabaseModel, payload?: {}): Promise<null | Array<any>>
  {
    // Should not be needed, but in case I need to select every documents of a Model 
    const predicate = payload ? payload : {}; 
    // Get every results matching the payload
    const data: any = await Schema.find(predicate);
    // If there is a result return it
    if ( data ) return data;
    // If not, it's null
    else return null;
  }

  /*
  * @name: UpdateInfo
  * @description: Update element in the database    
  * @return: Promise<any>
  * @params: 
    -> Schema: DatabaseModel - The model to check in the database
    -> settings: Object - The updated data
    -> payload: Object - The query to search in the database
  */
  public async UpdateInfo(Schema: DatabaseModel, settings: {}, payload: {}): Promise<any>
  {
    // Get the element to update
    let data: any = await this.GetInfo(Schema, payload);
    for ( const key in settings )
    {
      // Update the keys to avoid errors
      if (data[key] !== settings[key]) data[key] = settings[key];
    }
    // Update the database
    await data.updateOne(settings);
  }

  /*
  * @name: CreateInfo
  * @description: Insert element in the database    
  * @return: Promise<any>
  * @params: 
    -> Schema: DatabaseModel - The model to check in the database
    -> payload: Object - The creation query to feed the database with
  */
  public async CreateInfo(Schema: DatabaseModel, payload: {}): Promise<any>
  {
    // instantiate a result that will contain the saved data
    let result: any;
    // Assign a Mongodb id to the creation query
    const merged = await Object.assign({ _id: new Types.ObjectId() }, payload);
    // Create a new Schema with the new creation query
    const create = await new Schema(merged);
    // Save it to the database and apply output data to result
    await create.save().then((data: any) => result = data);
    // return result
    return result;
  }

  /*
  * @name: RemoveInfo
  * @description: Remove elements from database    
  * @return: Promise<void>
  * @params: 
    -> Schema: DatabaseModel - The model to check in the database
    -> payload: Object - The Search query to feed to the database
  */
  public async RemoveInfo(Schema: DatabaseModel, payload: {}) : Promise<void>
  {
    // Search if the data exists
    const data = await this.GetInfo(Schema, payload);
    if ( data )
    {
      // If it exists, delete it
      await data.deleteOne();
    }
  }
}
