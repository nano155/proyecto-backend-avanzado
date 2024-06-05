import express, { Router } from 'express'
import cors from 'cookie-parser'
import cookieParser  from 'cookie-parser'

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

        this.app.use(express.json())
        this.app.use(cookieParser())
        this.app.use(express.urlencoded({extended:true}))
        this.app.use(cookieParser())

        this.app.use(express.static(this.public_path))
        // this.app.use(cors())

        this.app.use(this.routes)

        this.app.listen(this.port, ()=>{
            console.log(`Listen to port: ${this.port}`)       
        })
            
    }
}