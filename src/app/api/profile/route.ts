import { NextRequest, NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import axios, { AxiosError } from "axios";

export const dynamic = "force-dynamic";

const BACKEND_URL =
  process.env.NEXT_PUBLIC_BACKEND_URL ||
  process.env.BACKEND_URL ||
  "http://localhost:4000";

export async function GET(request: NextRequest) {
  try {
    console.log("[Profile API] GET request received");

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

    // Forward request to backend
    const response = await axios.get(`${BACKEND_URL}/api/users/profile`, {
      headers: {
        Authorization: `Bearer ${token.accessToken}`,
        "Content-Type": "application/json",
      },
    });

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;

    // Error handling standar
    if (axiosError.code === "ECONNREFUSED") {
      return NextResponse.json(
        { success: false, message: "Backend server is not running." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to fetch profile",
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    console.log("[Profile API] PUT request received");

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

    // Get JSON body instead of FormData
    const body = await request.json();

    console.log(
      "[Profile API] Forwarding update to backend:",
      `${BACKEND_URL}/api/users/profile`
    );

    // Forward request to backend as PATCH (JSON)
    const response = await axios.patch(
      `${BACKEND_URL}/api/users/profile`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token.accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return NextResponse.json(response.data, { status: 200 });
  } catch (error) {
    const axiosError = error as AxiosError<{ message?: string }>;
    console.error("[Profile API] Update Error:", axiosError.message);

    if (axiosError.code === "ECONNREFUSED") {
      return NextResponse.json(
        { success: false, message: "Backend server is not running." },
        { status: 503 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          axiosError.response?.data?.message || "Failed to update profile",
      },
      { status: axiosError.response?.status || 500 }
    );
  }
}
