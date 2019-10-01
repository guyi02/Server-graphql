import mongoose from "mongoose";

const TeamSchema = new mongoose.Schema({
  team_name: {
    type: String,
    required: true,
    unique: true
  },
  team_image: {
    type: String,
  },
  players: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Player",
    default: null
  }],
  month_payment: [{
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    player_id: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
    player_name: {type: String},
    value: { type: Number },
    created_at: {
      type: Date,
      default: Date.now
    }
  }],
  spending: [{
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    value: { type: Number },
    description: { type: String },
    created_at: {
      type: Date,
      default: Date.now
    },
  }],
  profit: [{
    _id: { type: mongoose.Schema.ObjectId, auto: true },
    value: { type: Number },
    description: { type: String },
    created_at: {
      type: Date,
      default: Date.now
    },
  }],
  find_player: {
    type: Boolean,
    default: false
  },
  find_positions: [{
    _id: false,
    position: {type: String}
  }],
  created_at: {
    type: Date,
  },

});


export default mongoose.model("Team", TeamSchema);
