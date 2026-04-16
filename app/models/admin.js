import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const AdminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});

// Compare password method
AdminSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Next.js-safe model export: prevents re-declaration errors
let Admin;
try {
  Admin = mongoose.model("Admin");
} catch {
  Admin = mongoose.model("Admin", AdminSchema);
}

export default Admin;