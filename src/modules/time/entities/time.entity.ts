import { Column, Entity, PrimaryColumn } from "typeorm";

@Entity()
export class Time {
    @PrimaryColumn()
    id: number

    @Column()
    startTime: string

    @Column()
    endTime: string

    @Column()
    duration: number

    @Column()
    maxDate: number

    @Column()
    stepMinute: number

    @Column()
    reminderTime: number
}