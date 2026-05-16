const API_BASE_URL = "/api/auth";

interface LoginData {
  correo: string;
  password: string;
}

interface RegisterData {
  nombre: string;
  correo: string;
  password: string;
  telefono?: string;
  tipo_usuario: "estudiante" | "comercio";
}

interface LoginResponse {
  access_token: string;
  usuario: {
    id_usuario: string;
    nombre: string;
    correo: string;
    tipo_usuario: string;
    estado: string;
  };
}

interface RegisterResponse {
  message?: string;
  usuario?: {
    id_usuario: string;
    nombre: string;
    correo: string;
    tipo_usuario: string;
  };
}

export interface Presupuesto {
  id_estudiante: string;
  universidad: string;
  carrera: string;
  presupuesto_semanal: number;
  presupuesto_mensual: number;
  ahorro_total: number;
  nivel_actual: string;
  puntos_actuales: number;
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: LoginResponse = await res.json();

  if (!res.ok) {
    throw new Error(result.access_token || "Error en el login");
  }

  return result;
}

export async function register(data: RegisterData): Promise<RegisterResponse> {
  const res = await fetch(`${API_BASE_URL}/user/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: RegisterResponse = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error en el registro");
  }

  return result;
}

function getAuthHeader(): HeadersInit {
  const auth = getAuth();
  if (!auth) {
    throw new Error("No hay sesión activa");
  }
  return { Authorization: `Bearer ${auth.token}` };
}

export async function getPresupuesto(): Promise<Presupuesto | null> {
  const res = await fetch(`${API_BASE_URL}/estudiante/presupuesto`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function createPresupuesto(data: {
  universidad: string;
  carrera: string;
  presupuesto_semanal: number;
  presupuesto_mensual: number;
}): Promise<Presupuesto> {
  const res = await fetch(`${API_BASE_URL}/estudiante/presupuesto`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al crear presupuesto");
  }

  return result;
}

export async function updatePresupuesto(data: {
  presupuesto_semanal?: number;
  presupuesto_mensual?: number;
}): Promise<Presupuesto> {
  const res = await fetch(`${API_BASE_URL}/estudiante/presupuesto`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al actualizar presupuesto");
  }

  return result;
}

export function saveAuth(token: string, user: LoginResponse["usuario"]): void {
  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

export function clearAuth(): void {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
}

export function getAuth(): { token: string; user: LoginResponse["usuario"] } | null {
  const token = localStorage.getItem("token");
  const userStr = localStorage.getItem("user");

  if (!token || !userStr) return null;

  try {
    return { token, user: JSON.parse(userStr) };
  } catch {
    return null;
  }
}