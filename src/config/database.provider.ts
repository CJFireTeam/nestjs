import { DataSource } from 'typeorm';
import enviroment from './enviroment';
import { UserEntity } from 'src/entities/user.entity';
import { ConfigService } from '@nestjs/config';
import { Inject } from '@nestjs/common';
import { RolesEntity } from 'src/entities/role.entity';
import { TeamEntity } from 'src/entities/team.entity';
import { ModulesEntity } from 'src/entities/modules.entity';
import { TeamUserEntity } from 'src/entities/teamUsers.entity';
import { OtpEntity } from 'src/entities/otp.entity';
import { TeamModuleEntity } from 'src/entities/teamModules.entity';
import { TokenEntity } from 'src/entities/token.entity';
import { UserModuleEntity } from 'src/entities/userModules.entity';
export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    inject: [ConfigService],
    useFactory: async (configService: ConfigService) => {
      const dataSource = new DataSource({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USER'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [
          UserEntity,
          RolesEntity,
          TeamEntity,
          ModulesEntity,
          TeamUserEntity,
          OtpEntity,
          TeamModuleEntity,
          TokenEntity,
          UserModuleEntity
        ],
        synchronize: true,
      });
      return dataSource.initialize();
    },
  },
];
