import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, OneToOne } from "typeorm"
import { RolesEntity } from "./role.entity"
import { ITeamEntity, TeamEntity } from "./team.entity"
import { ITeamUserEntity, TeamUserEntity } from "./teamUsers.entity";
import { OtpEntity } from "./otp.entity";

export interface IUserEntity {
  id: number;
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  isActive: boolean;
  IsBloqued: boolean;
  status: boolean;
  CreatedAt: Date;
  UpdatedAt: Date;
  role: RolesEntity;
  roleId: number;
  myTeamsOwner: ITeamEntity[];
  myTeams: ITeamUserEntity[];
  otps: OtpEntity[];
  userModules: any[];
  image?: string;
}

@Entity({name: 'users',comment: 'Table for storing user information'})
export class UserEntity implements IUserEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    email: string

    @Column()
    password: string

    @Column()
    firstName: string

    @Column()
    lastName: string

    @Column({nullable:true})
    image: string
    @Column({default:false})
    isActive: boolean

    @Column({default:false})
    IsBloqued: boolean

    @Column({default:true})
    status: boolean

    @Column({default: () => 'CURRENT_TIMESTAMP'})
    CreatedAt: Date
    
    @Column({default: () => 'CURRENT_TIMESTAMP'})
    UpdatedAt: Date

    @ManyToOne(() => RolesEntity, role => role.users)
    role: RolesEntity;

    @Column()
    roleId: number;

    @OneToMany('teams','creator')
    myTeamsOwner: TeamEntity[];

    @OneToMany('teams_users','user')
    myTeams: ITeamUserEntity[];

    @OneToMany('otp','user')
    otps: OtpEntity[];

    @OneToOne('TokenEntity', (token: any) => token.user)
    token: any;
    
   //UserModuleEntity por el la entidad de usuario, user por la relación y userModules por la propiedad de la entidad
   @OneToMany('UserModuleEntity', 'user')
   userModules: any[];
}