import { IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class MultilingualStringDto {
    @IsString()
    @IsNotEmpty()
    ru: string;

    @IsString()
    @IsNotEmpty()
    uz: string;

    @IsString()
    @IsNotEmpty()
    en: string;
}

export class MultilingualOptionalStringDto {
    @IsOptional()
    @IsString()
    ru: string;

    @IsOptional()
    @IsString()
    uz: string;

    @IsOptional()
    @IsString()
    en: string;
}