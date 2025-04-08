import { Injectable, Inject } from "@nestjs/common";
import { ErrorLog } from "src/config/winstonLog";
import { DEMO_REPOSITORY } from "src/config/constants";
import { DemoModel } from "src/models/Demo.model";

@Injectable()
export class DemoRepository {
    constructor(
        @Inject(DEMO_REPOSITORY) private readonly demoModel: typeof DemoModel,
    ) { }

    private readonly moduleName = 'repository';

    async functionName(payload: any): Promise<any | null> {
        try {
            return await this.demoModel.findOne(payload);
        } catch (error) {
            ErrorLog('Partner auth credential creation error: ', this.moduleName, error);
            throw error;
        }
    }
} 