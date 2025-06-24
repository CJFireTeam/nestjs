import { DataSource } from 'typeorm';
import { UserEntity } from './user.entity';
import { RolesEntity } from './role.entity';
import { OtpEntity } from './otp.entity';
import { TeamEntity } from './team.entity';
const data_source = 'DATA_SOURCE';
export const UserProviders = [
  {
    provide: 'USER_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(UserEntity),
    inject: [data_source],
  },
  {
    provide: 'ROLE_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(RolesEntity),
    inject: [data_source],
  },
  {
    provide: 'OTP_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(OtpEntity),
    inject: [data_source],
  },
  {
    provide: 'TEAM_REPOSITORY',
    useFactory: (dataSource: DataSource) => dataSource.getRepository(TeamEntity),
    inject: [data_source],
  },
];