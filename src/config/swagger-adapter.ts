import swaggerJsDoc  from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

export interface SwaggerOptions {
    definition:{
        openapi:string,
        info:{
            title:string,
            description:string,
            version:string
        }
    },
    apis:string[]
}

export class  SwaggerAdapter{


    static create (swaggerOptions:SwaggerOptions) {
        const specs = swaggerJsDoc(swaggerOptions)

        return{
            swaggerUiServe: swaggerUiExpress.serve,
            swaggerUiSetup: swaggerUiExpress.setup(specs)
        }

    }
}