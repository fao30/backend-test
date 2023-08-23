import { Module, forwardRef } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersController } from './users/users.controller';
import { UsersModule } from './users/users.module';
import { MongooseModule } from '@nestjs/mongoose';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { AuthService } from './auth/auth.service';
import { NotesModule } from './notes/notes.module';
import { AuthModule } from './auth/auth.module';
import { AuthController } from './auth/auth.controller';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot(),
    forwardRef(() => AuthModule), // Use forwardRef() for AuthModule
    MongooseModule.forRoot(process.env.DATABASE_URL),
    PassportModule,
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1h' },
    }),
    UsersModule,
    NotesModule,
    AuthModule,
  ],
  controllers: [AppController, UsersController, AuthController],
  providers: [
    AppService,
    // UsersService,
    AuthService,
    // LocalStrategy,
    // JwtStrategy,
  ],
})
export class AppModule {}
