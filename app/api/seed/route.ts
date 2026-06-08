// app/api/seed/route.ts
// app/api/seed/route.ts
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Product } from "@/lib/models/product";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    console.log("--- SEEDING DATABASE STARTED ---");
    
    // 1. Connect to Database safely
    await connectDB();
    console.log("Connected to MongoDB for seeding.");

    // 2. Clear out any old products to keep database clean
    console.log("Clearing old products collection...");
    await Product.deleteMany({});

    // 3. Insert 5 running products matching all interview specifications
    console.log("Inserting seed products...");
    const productsToSeed = [
      {
        name: "Nike Dri-FIT Running T-Shirt",
        category: "T-Shirt",
        price: 25,
        sizes: ["M", "L", "XL"], // ❌ "S" is intentionally missing to trigger out-of-stock request flows!
        stock: 20,
        image: "https://images.unsplash.com/photo-1581655353564-df123a1eb820?auto=format&fit=crop&q=80&w=500",
      },
      {
        name: "Adidas Falcon Running Shoes",
        category: "Shoes",
        price: 65,
        sizes: ["S", "M", "L", "XL"],
        stock: 12,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80&w=500",
      },
      {
        name: "Puma Marathon Running Shorts",
        category: "Pants",
        price: 30,
        sizes: ["S", "M", "L"],
        stock: 15,
        image: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80&w=500",
      },
      {
        name: "Under Armour ColdGear Running Joggers",
        category: "Pants",
        price: 50,
        sizes: ["M", "L", "XL", "XXL"], // Includes XXL per core layout guidelines
        stock: 8,
        image: "https://images.unsplash.com/photo-1483721310020-03333e577078?auto=format&fit=crop&q=80&w=500",
      },
      {
        name: "Brooks Windbreaker Running Jacket",
        category: "Jacket",
        price: 75,
        sizes: ["S", "M", "L", "XL"],
        stock: 10,
        image: "https://images.unsplash.com/photo-1551854838-212c50b4c184?auto=format&fit=crop&q=80&w=500",
      }
    ];

    const seeded = await Product.insertMany(productsToSeed);
    
    console.log(`Database seeded successfully with ${seeded.length} products!`);
    return NextResponse.json({ 
      success: true, 
      message: "Database seeded successfully with 5 running products matching specifications!",
      count: seeded.length
    }, { status: 200 });
    
  } catch (error: any) {
    console.error("SEEDING CRITICAL ERROR:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Unknown seeding breakdown" },
      { status: 500 }
    );
  }
}