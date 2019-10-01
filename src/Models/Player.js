import mongoose from "mongoose";

const PlayerSchema = new mongoose.Schema({
    name: String,
    surname: String,
    play_for_team: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team",
        default: null
    },
    nick_name: {
        type: String,
        unique: true
    },
    height: Number,
    weight: Number,
    foot: String,
    phone: String,
    profile_img: String,
    profile_video: String,
    description: String,
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    habilities: {
        pace: Number,
        drible: Number,
        defense: Number,
        shoot: Number,
        pass: Number,
        physic: Number
    },
    diferencials: {
        good: String,
        very_good: String,
        excelent: String
    },
    avaliable_days: [{
        _id: false,
        day: String
    }],
    avaliable_hours: [{
        _id: false,
        hour: String
    }],
    goals: Number,
    position: String,
    position_secondary: String,
    available: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
        default: Date.now
    }
});


export default mongoose.model("Player", PlayerSchema);
