import { Entity, Column, ManyToOne, JoinColumn, PrimaryGeneratedColumn } from 'typeorm';

export interface IUserModuleEntity {
  id: number;
  userId: number;
  moduleId: number;
  roleId: number;
  assignedAt: Date;
  user: any; // Cambiado a any para evitar circulares
  module: any; // Cambiado a any para evitar circulares
  role: any; // Cambiado a any para evitar circulares
}

@Entity({
  name: 'users_modules',
})
export class UserModuleEntity implements IUserModuleEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  userId: number;

  @Column()
  moduleId: number;

  @Column()
  roleId: number;

  @Column({ default: () => 'CURRENT_TIMESTAMP' })
  assignedAt: Date;

  //UserEntity por el la entidad de usuario, userModules por la relación y user por la propiedad de la entidad
  @ManyToOne('UserEntity', 'userModules')
  @JoinColumn({ name: 'userId' })
  user: any; // Cambiado a any para evitar circulares

  @ManyToOne('ModulesEntity', 'userModules')
  @JoinColumn({ name: 'moduleId' })
  module: any;

  @ManyToOne('RolesEntity', 'userModules')
  @JoinColumn({ name: 'roleId' })
  role: any;
}