"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppRoles = exports.APP_ROLES_KEY = void 0;
const common_1 = require("@nestjs/common");
exports.APP_ROLES_KEY = 'app_roles';
const AppRoles = (...roles) => (0, common_1.SetMetadata)(exports.APP_ROLES_KEY, roles);
exports.AppRoles = AppRoles;
//# sourceMappingURL=roles.decorator.js.map