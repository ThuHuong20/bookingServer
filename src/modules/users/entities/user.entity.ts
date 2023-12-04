import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
export enum UserRole {
    ADMIN = "ADMIN",
    MEMBER = "MEMBER",
}
@Entity()
export class User {
    @PrimaryGeneratedColumn()
    id: number

    @Column({ unique:true, length:150 })
    userName: string

    @Column()
    email: string

    @Column()
    password: string

    @Column({ nullable: true, default: null })
    refreshToken: string;

    @Column()
    createdAt: Date

    @Column()
    updatedAt: Date

    @Column()
    IsDelete: boolean

    @Column({ type: 'enum', enum: UserRole, default: UserRole.ADMIN })
    role: UserRole;
}
