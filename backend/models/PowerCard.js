import mongoose from "mongoose";

const powerCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  effect: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "Player" },
});
export default mongoose.model("PowerCard", powerCardSchema);
