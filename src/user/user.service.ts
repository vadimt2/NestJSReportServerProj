import { Payload } from './../auth/payload';
import { IUser } from '../user/interfaces/user.interface';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import * as bcrypt from 'bcrypt'
import { UserDTO } from './dto/user.dto';

@Injectable()
export class UserService {
  constructor(@InjectModel('Employee') private readonly userModel: Model<IUser>) { }


  private sanitizeUser(user: IUser) {
    return user.depopulate('password');
  }


  async login(userDTO: UserDTO): Promise<IUser> {
    const { email, password } = userDTO;

    const user = await this.userModel
      .findOne({ email })
      .select('_id email password verifiedEmail employeeRole firstName lastName phone');
    if (!user) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    if (!user.verifiedEmail){
      
      throw new HttpException('Email not verified', HttpStatus.UNAUTHORIZED);
    }
    if (await bcrypt.compare(password, user.password)) {
      return this.sanitizeUser(user);

    } else {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }
  }

  async findByEmail(email: string): Promise<IUser> {
    return await this.userModel.findOne({ email: email }).exec();
  }



  async create(userDTO: UserDTO) {
    const { email } = userDTO

    const user = await this.userModel.findOne({ email });
    if (user) {
      throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);
    }

    const createdUser = new this.userModel(userDTO);
    createdUser.verifiedEmail = false;
    await createdUser.save();
    return this.sanitizeUser(createdUser);
  }

  async findByPayLoad(payload: Payload) {
    const { email } = payload;
    return await this.userModel.findOne({ email });
  }

  async setPassword(email: string, password: string): Promise<boolean> {
    if(!email || !password) throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    var user = await this.userModel.findOne({ email: email });
    if (!user) throw new HttpException('LOGIN.USER_NOT_FOUND', HttpStatus.NOT_FOUND);

    user.password = password;

    await user.save();
    
    return true;
  }

  validateEmail(email: string): boolean {
    const expression = /(?!.*\.{2})^([a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+(\.[a-z\d!#$%&'*+\-\/=?^_`{|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+)*|"((([\t]*\r\n)?[\t]+)?([\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*(([\t]*\r\n)?[\t]+)?")@(([a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\d\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.)+([a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF][a-z\d\-._~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]*[a-z\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])\.?$/i;

    return expression.test(String(email).toLowerCase())
  }

  async verifyEmail(id: string){
    const verifiedEmail = await this.userModel.findOne({_id:id})
    if (!verifiedEmail)
      return new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);

    if (verifiedEmail.verifiedEmail)
      return true;

    verifiedEmail.verifiedEmail = true;
    await verifiedEmail.save();
    return true;
  }

  async forgotPassword(userDTO: UserDTO){
       const {email} = userDTO;
       let user = await this.userModel.findOne({ email }).select("email").exec();
       if(!user)
       throw new HttpException('Invalid credentials', HttpStatus.NOT_FOUND);
       
       
  }

}
