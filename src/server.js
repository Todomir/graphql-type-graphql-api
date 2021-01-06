"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("reflect-metadata");
const apollo_server_1 = require("apollo-server");
const type_graphql_1 = require("type-graphql");
require("./database");
require("./database/schemas/UserSchema");
const UserResolver_1 = __importDefault(require("./resolvers/UserResolver"));
async function app() {
    const schema = await type_graphql_1.buildSchema({ resolvers: [UserResolver_1.default] });
    const server = new apollo_server_1.ApolloServer({ schema });
    server.listen({ port: process.env.PORT }, () => {
        console.log(`⚡️[server]: Server is running on port ${process.env.PORT}`);
    });
}
app();
