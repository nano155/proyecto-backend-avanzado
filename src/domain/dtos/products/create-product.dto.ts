import { Validators } from "../../../config";
import { Category } from "../../entity";



export class CreateProductDto {
  private constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly code: string,
    public readonly price: number,
    public readonly status: boolean,
    public readonly stock: number,
    public readonly category: Category,
    public readonly owner: string,
    public readonly thumbnails: [] = []
  ) {}

  static create(productDto: {
    [key: string]: any;
  }): [string?, CreateProductDto?] {
    try {
      Validators.validatorProductDataType(productDto)

      const {
        title,
        description,
        code,
        price,
        status,
        stock,
        category,
        owner,
        thumbnails,
      } = productDto;

      return [
        undefined,
        new CreateProductDto(
          title,
          description,
          code,
          price,
          status,
          stock,
          category,
          owner,
          thumbnails
        ),
      ];
    } catch (error) {
      if(error instanceof(Error)){
        return [error.message, undefined]
      }
    else{
      return ['Error unknow', undefined]
    }
    }
  }
}