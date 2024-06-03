import { envs } from "./config/envs";
import { AppRoutes } from "./presentation/routes";
import { Server } from "./presentation/server";
import { MongoConnect } from "./service/dao/mongo/mongo-connect";



(()=>{

    main()

})()


async function main(){
    const server = new Server({
        port:envs.PORT,
        public_path:'public', 
        routes:AppRoutes.routes
    }) 
    
    try {
        await MongoConnect.start({mongo_url:envs.MONGO_URL, dbName:envs.DB_NAME}); // Primera llamada
      } catch (error) {
        console.error('Error al conectar a MongoDB', error);
        return; 
      }
    

    server.start()
    
}