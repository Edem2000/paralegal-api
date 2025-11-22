import {Usecase} from "domain/_core/base-domain/base-usecase";
import {ProcessingConfigService} from "domain/_processor/processing-config/service";
import {RuleKind} from "domain/_processor/rules";
import {MaskingMode} from "domain/_processor/processing-config";
import {MaskingEngine} from "domain/_processor";

type ProcessTransactionParams = {
    input: string,
    choices: RuleKind[],
    customQueries: string[],
    maskingMode: MaskingMode,
};

type ProcessTransactionResult = {

}

export interface ProcessTransactionUsecase extends Usecase<ProcessTransactionParams, ProcessTransactionResult> {}

export class ProcessTransactionUsecaseImpl implements ProcessTransactionUsecase {
    constructor(
        // private companyService: CompanyService,
        // private userService: UserService,
        // private roleService: RoleService,
        // private currentUserService: CurrentUserService,
        // private auditLogService: AuditLogService,
        private readonly processingConfigService: ProcessingConfigService,
        private readonly maskingEngine: MaskingEngine,
    ) {
    }

    async execute(params: ProcessTransactionParams): Promise<ProcessTransactionResult> {
        const {input, choices, customQueries, maskingMode} = params;

        const processingConfig = this.processingConfigService.buildConfig(choices, maskingMode, customQueries);

        console.log(input, choices, customQueries, processingConfig);
        await this.maskingEngine.process(input, processingConfig);

        // await this.auditLogService.log({
        //     type: AuditType.ProcessTransaction,
        //     actorUserId: currentUser.id,
        //     targetEntity: TargetEntity.Company,
        //     targetId: company.id  ,
        // }, context).catch((e) => {
        //     console.log("log creation error:", e);
        // });

        // console.log(`Created company ${company.id}`);
        //
        return { };
    }
}
