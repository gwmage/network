```typescript
# 회원가입 API

```javascript
import { Controller, Post, Body, Res, HttpStatus } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly usersService: UsersService) {}

  @Post('signup')
  async signup(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    const { email, password, name, contact } = createUserDto;

    // 입력값 유효성 검사 (정규식 활용) - 예시
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(HttpStatus.BAD_REQUEST).json({ message: 'Invalid email format' });
    }

    // 중복 이메일 방지
    const existingUser = await this.usersService.findOne({ email });
    if (existingUser) {
      return res.status(HttpStatus.CONFLICT).json({ message: 'Email already exists' });
    }

    // 비밀번호 암호화
    const hashedPassword = await bcrypt.hash(password, 10);

    try {
      const createdUser = await this.usersService.create({
        email,
        password: hashedPassword,
        name,
        contact,
      });
      return res.redirect('/login'); // 가입 완료 후 로그인 페이지 리디렉션
    } catch (error) {
      return res.status(HttpStatus.INTERNAL_SERVER_ERROR).json({ message: 'Failed to create user' });
    }


  }
}
```