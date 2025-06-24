import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToMany, ManyToOne } from "typeorm"
import { IUserEntity, UserEntity } from "./user.entity";

export interface IOtpEntity {
    id: number;
    code: string;
    used: boolean;
    user: UserEntity;
    userId: number;

}
@Entity({name: 'otp',comment: 'Table for storing otp'})
export class OtpEntity implements IOtpEntity{
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique: true })
    code: string

    @Column({default: false})
    used: boolean
    @Column()
    expiresAt: Date;

    @ManyToOne('users','otps')
    user: UserEntity;   
    @Column()
    userId: number;
}