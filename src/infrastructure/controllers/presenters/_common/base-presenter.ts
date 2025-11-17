export class BasePresenter {
  public static present(success: boolean): BaseResponseDto {
    return {
      success: success,
    };
  }
}

export type BaseResponseDto = {
  success: boolean,
};