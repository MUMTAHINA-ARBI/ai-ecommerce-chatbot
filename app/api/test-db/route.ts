// app/api/test-db/route.ts
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/product"; 

export async function GET() {
  try {
    await connectDB();

    // 💡 Fetch item count to ensure TypeScript uses the 'Product' import and verifies your database collections!
    const productCount = await Product.countDocuments({});

    return Response.json({
      success: true,
      message: "MongoDB connected successfully 🚀",
      totalProductsInDB: productCount,
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