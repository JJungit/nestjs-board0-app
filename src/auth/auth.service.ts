import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserRepository } from './user.repository';
import { AuthCredentialsDto } from './dto/auth-credential.dto';
import { User } from './user.entity';
import { Auth } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
   constructor(
      // @InjectRepository(User)
      private userRepository: UserRepository,
      private jwtService: JwtService
   ) {}

   async signUp(authCredentialsDto: AuthCredentialsDto): Promise<void>{
      return this.userRepository.createUser(authCredentialsDto);
   }

   async signIn(authCredentialsDto: AuthCredentialsDto): Promise<{accessToken: string}>{
      const { username, password } = authCredentialsDto;
      const user = await this.userRepository.findOneBy({ username });

      if(user && (await bcrypt.compare(password, user.password))){
         // 유저 토큰 생성 ( Secret + Payload )
         const Payload = { username };
         const accessToken = await this.jwtService.sign(Payload);
         
         return { accessToken };
      } else{
         throw new UnauthorizedException('login falied');
      }
   }

}
