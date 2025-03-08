import mongoose from "mongoose"

const teamSchema = new mongoose.Schema({
  name: { type: String, required: true },
  // score: { type: Number, required: true },
  // players: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  img : {type : String },
  teamId : {type : String , required : true}
})

export default mongoose.model("Team", teamSchema)

