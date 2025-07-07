import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { UserEntity } from "./user.entity";
import { ITeamEntity } from "./team.entity";
import { ITeamModuleEntity, TeamModuleEntity } from "./teamModules.entity";
import { UserModuleEntity } from "./userModules.entity";

export interface IModulesEntity {
    id: number;
    name: string;
    description: string;
    forTeams: boolean;
    forUsers: boolean;
    isPremium: boolean;
    isPrivate: boolean;
    status: boolean;
}
@Entity({name: 'modules',comment: 'Table for storing modules team information'})
export class ModulesEntity implements IModulesEntity {
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
    isPremium:boolean;
    @Column()
    status: boolean;

    @Column({nullable:true})
    icon: string;
    
    @OneToMany('teams_modules','module')
    teams: TeamModuleEntity[];

    @OneToMany('UserModuleEntity', 'module')
    userModules: UserModuleEntity[];
}