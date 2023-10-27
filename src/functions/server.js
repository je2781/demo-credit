"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = void 0;
const api_1 = __importDefault(require("../api"));
const serverless_http_1 = __importDefault(require("serverless-http"));
// Export a Lambda function handler
const handler = (event, context) => __awaiter(void 0, void 0, void 0, function* () {
    // Create the Serverless Http handler and pass the Express app
    const serverlessHandler = (0, serverless_http_1.default)(api_1.default);
    // Call the Serverless Http handler to process the Lambda event
    return serverlessHandler(event, context);
});
exports.handler = handler;
