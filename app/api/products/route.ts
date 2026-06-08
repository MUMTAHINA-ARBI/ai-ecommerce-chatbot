import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
// ADD THE CURLY BRACES HERE:
import { Product } from "@/lib/models/product"; 

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("Connecting to MongoDB...");
    await connectDB();

    console.log("Querying products...");
    const products = await Product.find({});
    
    return NextResponse.json({ success: true, products }, { status: 200 });
  } catch (error: any) {
    console.error("API Error:", error);
    return NextResponse.json(
      { success: false, message: error.message }, 
      { status: 500 }
    );
  }
}