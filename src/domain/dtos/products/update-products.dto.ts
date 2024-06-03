import { Validators } from "../../../config";
import { Category, ProductEntity } from "../../entity";



export class UpdateProductDto {
  private constructor(
    public readonly title?: string,
    public readonly description?: string,
    public readonly code?: string,
    public readonly price?: number,
    public readonly status?: boolean,
    public readonly stock?: number,
    public readonly category?: Category,
    public readonly thumbnails?: [] 
  ) {}

  static create(productDto: ProductEntity): [string?, UpdateProductDto?] {
   try {
    Validators.validatorUpdateProductDataType(productDto)
    const {
      title,
      description,
      code,
      price,
      status,
      stock,
      category,
      thumbnails,
    } = productDto;
    
    return [
      undefined,
      new UpdateProductDto(
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        thumbnails
      ),
    ];
   } catch (error) {
    if(error instanceof Error){
      return [error.message, undefined]
    }
    return ['Unknow Error']
   }
  }
}