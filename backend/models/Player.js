import mongoose from "mongoose";

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  gender: { type: String, required: true },
  type: { type: String, required: true },
  basePrice: { type: Number, required: true },
  finalPrice: { type: Array },
  src: { type: String },
  ratings: {
    batting: {
      powerplay: { type: Number, required: true },
      middleOvers: { type: Number, required: true },
      deathOvers: { type: Number, required: true },
    },
    bowling: {
      powerplay: { type: Number, required: true },
      middleOvers: { type: Number, required: true },
      deathOvers: { type: Number, required: true },
    },
    rtmElite: { type: Number },
    captaincy: { type: Number },
  },
  rtmTeam: { type: String },
  isElite: { type: Boolean, default: false },
});

export default mongoose.model("Player", playerSchema);
