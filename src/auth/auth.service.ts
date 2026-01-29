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

    // 1. Validar credenciales
    if (!user || !(await bcrypt.compare(loginDto.password, user.password))) {
      throw new UnauthorizedException('Credenciales inválidas');
    }

    const roles = user.rolUsuarios.map((ru) => ru.rol.rol);

    const payload = {
      sub: user.id_usuario,
      email: user.email,
      roles,
    };

    // 2. ✅ Limpiamos el objeto para evitar errores en el Front y proteger el hash
    const { password, ...usuarioSinPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      usuario: usuarioSinPassword, 
    };
  }

  async register(createUserDto: CreateUsuarioDto) {
    // ✅ Quitamos el bcrypt.hash de aquí, ya que viene encriptado del DTO/Pipe
    const response = await this.usuarioService.create(createUserDto);
    const user = response.data;

    const roles = user.rolUsuarios?.map((ru) => ru.rol.rol) || [];

    const payload = {
      sub: user.id_usuario,
      email: user.email,
      roles,
    };

    // 3. ✅ Limpieza de seguridad para el registro
    const { password, ...usuarioSinPassword } = user;

    return {
      access_token: this.jwtService.sign(payload),
      usuario: usuarioSinPassword,
    };
  }
}