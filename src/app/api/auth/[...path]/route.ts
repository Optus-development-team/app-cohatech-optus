import { NextRequest, NextResponse } from "next/server";

const API_BASE_URL = "https://dot-revealable-telescopically.ngrok-free.dev";

export async function POST(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth/", "");
  const token = request.headers.get("authorization");
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth/", "");
  const token = request.headers.get("authorization");

  try {
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  const path = request.nextUrl.pathname.replace("/api/auth/", "");
  const token = request.headers.get("authorization");
  
  try {
    const body = await request.json();
    
    const response = await fetch(`${API_BASE_URL}/${path}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: token } : {}),
      },
      body: JSON.stringify(body),
    });

    const data = await response.json();
    
    if (!response.ok) {
      return NextResponse.json(data, { status: response.status });
    }

    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { message: "Error de conexión" },
      { status: 500 }
    );
  }
}