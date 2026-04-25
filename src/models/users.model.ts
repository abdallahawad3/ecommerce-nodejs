import { model, Schema } from "mongoose";
import bcrypt from "bcryptjs";
const schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },

    slug: {
      type: String,
      lowercase: true,
      required: [true, "Slug for user name is required"],
    },
    email: {
      type: String,
      required: [true, "The email is required"],
      lowercase: true,
      unique: [true, "The email must be unique"],
    },
    phone: {
      type: String,
    },
    profileImage: String,

    password: {
      type: String,
      required: [true, "The password is required"],
      minLength: [6, "The password too short"],
    },
    changePasswordDate: Date,
    role: {
      type: String,
      enum: ["user", "admin", "manager"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

schema.post("init", function (doc) {
  if (doc.profileImage) {
    const URL = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = URL;
  }
});

schema.post("save", function (doc) {
  if (doc.profileImage) {
    const URL = `${process.env.BASE_URL}/users/${doc.profileImage}`;
    doc.profileImage = URL;
  }
});

schema.pre("save", async function () {
  // Hash the password before saving the user document
  this.password = await bcrypt.hashSync(this.password, 12);
});

const User = model("User", schema);

export default User;
