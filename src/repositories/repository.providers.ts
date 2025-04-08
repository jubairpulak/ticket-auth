import { DEMO_REPOSITORY } from "src/config/constants";
import { DemoModel } from "src/models/Demo.model";

export const demoProviders = [{
    provide: DEMO_REPOSITORY,
    useValue: DemoModel,
}]