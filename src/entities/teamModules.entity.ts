import { Entity, Column, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { TeamEntity } from './team.entity';
import { IModulesEntity, ModulesEntity } from './modules.entity';

export interface ITeamModuleEntity {
  teamId: number;
  moduleId: number;
  team: TeamEntity;
  module: IModulesEntity;
  addedAt: Date;
}

@Entity('teams_modules', { comment: 'Table for storing team-module relationships' })
export class TeamModuleEntity implements ITeamModuleEntity {
  @PrimaryColumn()
  teamId: number;

  @PrimaryColumn()
  moduleId: number;

  @ManyToOne('teams', 'teams')
  @JoinColumn({ name: 'teamId' })
  team: TeamEntity;

  @ManyToOne('modules','modules')
  @JoinColumn({ name: 'moduleId' })
  module: ModulesEntity;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  addedAt: Date;
}