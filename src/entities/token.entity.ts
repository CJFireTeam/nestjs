import { Entity, PrimaryGeneratedColumn, Column, OneToOne, JoinColumn } from 'typeorm';

@Entity({ name: 'token', comment: 'Table for storing roles information' })
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  token: string;

  @Column()
  status: boolean;

  @Column()
  expirate: Date;

  @OneToOne('users','id')
  @JoinColumn({name: 'userId'})
  user: any;

  @Column({unique: true})
  userId: number;
}