import mongoose from "mongoose";

const powerCardSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  effect: { type: String },
  assignedTo: [{user:{ type: mongoose.Schema.Types.ObjectId, ref: "User" },
              slot : {type:Number , enum:[1,2,3,4,5,6]},
              used : {type : Boolean},
              cost : {type : Number}
  }],
});
export default mongoose.model("PowerCard", powerCardSchema);
