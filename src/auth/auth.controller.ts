import { Controller, Get, Post, Request, UseGuards } from "@nestjs/common";
import { AuthService } from "./auth.service";
import { JwtAuthGuard } from "src/auth/jwt-auth.guard";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  @UseGuards(JwtAuthGuard)
  @Get("getme")
  async getMe(@Request() req: any): Promise<string> {
    return req.user;
  }

  @Post("login")
  async login(@Request() req: any) {
    return this.authService.login(req.body.username, req.body.password);
  }
}
