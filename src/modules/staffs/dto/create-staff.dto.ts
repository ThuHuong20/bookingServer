
import { Allow } from "class-validator"

export class CreateStaffDto {
    @Allow()
    name: string

    @Allow()
    birthDay: string

    @Allow()
    phoneNumber: string

    @Allow()
    desc: string

    @Allow()
    avatar: string

    @Allow()
    experience: string
}
