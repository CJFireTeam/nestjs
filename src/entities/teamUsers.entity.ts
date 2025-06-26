import { Entity, Column, PrimaryGeneratedColumn, ManyToOne, JoinColumn, PrimaryColumn } from 'typeorm';
import { UserEntity } from './user.entity';
import { TeamEntity } from './team.entity';
import { RolesEntity } from './role.entity';
export interface ITeamUserEntity {
    user: UserEntity;
    team: TeamEntity;
    joinedAt: Date;
    isActive: boolean;
    isPrincipal: boolean;
}

@Entity('teams_users', { comment: 'Table for storing team-user relationships' })
export class TeamUserEntity implements ITeamUserEntity {
    @PrimaryColumn()
    userId: number;

    @PrimaryColumn()
    teamId: number;

    @PrimaryColumn()
    roleId: number;

    @ManyToOne('users', 'myTeams')
    @JoinColumn({ name: 'userId' })
    user: UserEntity;

    @ManyToOne('teams', 'members')
    @JoinColumn({ name: 'teamId' })
    team: TeamEntity;
    
    @ManyToOne('roles', 'teamsUsers')
    @JoinColumn({ name: 'roleId' })
    role: RolesEntity;

    @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
    joinedAt: Date;

    @Column({ default: true })
    isActive: boolean;

    @Column({ default: false })
    isPrincipal: boolean;
}