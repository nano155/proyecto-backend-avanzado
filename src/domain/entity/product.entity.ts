export enum Category {
    computadoras = "computadoras",
    telefonos = "telefonos",
    televisores = "televisores",
    accesorios = "accesorios",
    electrodomésticos = "electrodomésticos",
  }
  
  
  export class  ProductEntity {
    public id : string;
    public title: string;
    public description: string;
    public code: string;
    public price: number;
    public status: boolean;
    public stock: number;
    public category: Category;
    public owner: string;
    public thumbnails?: [];
  
    private constructor(id: string, title: string, description: string, code:string, price: number, status:boolean, stock: number, category: Category, owner:string, thumbnails?:[]  ){
      this.id = id
      this.category = category;
      this.title = title;
      this.description = description;
      this.code = code;
      this.price = price;
      this.status = status;
      this.owner = owner;
      this.stock = stock;
      this.thumbnails = thumbnails?thumbnails:[];
    }
  
    static fromObject (obj: {[key:string]:any}):ProductEntity{
  
      const {id, title, description, code, price, status, stock, category,owner, thumbnails} = obj
        
        return new ProductEntity(id, title, description, code, price, status, stock, category, owner, thumbnails)
    }
  }