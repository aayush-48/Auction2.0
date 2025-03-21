import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  ipl_team_id: { type: String },
  password: { type: String, required: true },
  player_ids: [{ type: mongoose.Schema.Types.ObjectId, ref: "Player" }],
  slot_num: { type: Number, enum: [1, 2, 3, 4, 5, 6], required: true },
  power_card_id: {
    type: [{ type: mongoose.Schema.Types.ObjectId, ref: "PowerCard" }],
    default: [new mongoose.Types.ObjectId("67d81ffddda0691155119e20")], // Default value
  },
  Purse: { type: Number, required: true },
  Score: { type: Number, default: 0 },
  role: { type: String, required: true },
});

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    // If the password is not modified, skip hashing
    return next();
  }
  console.log("Hashing password...");

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.createJWT = function () {
  return jwt.sign(
    { userId: this._id, name: this.username },
    process.env.JWT_SECRET,
    {
      expiresIn: "1d",
    }
  );
};

userSchema.methods.comparePassword = async function (canditatePassword) {
  const isMatch = await bcrypt.compare(canditatePassword, this.password);
  return isMatch;
};

export default mongoose.model("User", userSchema);
