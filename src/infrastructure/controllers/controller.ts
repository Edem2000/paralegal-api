import {Body, Controller, Get, HttpCode, HttpStatus, Inject, Post, Query} from '@nestjs/common';
import {Symbols} from "di/common";
import {ProcessTransactionUsecase} from "usecases/process-transaction-usecase";
import {ProcessTransactionDto} from "infrastructure/controllers/dtos/transactions/process-transaction-dto";
import {getExceptionByError} from "infrastructure/controllers/exceptions/exceptions";
import {
    ProcessTransactionPresenter,
    ProcessTransactionResponseDto
} from "infrastructure/controllers/presenters/process-transaction-presenter";
import {GetTransactionsDto} from "infrastructure/controllers/dtos/transactions/get-transaction-dto";
import {GetTransactionsUsecase} from "usecases/get-transactions-usecase";
import {
    GetTransactionsPresenter,
    GetTransactionsResponseDto
} from "infrastructure/controllers/presenters/get-transactions-presenter";

@Controller('api')
export class MainController {
  constructor(
      @Inject(Symbols.usecases.transactions.process)
      private readonly processTransactionUsecase: ProcessTransactionUsecase,
      @Inject(Symbols.usecases.transactions.get)
      private readonly getTransactionsUsecase: GetTransactionsUsecase,
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
    public async getTransactions(@Query() query: GetTransactionsDto): Promise<GetTransactionsResponseDto> {
        try {
            const params = {
                page: query.page,
                limit: query.limit,
            };

            const data = await this.getTransactionsUsecase.execute(params);

            return GetTransactionsPresenter.present(data);
        } catch (error) {
            throw getExceptionByError(error);
        }
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
    public async createTransaction(@Body() dto: ProcessTransactionDto): Promise<ProcessTransactionResponseDto> {
        try {
            const params = {
                input: dto.inputText,
                choices: dto.choices,
                customQueries: dto.customQueries,
                maskingMode: dto.maskingMode,
                tailLength: dto.tailLength,
            };

            const result = await this.processTransactionUsecase.execute(params);

            return ProcessTransactionPresenter.present(result);
        } catch (error) {
            throw getExceptionByError(error);
        }
    }

}
