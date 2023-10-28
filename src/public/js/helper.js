"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateBase64FromImage = void 0;
const generateBase64FromImage = (imageFile) => {
    if (!imageFile) {
        return new Promise((resolve, reject) => { });
    }
    const reader = new FileReader();
    const promise = new Promise((resolve, reject) => {
        reader.onload = (e) => { var _a; return resolve((_a = e.target) === null || _a === void 0 ? void 0 : _a.result); };
        reader.onerror = (err) => reject(err);
    });
    reader.readAsDataURL(imageFile);
    return promise;
};
exports.generateBase64FromImage = generateBase64FromImage;
