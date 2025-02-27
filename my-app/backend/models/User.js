import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  ipl_team_name: { type: String, required: true, unique: true },
  email: { type: String, unique: true, sparse: true }, // Allows multiple null values
  password: { type: String, required: true },
  player_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  slot_num: { type: Number, enum: [1, 2, 3], required: true },
  power_card_id: [{ type: mongoose.Schema.Types.ObjectId, ref: "PowerCard" }],
  Purse: { type: Number, required: true },
  Score: { type: Number, default: 0 },
});

// Adding a sparse index to prevent duplicate null email values
userSchema.index({ email: 1 }, { unique: true, sparse: true });

export default mongoose.model("User", userSchema);
