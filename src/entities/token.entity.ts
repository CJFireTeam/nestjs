import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from "typeorm"
import { UserEntity } from "./user.entity";

@Entity({name: 'token',comment: 'Table for storing roles information'})
export class TokenEntity {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    token: string
    
    @Column()
    description: string

    @Column()
    isPrivate: boolean

    @Column()
    status: boolean

    @Column({default: false})
    isDefault: boolean

    @OneToMany(() => UserEntity, UserEntity => UserEntity.role)
    user: UserEntity[];
}