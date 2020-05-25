import jwt from "jsonwebtoken";

export default {
  getUsers: async (root, {}, { userToken, User }) => {
    const [bearer, token] = userToken.split(" ");
    if (!token) {
      throw new Error("Você não possui um token");
    }
    jwt.verify(token, "mysecret", (err, decode) => {
      if (err || !decode) {
        throw new Error("Usuário não autenticado");
      }
    });

    const users = await User.find({});
    return users;
  },
  getUser: async (root, { id }, { userToken, User }) => {
    const [bearer, token] = userToken.split(" ");
    if (!token) {
      throw new Error("Você não possui um token");
    }
    jwt.verify(token, "mysecret", (err, decode) => {
      if (err || !decode) {
        throw new Error("Usuário não autenticado");
      }
    });
    const user = await User.findById(id);
    return user;
  },
  getTeams: async (root, {}, { Team }) =>
    await Team.find({}).sort({ team_name: 1 }),
};
