import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  role: "admin" | "user";
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema = new Schema<User>(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "user"], default: "user" },
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.comparePassword = async function (candidatePassword: string) {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<User>("User", UserSchema);
