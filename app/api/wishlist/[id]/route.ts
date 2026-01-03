import { NextRequest, NextResponse } from "next/server";

const API =
  process.env.NEXT_PUBLIC_API ||
  "https://ecommerce.routemisr.com/api/v1/";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const authHeader = request.headers.get("Authorization");
    const token =
      request.headers.get("x-access-token") ||
      authHeader?.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    // Await the params since it's typed as a Promise
    const { id } = await context.params;

    const headers: Record<string, string> = { token };

    const response = await fetch(`${API}wishlist/${id}`, {
      method: "DELETE",
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Wishlist DELETE error:", error);
    return NextResponse.json(
      { message: "Failed to remove from wishlist" },
      { status: 500 }
    );
  }
}