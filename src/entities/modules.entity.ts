import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany } from "typeorm"
import { UserEntity } from "./user.entity";
import { ITeamEntity } from "./team.entity";
import { ITeamModuleEntity, TeamModuleEntity } from "./teamModules.entity";

export interface IModulesEntity {
    id: number;
    name: string;
    description: string;
    isPrivate: boolean;
    status: boolean;
    teams: ITeamModuleEntity[];
}
@Entity({name: 'modules',comment: 'Table for storing modules team information'})
export class ModulesEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    name: string
    
    @Column()
    description: string

    @Column()
    isPrivate: boolean

    @Column()
    status: boolean

    @OneToMany('teams_modules','module')
    teams: TeamModuleEntity[];
}