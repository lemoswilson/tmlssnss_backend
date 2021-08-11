"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importStar(require("mongoose"));
const ItemsSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    product_id: { type: String, required: true },
    price: { type: Number, required: true },
    total: { type: Number, required: true }
});
const OrdersSchema = new mongoose_1.Schema({
    user: { type: mongoose_1.Schema.Types.ObjectId, required: true },
    submitted_at: { type: Number, required: true },
    total_items: { type: Number, required: true },
    items: { type: [ItemsSchema], required: true },
    orderRef: { type: String, required: true },
    state: { type: String, required: true }
});
exports.default = mongoose_1.default.model('OrdersModel', OrdersSchema);
//# sourceMappingURL=orders.model.js.map