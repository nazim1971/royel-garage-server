"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const routes_1 = __importDefault(require("./app/routes"));
const globalErrorHandler_1 = __importDefault(require("./app/middlewire/globalErrorHandler"));
const notFound_1 = __importDefault(require("./app/middlewire/notFound"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
class Application {
    constructor() {
        this.App = (0, express_1.default)();
        this.middleware();
        this.routes();
    }
    middleware() {
        this.App.use(express_1.default.json());
        this.App.use((0, cookie_parser_1.default)());
        this.App.use((0, cors_1.default)({
            origin: 'http://localhost:5173',
            credentials: true
        }));
    }
    routes() {
        //Application Routes
        this.App.use('/api', routes_1.default);
        this.App.get('/', (req, res) => {
            res.status(200).json({
                success: true,
                message: 'Royal garage server on Fire 🔥🔥🔥',
            });
        });
        //Global error handel
        this.App.use(globalErrorHandler_1.default);
        //Not found
        this.App.use(notFound_1.default);
    }
}
exports.default = new Application();
