import { regularExps } from "../../../config";

export class LoginUserDto {
  public email: string;
  public password: string;
  private constructor(email: string, password: string) {
    (this.email = email), (this.password = password);
  }

  static create(object: { [key: string]: any }): [string?, LoginUserDto?] {
    const { email, password } = object;

    if (!email) return ["email is required"];
    if (!regularExps.email.test(email)) return ["email is not valid"];
    if (!password) return ["password is required"];
    if (password.length <= 5) return ["password is too short"];

    return [undefined, new LoginUserDto(email, password)];
  }
}
