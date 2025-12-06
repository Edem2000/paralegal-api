import {IsArray, IsEnum, IsOptional, IsString, MinLength} from 'class-validator';
import {RuleKind} from "domain/_processor/rules";
import {MaskingMode} from "domain/_processor/processing-config";

export class ProcessTransactionDto {
    @IsString()
    @MinLength(1)
    inputText!: string;

    @IsArray()
    @IsString({ each: true })
    choices!: RuleKind[];

    @IsArray()
    @IsString({ each: true })
    llmChoices!: RuleKind[];

    @IsArray()
    @IsString({ each: true })
    customQueries!: string[];

    @IsString()
    @IsEnum(MaskingMode)
    maskingMode!: MaskingMode;

    @IsOptional()
    tailLength?: number;
}
