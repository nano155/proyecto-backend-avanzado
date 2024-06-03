export enum Role {
  user = "admin",
  admin = "admin",
}

export class UserEntity {
  public first_name: string;
  public last_name: string;
  public email: string;
  public cart: string;
  public role: Role;
  private constructor(
    first_name: string,
    last_name: string,
    email: string,
    cart: string,
    role: Role
  ) {
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.cart = cart;
    this.role = role;
  }

  static fromObject (object:{[key:string]:any}):UserEntity{
    const {first_name, last_name, email, cart, role} = object

    return new UserEntity(first_name, last_name, email, cart, role)
  }
}
