import express, { Router } from 'express'

interface Options {

    port:number,
    public_path:string,
    routes:Router
}
export class Server{
    public readonly app = express()
    public readonly port;
    public readonly routes;
    public readonly public_path;


    
    constructor(options:Options){
       this.port = options.port;
       this.public_path = options.public_path;
       this.routes = options.routes;
    }




    start(){

        this.app.use(this.routes)

        this.app.listen(this.port, ()=>{
            console.log(`Listen to port: ${this.port}`)       
        })
            
    }
}