import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { IUserEntity, UserEntity } from "./user.entity";
import { ITeamUserEntity } from "./teamUsers.entity";
import { IUserModuleEntity } from "./userModules.entity";
export interface IRolesEntity {
    id: number;
    name: string
    description: string;
    isPrivate:boolean;
    forTeams: boolean;
    forUsers: boolean;
    status: boolean;
    isDefault: boolean;
    users?: UserEntity[];
    teamsUsers?: ITeamUserEntity[]
    userModules?: IUserModuleEntity[]
}

@Entity({name: 'roles',comment: 'Table for storing roles information'})

export class RolesEntity implements IRolesEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string
    
    @Column()
    description: string

    @Column()
    isPrivate: boolean
    @Column()
    forTeams: boolean;

    @Column()
    forUsers: boolean;
    @Column()
    status: boolean
    
    @Column({default: false})
    isDefault: boolean

    @OneToMany(() => UserEntity, UserEntity => UserEntity.role)
    users: UserEntity[];

    @OneToMany('teams_users','role')
    teamsUsers: ITeamUserEntity[];

   @OneToMany('UserModuleEntity', 'role')
    userModules: any[];
}