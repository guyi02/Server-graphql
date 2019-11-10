import jwt from "jsonwebtoken";
import bcrypt from 'bcryptjs';

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
            trial
        } = dados
        const verifiUser = await User.findOne({ email });

        if (verifiUser) {
            throw new Error('Email já cadastrado')
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
                trial
            }).save()
            return user;
        } catch (error) {
            return error
        }
    },

    updateUser: async (root, { dados }, { userToken, User }) => {

        const [bearer, token] = userToken.split(' ');
        jwt.verify(token, 'mysecret', (err, decode) => {
            if (err || !decode) {
                throw new Error("Usuário não autenticado")
            }

        })

        try {
            const userUpdated = await User.findByIdAndUpdate({ _id: dados.id }, { $set: dados }, { new: true });
            return userUpdated
        } catch (error) {
            return error
        }



    },

    deleteUser: async (root, { _id }, { userToken, User }) => {

        const [bearer, token] = userToken.split(' ');
        jwt.verify(token, 'mysecret', (err, decode) => {
            if (err || !decode) {
                throw new Error("Usuário não autenticado")
            }
        })

        const verifiUser = await User.findOne({ _id });

        if (!verifiUser) {
            throw new Error("Usuário não existente");
        }

        try {
            await User.findByIdAndDelete({ _id })

            return {
                message: "Deletado com sucesso!"
            }
        } catch (error) {
            return error
        }
    },
    // AUTH
    login: async (root, { dados: { email, password } }, { User }) => {
        const user = await User.findOne({ email });

        if (!user) {
            throw new Error('Usuário não cadastrado')
        }

        const passwordMatch = await bcrypt.compare(password, user.password);

        if (!passwordMatch) {
            throw new Error('Senha inválida')
        }

        const responseToken = jwt.sign(
            {
                id: user.id,
                username: user.email,
            },
            'mysecret',
            {
                expiresIn: '1d', // token will expire in 15days
            },
        )
        return {
            token: `Bearer ${responseToken}`,
            user,
            logged: true
        }
    },

    refreshToken: async (root, {}, {userToken}) => {
        const [bearer, token] = userToken.split(' ');
        jwt.verify(token, 'mysecret', (err, decode) => {
            if(!decode){
                throw new Error("Token inválido!")
            }
        }); 
        return{
            token,
            logged: true
        }
    },
    // PLAYER
    RegisterPlayer: async (
        root,
        { dados },
        { userToken, Player }) => {
        const [bearer, token] = userToken.split(' ');
        jwt.verify(token, 'mysecret', (err, decode) => {
            if (err || !decode) {
                throw new Error("Usuário não autenticado")
            }
        })

        const objArgs = JSON.parse(JSON.stringify(dados));

        try {
            const player = await new Player({
                name: objArgs.name,
                surname: objArgs.surname,
                play_for_team: objArgs.play_for_team,
                nick_name: objArgs.nick_name,
                height: objArgs.height,
                weight: objArgs.weight,
                foot: objArgs.foot,
                phone: objArgs.phone,
                profile_img: objArgs.profile_img,
                profile_video: objArgs.profile_video,
                description: objArgs.description,
                cpf: objArgs.cpf,
                habilities: objArgs.habilities,
                diferencials: objArgs.diferencials,
                avaliable_days: objArgs.avaliable_days,
                avaliable_hours: objArgs.avaliable_hours,
                goals: objArgs.goals,
                position: objArgs.position,
                position_secondary: objArgs.position_secondary,
                available: objArgs.available,
            }).save();
            return player
        } catch (error) {
            return error
        }
    },
    // TEAM
    RegisterTeam: async (
        root,
        { dados },
        { userToken, Team }) => {
        const [bearer, token] = userToken.split(' ');
        jwt.verify(token, 'mysecret', (err, decode) => {
            if (err || !decode) {
                throw new Error("Usuário não autenticado")
            }
        })

        const objArgs = JSON.parse(JSON.stringify(dados));

        try {
            const team = await new Team({
                team_name: objArgs.team_name,
                team_image: objArgs.team_image,
                month_payment: objArgs.month_payment,
                spending: objArgs.spending,
                profit: objArgs.profit,
                find_positions: objArgs.find_positions
            }).save();
            return team
        } catch (error) {
            if (error.code === 11000)
                throw new Error("Já existe time com este nome cadastrado")
        }
    }
};
