import { GraphQLServer } from "graphql-yoga";
import mongoose from "mongoose";
import { importSchema } from "graphql-import";
import resolvers from "./src/Resolvers/index";
require("dotenv").config();

mongoose.connect(process.env.MONGO_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

// Models
import User from "./src/Models/User";
import Player from "./src/Models/Player";
import Team from "./src/Models/Team";

// linha 1 recebe os schemas
//linha 2 recebe os resolvers ou controllers
const server = new GraphQLServer({
    typeDefs: importSchema("./src/Schema/index.graphql"),
    resolvers,
    context: ({ request, response, connection }) => {
        const userToken = request.headers.authorization;

        return {
            userToken,
            User,
            Player,
            Team,
        };
    },
});
const options = { port: 4000 };
server.start(options, () =>
    console.log("rodando servidor na porta: " + options.port),
);
