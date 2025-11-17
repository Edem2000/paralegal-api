import {
  BadGatewayException,
  BadRequestException,
  ConflictException,
  ForbiddenException,
  GatewayTimeoutException,
  GoneException,
  HttpException,
  InternalServerErrorException,
  MethodNotAllowedException,
  NotAcceptableException,
  NotFoundException,
  NotImplementedException,
  PayloadTooLargeException,
  PreconditionFailedException,
  RequestTimeoutException,
  ServiceUnavailableException,
  UnauthorizedException,
  UnprocessableEntityException,
  UnsupportedMediaTypeException,
} from '@nestjs/common';
import { CustomError } from 'domain/utils/errors';
import { ErrorPresenter } from 'infrastructure/controllers/presenters/_common/error-presenter';

const exceptionMap: Record<number, new (...args: any[]) => HttpException> = {
  400: BadRequestException,
  401: UnauthorizedException,
  403: ForbiddenException,
  404: NotFoundException,
  405: MethodNotAllowedException,
  406: NotAcceptableException,
  408: RequestTimeoutException,
  409: ConflictException,
  410: GoneException,
  412: PreconditionFailedException,
  413: PayloadTooLargeException,
  415: UnsupportedMediaTypeException,
  422: UnprocessableEntityException,
  500: InternalServerErrorException,
  501: NotImplementedException,
  502: BadGatewayException,
  503: ServiceUnavailableException,
  504: GatewayTimeoutException,
};

export function getExceptionByError(error: CustomError) {
  const exception = exceptionMap[error.httpCode];
  console.error("error", error.errorCode, error.errorMessage?.ru || error.message);
  if(exception) {
    return new exception(ErrorPresenter.present(error));
  }
  return new HttpException(ErrorPresenter.present(error), error.httpCode);

}