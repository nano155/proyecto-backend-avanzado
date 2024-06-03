


export class PaginationDto{

    private constructor(
        public readonly limit:number,
        public readonly page:number,
        public readonly sort: any,
    ){}

    static create(page = 1, limit = 10, sort : any):[string?, PaginationDto?]{
        
        if(isNaN(page) || isNaN(limit)) return ['Page and limit must be a number', undefined]

        if(page <= 0) return ['Page must be greater than 0', undefined]
        if(limit <= 0) return ['limit must be greater than 0', undefined]

        return [undefined, new PaginationDto(limit, page, sort)]
    }
}