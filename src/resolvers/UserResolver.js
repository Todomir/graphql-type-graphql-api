"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const type_graphql_1 = require("type-graphql");
const bcrypt_1 = require("bcrypt");
const User_1 = __importDefault(require("../models/User"));
const UserSchema_1 = __importDefault(require("../database/schemas/UserSchema"));
const graphql_type_json_1 = __importDefault(require("graphql-type-json"));
let UserController = class UserController {
    // return all users
    async index() {
        const users = await UserSchema_1.default.find();
        return users;
    }
    // create a new user
    async store(name, email, password) {
        const hashedPassword = await bcrypt_1.hash(password, 10);
        const user = await UserSchema_1.default.create({
            name,
            email,
            password: hashedPassword
        });
        return user;
    }
    // return a single user
    async show(email) {
        const user = await UserSchema_1.default.findOne({ email: email });
        if (!user)
            throw new Error('❌ | User not found.');
        return user;
    }
    // update a single user
    async update(id, name, password) {
        try {
            const user = await UserSchema_1.default.findByIdAndUpdate(id, { name, password }, { new: true });
            return user;
        }
        catch (error) {
            throw error;
        }
    }
    // delete a single user
    async destroy(id) {
        try {
            await UserSchema_1.default.deleteOne({ _id: id });
            return { message: '✅ | User deleted successfully!' };
        }
        catch (error) {
            throw error;
        }
    }
};
__decorate([
    type_graphql_1.Query(_returns => [User_1.default], { name: 'users' }),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], UserController.prototype, "index", null);
__decorate([
    type_graphql_1.Mutation(_returns => User_1.default, { name: 'createUser' }),
    __param(0, type_graphql_1.Arg('name')),
    __param(1, type_graphql_1.Arg('email')),
    __param(2, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "store", null);
__decorate([
    type_graphql_1.Query(returns => User_1.default, { name: 'fetchUser' }),
    __param(0, type_graphql_1.Arg('email')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "show", null);
__decorate([
    type_graphql_1.Mutation(returns => User_1.default, { name: 'updateUser' }),
    __param(0, type_graphql_1.Arg('id')),
    __param(1, type_graphql_1.Arg('name')),
    __param(2, type_graphql_1.Arg('password')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "update", null);
__decorate([
    type_graphql_1.Mutation(returns => graphql_type_json_1.default, { name: 'deleteUser' }),
    __param(0, type_graphql_1.Arg('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UserController.prototype, "destroy", null);
UserController = __decorate([
    type_graphql_1.Resolver(User_1.default)
], UserController);
exports.default = UserController;
