import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:4000";

export async function POST(request: NextRequest) {
  try {
    console.log("[Profile Photo API] POST request received");

    // Get auth token from NextAuth
    const token = await getToken({
      req: request,
      secret: process.env.NEXTAUTH_SECRET,
    });

    if (!token || !token.accessToken) {
      return NextResponse.json(
        { success: false, message: "Unauthorized - Please login" },
        { status: 401 }
      );
    }

    // Parse FormData from request
    const formData = await request.formData();
    const photo = formData.get("photo");

    if (!photo) {
      return NextResponse.json(
        { success: false, message: "No photo provided" },
        { status: 400 }
      );
    }

    console.log(
      "[Profile Photo API] Forwarding to backend:",
      `${BACKEND_URL}/api/users/profile/photo`
    );

    // Create a new FormData for the backend request
    const backendFormData = new FormData();
    backendFormData.append("photo", photo);

    // Forward request to backend using fetch
    const response = await fetch(`${BACKEND_URL}/api/users/profile/photo`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
      },
      body: backendFormData,
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.error("[Profile Photo API] Backend error:", {
        status: response.status,
        data: errorData,
      });
      return NextResponse.json(
        {
          success: false,
          message: errorData.message || "Failed to upload photo to backend",
        },
        { status: response.status }
      );
    }

    const data = await response.json();
    return NextResponse.json(data, { status: 200 });
  } catch (error: any) {
    console.error("[Profile Photo API] Error:", error);
    return NextResponse.json(
      {
        success: false,
        message: error.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}
