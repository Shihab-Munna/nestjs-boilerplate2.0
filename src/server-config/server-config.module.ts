import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { configuration } from './models/configuration';
import * as process from 'process';
import { validationSchema } from './models/config-validation.schema';
import { ServerConfigService } from './server-config.service';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `${process.cwd()}/env/.${process.env.NODE_ENV || 'dev'}.env`,
      load: [configuration],
      validationSchema: validationSchema,
    }),
  ],
  providers: [ServerConfigService],
  exports: [ServerConfigService],
})
export class ServerConfigModule {}
