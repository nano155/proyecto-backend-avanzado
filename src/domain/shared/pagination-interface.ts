import { ProductEntity } from "../entity";


export interface PaginatedData{
    page: number | null;
    limit: number;
    total: number;
    totalPages: number;
    prev: string | null;
    next: string | null;
    products: Promise<ProductEntity[]>;
  }