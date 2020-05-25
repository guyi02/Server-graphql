import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import cloudinary from "cloudinary";
require("dotenv").config();

export default {
  // USER
  createUser: async (root, { dados }, { User }) => {
    const {
      email,
      password,
      confirmPassword,
      is_team,
      players,
      team,
      pro_user,
      trial,
    } = dados;
    const verifiUser = await User.findOne({ email });

    if (verifiUser) {
      throw new Error("Email já cadastrado");
    }

    if (password !== confirmPassword) {
      throw new Error("Senhas não conferem");
    }

    try {
      const user = await new User({
        email,
        password,
        is_team,
        players,
        team,
        pro_user,
        trial,
      }).save();
      return user;
    } catch (error) {
      return error;
    }
  },

  updateUser: async (root, { dados }, { userToken, User }) => {
    const [bearer, token] = userToken.split(" ");
    jwt.verify(token, "mysecret", (err, decode) => {
      if (err || !decode) {
        throw new Error("Usuário não autenticado");
      }
    });

    try {
      const userUpdated = await User.findByIdAndUpdate(
        { _id: dados.id },
        { $set: dados },
        { new: true }
      );
      return userUpdated;
    } catch (error) {
      return error;
    }
  },

  deleteUser: async (root, { _id }, { userToken, User }) => {
    const [bearer, token] = userToken.split(" ");
    jwt.verify(token, "mysecret", (err, decode) => {
      if (err || !decode) {
        throw new Error("Usuário não autenticado");
      }
    });

    const verifiUser = await User.findOne({ _id });

    if (!verifiUser) {
      throw new Error("Usuário não existente");
    }

    try {
      await User.findByIdAndDelete({ _id });

      return {
        message: "Deletado com sucesso!",
      };
    } catch (error) {
      return error;
    }
  },
  // AUTH
  login: async (root, { dados: { email, password } }, { User }) => {
    const user = await User.findOne({ email });

    if (!user) {
      throw new Error("Usuário não cadastrado");
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error("Senha inválida");
    }

    const responseToken = jwt.sign(
      {
        id: user.id,
        username: user.email,
      },
      "mysecret",
      {
        expiresIn: "1d", // token will expire in 15days
      }
    );
    return {
      token: `Bearer ${responseToken}`,
      user,
      logged: true,
    };
  },

  refreshToken: async (root, { dados: { token } }) => {
    const [bearer, mytoken] = token.split(" ");

    try {
      const tryDecode = await jwt.verify(mytoken, "mysecret");
      return {
        token,
        logged: true,
      };
    } catch (error) {
      throw new Error("Token inválido!");
    }
  },
  // PLAYER
  RegisterPlayer: async (root, { dados }, { userToken, Player }) => {
    const [bearer, token] = userToken.split(" ");
    if (!token) throw new Error("Usuário não autenticado");
    if (!token) {
      throw new Error("Você não possui um token");
    }
    jwt.verify(token, "mysecret", (err, decode) => {
      if (err || !decode) {
        throw new Error("Usuário não autenticado");
      }
    });

    const verifiUser = await Player.findOne({ cpf: dados.cpf });

    if (verifiUser) {
      throw new Error("Usuário já cadastrado com este CPF!");
    }

    const objArgs = JSON.parse(JSON.stringify(dados));

    try {
      const player = await new Player(objArgs).save();
      return player;
    } catch (error) {
      return error;
    }
  },
  // TEAM
  RegisterTeam: async (root, { dados }, { userToken, Team }) => {
    const [bearer, token] = userToken.split(" ");
    if (!token) throw new Error("Usuário não autenticado");
    jwt.verify(token, "mysecret", (err, decode) => {
      if (err || !decode) {
        throw new Error("Usuário não autenticado");
      }
    });

    const objArgs = JSON.parse(JSON.stringify(dados));

    try {
      const team = await new Team(objArgs).save();
      return team;
    } catch (error) {
      if (error.code === 11000)
        throw new Error("Já existe time com este nome cadastrado");
    }
  },

  singleUpload: async (root, { file }) => {
    cloudinary.config({
      cloud_name: process.env.CLOUD_NAME,
      api_key: process.env.API_KEY,
      api_secret: process.env.API_SECRET,
    });
    const { filename, createReadStream, mimetype, encoding } = await file;

    const uploadToCloudinary = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.v2.uploader.upload_stream(
          {
            folder: "app_assets",
            public_id: filename.split(".").slice(0, -1).join("."),
            invalidate: true,
          },
          (error, result) => {
            if (result) {
              resolve(result);
            } else {
              reject(error);
            }
          }
        );

        const stream = createReadStream();
        stream.pipe(uploadStream);
      });
    };
    const result = await uploadToCloudinary();
    return {
      filename,
      mimetype,
      encoding,
      uri: result.url,
    };
  },
};
