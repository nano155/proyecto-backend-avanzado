import { Validators } from "../../../config";
import { Category, ProductEntity } from "../../entity";



export class UpdateProductDto {
  private constructor(
    public readonly titleUpdate?: string,
    public readonly descriptionUpdate?: string,
    public readonly codeUpdate?: string,
    public readonly priceUpdate?: number,
    public readonly statusUpdate?: boolean,
    public readonly stockUpdate?: number,
    public readonly categoryUpdate?: Category,
    public readonly thumbnailsUpdate?: [],
    public readonly deletedFile?: string[],
  ) {}

  static create(productDto:{[key:string]:any}): [string?, UpdateProductDto?] {
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
      deletedFile
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
        thumbnails,
        deletedFile
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