import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserEntity } from "./user.entity";

@Entity({name: 'roles',comment: 'Table for storing roles information'})
export class RolesEntity {
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

    @Column({default: false})
    isDefault: boolean

    @OneToMany(() => UserEntity, UserEntity => UserEntity.role)
    users: UserEntity[];
}