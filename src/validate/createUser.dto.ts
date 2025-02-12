import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
  IsEnum,
  MaxLength,
  Matches,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsString({ message: 'Tên phải là chuỗi' })
  @MinLength(3, { message: 'Tên phải có ít nhất 3 ký tự' })
  @MaxLength(30, { message: 'Tên không được dài quá 50 ký tự' })
  @Matches(/^[A-Za-zÀ-ỹ\s]+$/, {
    message: 'Tên không được chứa số hoặc ký tự đặc biệt',
  })
  name: string;

  @IsEmail({}, { message: 'Email không hợp lệdsd' })
  @IsNotEmpty({ message: 'Email không được để trống' })
  email: string;

  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  @IsNotEmpty({ message: 'Mật khẩu không được để trống' })
  password: string;

  @IsEnum(['student', 'instructor'], {
    message: 'Role phải là student hoặc instructor',
  })
  @IsNotEmpty({ message: 'Role không được để trống' })
  role: 'student' | 'instructor';
}
