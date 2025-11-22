import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Post} from '@nestjs/common';
import {Symbols} from "di/common";
import {ProcessTransactionUsecase} from "usecases/process-transaction-usecase";
import {ProcessTransactionDto} from "infrastructure/controllers/dtos/transactions/process-transaction-dto";
import {getExceptionByError} from "infrastructure/controllers/exceptions/exceptions";

@Controller('api')
export class MainController {
  constructor(
      @Inject(Symbols.usecases.transactions.process)
      private readonly processTransactionUsecase: ProcessTransactionUsecase,
  ) {}

    @HttpCode(HttpStatus.OK)
    @Get('/settings')
    public async getSettings(): Promise<void> {
        // try {
        //     const params = {
        //         page: query.page,
        //         limit: query.limit,
        //         query: query.query,
        //     };
        //
        //     const { users, page, limit, total } = await this.searchUsersUsecase.execute(params);
        //
        // } catch (error) {
        //     throw getExceptionByError(error);
        // }
    }

    @HttpCode(HttpStatus.OK)
    @Get('/transactions')
    public async getTransactions(): Promise<void> {
        // try {
        //     const params = {
        //         page: query.page,
        //         limit: query.limit,
        //         query: query.query,
        //     };
        //
        //     const { users, page, limit, total } = await this.searchUsersUsecase.execute(params);
        //
        // } catch (error) {
        //     throw getExceptionByError(error);
        // }
    }

    @HttpCode(HttpStatus.OK)
    @Get('/transactions/:id')
    public async getTransaction(): Promise<void> {
        // try {
        //     const params = {
        //         page: query.page,
        //         limit: query.limit,
        //         query: query.query,
        //     };
        //
        //     const { users, page, limit, total } = await this.searchUsersUsecase.execute(params);
        //
        // } catch (error) {
        //     throw getExceptionByError(error);
        // }
    }

    @HttpCode(HttpStatus.OK)
    @Post('/transactions')
    public async createTransaction(@Body() dto: ProcessTransactionDto): Promise<any> {
        try {
            const params = {
                input: dto.inputText,
                choices: dto.choices,
                customQueries: dto.customQueries,
                maskingMode: dto.maskingMode,
                tailLength: dto.tailLength,
            };

            const result = await this.processTransactionUsecase.execute(params);

            return result
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

}
