import { Controller, Get, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get('profile')
  async profile(@Req() req: any) {
    // req.user.email comes from JwtStrategy.validate
    return this.usersService.findProfileByEmail(req.user.email);
  }
}