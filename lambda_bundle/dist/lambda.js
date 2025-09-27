"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const serverless_express_1 = __importDefault(require("@codegenie/serverless-express"));
const app_module_1 = require("./app.module");
const core_1 = require("@nestjs/core");
let cached;
const handler = async (event, context, callback) => {
    if (!cached) {
        const app = await core_1.NestFactory.create(app_module_1.AppModule);
        await app.init();
        // monta o express wrapper e guarda em cache
        cached = (0, serverless_express_1.default)({ app: app.getHttpAdapter().getInstance() });
    }
    return cached(event, context, callback);
};
exports.handler = handler;
//# sourceMappingURL=lambda.js.map