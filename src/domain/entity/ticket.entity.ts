

export class TicketEntity{
    public code:string;
    public purchase_datetime:Date;
    public amount: number;
    public purchaser: string
    private constructor(code:string, purchase_datetime:Date, amount:number, purchaser:string){
        this.code = code
        this.purchase_datetime = purchase_datetime
        this.amount= amount
        this.purchaser = purchaser

    }


    static fromObject = (ticket:{[key:string]:any}):TicketEntity =>{
        const {code, purchase_datetime, amount, purchaser} = ticket

        return new TicketEntity(code, purchase_datetime, amount, purchaser)
    }
}