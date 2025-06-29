import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToOne, ManyToMany, JoinTable, OneToMany } from "typeorm"
import { IUserEntity, UserEntity } from "./user.entity"
import { IModulesEntity } from "./modules.entity";
import { ITeamModuleEntity, TeamModuleEntity } from "./teamModules.entity";

export interface ITeamEntity {
  id: number;
  name: string;
  status: boolean;
  createdAt: Date;
  updatedAt: Date;
  creator: IUserEntity;
  creatorId: number;
  members: IUserEntity[];
  modules: ITeamModuleEntity[];
  teamUrl?: string;
}

@Entity({name: 'teams',comment: 'Table for storing teams/business information'})

export class TeamEntity implements ITeamEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column()
    name: string

    @Column({default:true})
    status: boolean

    @Column()
    createdAt: Date
    @Column()
    updatedAt: Date

    @ManyToOne('users','myTeamsOwner')
    creator: IUserEntity;

    @Column()
    creatorId: number;

    @Column({ nullable: true })
    teamUrl: string;
       
    @ManyToMany('teams_users','teams')
    members: IUserEntity[];
   
    @OneToMany('teams_modules','team')
    modules: TeamModuleEntity[];
}