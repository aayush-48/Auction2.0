import mongoose from "mongoose"

const playerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  country: { type: String, required: true },
  gender: { type: String, required: true },
  type: { type: String, required: true },
  team: { type: mongoose.Schema.Types.ObjectId, ref: "Team" },
  basePrice: { type: Number, required: true },
  finalPrice: { type: Number, required: true },
  photo: { type: String },
  overallRating: { type: Number, required: true },
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
    rtmElite: { type: Number, required: true },
    captaincy: { type: Number, required: true },
  },
  rtmTeam: { type: String },
  isLegendary: { type: Boolean, default: false },
  isWomen: { type: Boolean, default: false },
  isUnderdog: { type: Boolean, default: false },
})

export default mongoose.model("Player", playerSchema)

