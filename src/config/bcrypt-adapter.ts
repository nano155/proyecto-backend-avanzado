import {compareSync, genSaltSync, hashSync} from 'bcrypt'

export class  BcryptAdapter{
    

    static  hash(password:string){
        const salt = genSaltSync()
        return hashSync(password, salt)
    }

    static  compare(password:string, hashed:string){
        const compare = compareSync(password, hashed)
        return compare
    }
}