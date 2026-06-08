import { connectDB } from "@/lib/mongodb";
import Product from "@/lib/models/product";

export async function GET() {
  try {
    await connectDB();

    return Response.json({
      success: true,
      message: "MongoDB connected successfully 🚀",
    });
  } catch (error: any) {
    return Response.json(
      {
        success: false,
        message: error.message,
      },
      { status: 500 }
    );
  }
}