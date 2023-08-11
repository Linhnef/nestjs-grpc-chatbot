/* eslint-disable prettier/prettier */
import { Controller } from '@nestjs/common';
import { GrpcMethod } from '@nestjs/microservices';
import { CreateUserDto } from './dto/create-user.dto';

@Controller()
export class AuthService {
  @GrpcMethod()
  createUser() {
    return { status: 200 };
  }

  @GrpcMethod()
  getAllUser(params: CreateUserDto) {
    console.log(params)
    return { users: [{ email: "begin270519@gmail.com", password: "123445" }] }
  }
}
