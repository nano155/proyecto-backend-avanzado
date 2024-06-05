import { Validators } from "../../../config"





export class CreateTicket {
  private constructor(
    public readonly code: string,
    public readonly purchase_datetime: Date,
    public readonly amount: number,
    public readonly purchaser: string
  ) {}

 
  static create(ticket:{[key:string]:any}):[string?, CreateTicket?] {

    try {
        Validators.validatorTicketDataType(ticket)
        const { code, amount, purchase_datetime, purchaser} = ticket
        
        return [undefined ,new CreateTicket( code, purchase_datetime, amount, purchaser)]
    } catch (error) {
        if(error instanceof Error){
            return[error.message, undefined]
        }else{
            return ['Error unknow', undefined]
          } 
    }
  }
}