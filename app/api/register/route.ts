// app/api/register/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "../../../lib/mongodb"; // Double check your relative path matches this
import { User } from "../../../lib/models/user";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    // 1. Safe parsing fallback
    const body = await req.json().catch(() => null);
    if (!body) {
      return NextResponse.json({ message: "Invalid or empty JSON body sent." }, { status: 400 });
    }

    const { name, email, password } = body;
    if (!name || !email || !password) {
      return NextResponse.json({ message: "Missing required fields: name, email, or password." }, { status: 400 });
    }

    // 2. Core database connection wrapper verification
    try {
      await connectDB();
    } catch (dbError: any) {
      console.error("DATABASE CONNECTION CRASH:", dbError);
      return NextResponse.json({ message: `Database offline: ${dbError.message}` }, { status: 500 });
    }

    // 3. User verification checking mechanisms
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already registered." }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = await User.create({
      name,
      email: email.toLowerCase().trim(),
      password: hashedPassword
    });

    return NextResponse.json({ message: "User registered successfully!", userId: newUser._id }, { status: 201 });
  } catch (error: any) {
    console.error("GLOBAL REGISTRATION CRASH LOG:", error);
    return NextResponse.json({ message: `Server error: ${error.message || "Unknown error"}` }, { status: 500 });
  }
}