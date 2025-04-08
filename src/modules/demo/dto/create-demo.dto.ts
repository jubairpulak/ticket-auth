import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class CreateDemoDto {
    @ApiProperty()
    @IsNotEmpty()
    title: string
}
