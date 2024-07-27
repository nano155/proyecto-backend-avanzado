

export class TicketEntity{
    public id: string;
    public code:string;
    public purchase_datetime:Date;
    public amount: number;
    public purchaser: string
    private constructor(id:string, code:string, purchase_datetime:Date, amount:number, purchaser:string){
        this.id = id
        this.code = code
        this.purchase_datetime = purchase_datetime
        this.amount= amount
        this.purchaser = purchaser

    }


    static fromObject = (ticket:{[key:string]:any}):TicketEntity =>{
        const {id, code, purchase_datetime, amount, purchaser} = ticket

        return new TicketEntity(id, code, purchase_datetime, amount, purchaser)
    }
}