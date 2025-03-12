import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  ipl_team_id: { type: String },
  password: { type: String, required: true },
  player_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  slot_num: { type: Number, enum: [1, 2, 3, 4, 5, 6], required: true },
  power_card_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "PowerCard" }],
  Purse: { type: Number, required: true },
  Score: { type: Number, default: 0 },
  role: { type: String, required: true },
});

export default mongoose.model("User", userSchema);
