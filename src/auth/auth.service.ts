import { Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async comparePasswords(
    textPassword: string,
    hashedPass: string,
  ): Promise<boolean> {
    return await bcrypt.compare(textPassword, hashedPass);
  }

  async validateUser(username: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === password) {
      const { password: passwordExclude, ...result } = user;
      console.log(passwordExclude);
      return result;
    }
    return null;
  }

  async validateUserById(userId: string): Promise<any> {
    const user = await this.usersService.findById(userId);
    if (user) {
      const { password: passwordExclude, ...result } = user;
      console.log(passwordExclude);
      return result;
    }
    return null;
  }

  async login(username: string, password: string) {
    const user = await this.usersService.findOne(username);

    if (user && (await this.comparePasswords(password, user.password))) {
      const payload = { sub: username };
      return {
        access_token: this.jwtService.sign(payload),
      };
    }
    return null;
  }
}
