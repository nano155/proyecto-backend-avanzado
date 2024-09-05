"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TicketEntity = void 0;
class TicketEntity {
    constructor(id, code, purchase_datetime, amount, purchaser) {
        this.id = id;
        this.code = code;
        this.purchase_datetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
    }
}
exports.TicketEntity = TicketEntity;
TicketEntity.fromObject = (ticket) => {
    const { id, code, purchase_datetime, amount, purchaser } = ticket;
    return new TicketEntity(id, code, purchase_datetime, amount, purchaser);
};
//# sourceMappingURL=ticket.entity.js.map