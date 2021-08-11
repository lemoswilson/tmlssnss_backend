"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("../config/passport");
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const mongoose_1 = __importDefault(require("mongoose"));
const userRoutes_1 = __importDefault(require("../routes/userRoutes"));
const passport_1 = __importDefault(require("passport"));
const port = process.env.PORT || 5000;
console.log(process.env.ATLAS_URI);
const app = express_1.default();
app.use(cors_1.default());
app.use(express_1.default.json());
app.use(passport_1.default.initialize());
app.use('/users', userRoutes_1.default);
mongoose_1.default.connect(process.env.ATLAS_URI, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: true,
});
const connection = mongoose_1.default.connection;
connection.once('open', () => {
    console.log('mongodb database connection established');
});
app.listen(port);
//# sourceMappingURL=app.js.map