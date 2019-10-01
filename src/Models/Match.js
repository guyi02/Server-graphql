import mongoose from "mongoose";

const MatchSchema = new mongoose.Schema({
    team_home:  {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player"
            }
        ],
        goals: Number,
        cards: Number
    },
    team_away: {
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
            required: true
        },
        players: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Player"
            }
        ]
    },
    place: {
        address: String,
        reference: String,
    },
    game_start_in: String,
    finished: Boolean,
    created_at: {
        type: Date,
        default: Date.now
    },
});


export default mongoose.model("Match", MatchSchema);
