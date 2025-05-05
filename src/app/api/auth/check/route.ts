import { auth } from "@/auth";
import connectDB from "@/db/connectDB";
import { User } from "@/db/models/user.model";

export const GET = async () => {
  try {
    const session = await auth();

    if (session) {
      await connectDB();

      console.log("session", session);

      let user;
      if (session.user._id) {
        console.log("session.user._id", session.user._id);
        user = await User.findById(session.user._id);
      } else {
        console.log("session.user.id", session.user.id);
        user = await User.findOne({ email: session.user.email });
      }
      if (!user) {
        return new Response(JSON.stringify({ ok: false, error: "User not found" }), { status: 404 });
      }

      const userObj = user.toObject();
      delete userObj.password;

      console.log("userObj", userObj);


      return new Response(JSON.stringify({ ok: true, user: userObj }), { status: 200 });
    } else {
      return new Response(JSON.stringify({ ok: false, error: "Not Authenticated" }), { status: 401 });
    }
  } catch (error) {
    console.error("API Error:", error);
    return new Response(JSON.stringify({ ok: false, error: "Internal Server Error" }), { status: 500 });
  }
};
