"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PaginationDto = void 0;
class PaginationDto {
    constructor(limit, page, sort) {
        this.limit = limit;
        this.page = page;
        this.sort = sort;
    }
    static create(page = 1, limit = 10, sort) {
        if (isNaN(page) || isNaN(limit))
            return ['Page and limit must be a number', undefined];
        if (page <= 0)
            return ['Page must be greater than 0', undefined];
        if (limit <= 0)
            return ['limit must be greater than 0', undefined];
        return [undefined, new PaginationDto(limit, page, sort)];
    }
}
exports.PaginationDto = PaginationDto;
//# sourceMappingURL=pagination.dto.js.map