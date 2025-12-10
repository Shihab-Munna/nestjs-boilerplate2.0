import { Injectable, LogLevel } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ServerConfigService {
  constructor(private readonly configService: ConfigService) {}

  get env(): string {
    return this.configService.get<string>('env')!;
  }

  get serverPort(): number {
    return this.configService.get<number>('server.port')!;
  }

  get environment(): string {
    return this.configService.get<string>('env')!;
  }

  get deployEnv(): string {
    return this.configService.get<string>('deployEnv')!;
  }

  get baseUrls(): { dev: string; staging: string; production: string } {
    return this.configService.get<{ dev: string; staging: string; production: string }>(
      'baseUrls',
    )!;
  }

  get corsAllowedOrigins(): string[] {
    return this.configService.get<string[]>('server.corsAllowedOrigins')!;
  }

  get apiLogLevel(): LogLevel[] {
    return this.configService.get<LogLevel[]>('api.logLevel')!;
  }

  get apiVersion(): string {
    return this.configService.get<string>('api.defaultVersion')!;
  }

  get jwtSecret(): string {
    return this.configService.get<string>('jwt.secret')!;
  }

  get jwtExpiresIn(): string {
    return this.configService.get<string>('jwt.expiresIn')!;
  }

  // IMPORTANT: only return non-sensitive configs here
  printConfig() {
    return {
      serverPort: this.serverPort,
      apiLogLevel: this.apiLogLevel,
      apiVersion: this.apiVersion,
      corsAllowedOrigins: this.corsAllowedOrigins,
      deployEnv: this.deployEnv,
    };
  }
}
