"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateTicket = void 0;
const config_1 = require("../../../config");
class CreateTicket {
    constructor(code, purchase_datetime, amount, purchaser) {
        this.code = code;
        this.purchase_datetime = purchase_datetime;
        this.amount = amount;
        this.purchaser = purchaser;
    }
    static create(ticket) {
        try {
            config_1.Validators.validatorTicketDataType(ticket);
            const { code, amount, purchase_datetime, purchaser } = ticket;
            return [undefined, new CreateTicket(code, purchase_datetime, amount, purchaser)];
        }
        catch (error) {
            if (error instanceof Error) {
                return [error.message, undefined];
            }
            else {
                return ['Error unknow', undefined];
            }
        }
    }
}
exports.CreateTicket = CreateTicket;
//# sourceMappingURL=create-ticket.dto.js.map