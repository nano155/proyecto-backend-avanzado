import mongoose from "mongoose";

type Options = {
  mongo_url:string,
  dbName:string
}

export class MongoConnect {
  static instance: any;

  private constructor(){
  }

    static async start(options:Options) {
    if (!!MongoConnect.instance) {
      console.log('ya existe una instancia.');
      
      return MongoConnect.instance;
    }
    try {
      await mongoose.connect(options.mongo_url, {
        dbName:options.dbName
      });
      console.log("Conectado a mongoDB");
     
      MongoConnect.instance = new MongoConnect()
     
      return MongoConnect.instance   
    } catch (error) {
      console.log(error);  
      throw new Error('internal error')      
    }
  }
}
