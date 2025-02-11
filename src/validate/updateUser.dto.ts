import {
  IsEmail,
  IsOptional,
  IsString,
  MinLength,
  IsIn,
  IsEnum,
  MaxLength,
  Matches,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsString({ message: 'Tên phải là chuỗi' })
  @MinLength(3, { message: 'Tên phải có ít nhất 3 ký tự' })
  @MaxLength(30, { message: 'Tên không được dài quá 50 ký tự' })
  @Matches(/^[A-Za-zÀ-ỹ\s]+$/, {
    message: 'Tên không được chứa số hoặc ký tự đặc biệt',
  })
  name?: string;

  @IsOptional()
  @IsEmail({}, { message: 'Email không hợp lệ' })
  email?: string;

  @IsOptional()
  @IsString({ message: 'Mật khẩu phải là chuỗi' })
  @MinLength(6, { message: 'Mật khẩu phải có ít nhất 6 ký tự' })
  password?: string;

  @IsOptional()
  @IsEnum(['student', 'instructor'], {
    message: 'Role phải là student hoặc instructor',
  })
  role?: 'student' | 'instructor';
}
