import { IsNumber } from "class-validator";

export class CreateFuelPriceDto {
    @IsNumber()
    lat: number;

    @IsNumber()
    lng: number;
}
