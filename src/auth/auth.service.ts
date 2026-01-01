import { Injectable, UnauthorizedException, Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectEntityManager } from '@nestjs/typeorm';
import { EntityManager, Equal } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity'; // ✅ Entity Import
import { SignInDto } from './dto/sign-in.dto';

@Injectable()
export class AuthService {
  private readonly _logger = new Logger(AuthService.name);

  constructor(
    @InjectEntityManager() private readonly _entityManager: EntityManager, // ✅ Direct DB Access
    private readonly _jwtService: JwtService,
  ) {}

  async signIn(signInDto: SignInDto): Promise<{ access_token: string }> {
    const { email, password } = signInDto;

    this._logger.log(`Login attempt for: ${email}`);

    // 1. Get User with Password (Raw Entity)
    const user = await this._entityManager.findOne(User, {
      where: { email: Equal(email) },
    });

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 2. Compare Password
    // Note: DB column name 'password_hash' hai
    const isMatch = await bcrypt.compare(password, user.password_hash);

    if (!isMatch) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // 3. Generate Token
    const payload = { sub: user.user_id, email: user.email, role: user.role };

    return {
      access_token: await this._jwtService.signAsync(payload),
    };
  }

  signOut() {
    return { message: 'Sign out successful' };
  }
}
