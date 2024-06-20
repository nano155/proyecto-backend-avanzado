export enum Role {
  user = "user",
  admin = "admin",
  premium = "premium"
}

export class UserEntity {
  public id: string;
  public first_name: string;
  public last_name: string;
  public email: string;
  public validateEmail: boolean;
  public cart: string;
  public role: Role;
  private constructor(
    id: string,
    first_name: string,
    last_name: string,
    email: string,
    validateEmail: boolean,
    cart: string,
    role: Role
  ) {
    this.id = id;
    this.first_name = first_name;
    this.last_name = last_name;
    this.email = email;
    this.validateEmail = validateEmail;
    this.cart = cart;
    this.role = role;
  }

  static fromObject (object:{[key:string]:any}):UserEntity{
    console.log(object);
    
    const {id, first_name, last_name, email, validateEmail, cart, role} = object

    return new UserEntity(id, first_name, last_name, email, validateEmail, cart, role)
  }
}
