import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsuarioService } from 'src/usuario/usuario.service';
import { LoginDto } from './dto/login.dto';
import { CreateUsuarioDto } from 'src/usuario/dto/create-usuario.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly usuarioService: UsuarioService,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto) {
    const user = await this.usuarioService.findByEmail(loginDto.email);

    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const roles = user.rolUsuarios.map((ru) => ru.rol.rol);

    const payload = {
      sub: user.id_usuario,
      email: user.email,
      roles,
    };

    return {
      access_token: this.jwtService.sign(payload),
      usuario: user,
    };
  }

  async register(createUserDto: CreateUsuarioDto) {
  // 👇 Encriptar la contraseña antes de guardar
  const salt = await bcrypt.genSalt(10);
  createUserDto.password = await bcrypt.hash(createUserDto.password, salt);

  const response = await this.usuarioService.create(createUserDto);
  const user = response.data;

  const roles = user.rolUsuarios?.map((ru) => ru.rol.rol) || [];

  const payload = {
    sub: user.id_usuario,
    email: user.email,
    roles,
  };

  return {
    access_token: this.jwtService.sign(payload),
    usuario: user,
  };
}
}