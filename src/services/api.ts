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

export interface LoginResponse {
  access_token: string;
  usuario: {
    id_usuario: string;
    nombre: string;
    correo: string;
    tipo_usuario: string;
    estado: string;
  };
}

export interface RegisterResponse {
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

export interface MetaAhorro {
  id_meta: string;
  id_estudiante: string;
  nombre_meta: string;
  monto_objetivo: number;
  monto_actual: number;
  fecha_inicio: string;
  fecha_limite: string;
  estado_meta: "activa" | "pausada" | "completada";
  porcentaje_avance: number;
}

export async function login(data: LoginData): Promise<LoginResponse> {
  const res = await fetch(`${API_BASE_URL}/user/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });

  const result: LoginResponse = await res.json();

  if (!res.ok) {
    throw new Error("Credenciales incorrectas");
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

export async function getMetasAhorro(): Promise<MetaAhorro[]> {
  const res = await fetch(`${API_BASE_URL}/estudiante/meta-ahorro`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return [];

  return res.json();
}

export async function getMetaAhorro(id: string): Promise<MetaAhorro | null> {
  const res = await fetch(`${API_BASE_URL}/estudiante/meta-ahorro/${id}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function createMetaAhorro(data: {
  nombre_meta: string;
  monto_objetivo: number;
  fecha_limite: string;
}): Promise<MetaAhorro> {
  const res = await fetch(`${API_BASE_URL}/estudiante/meta-ahorro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al crear meta de ahorro");
  }

  return result;
}

export async function updateMetaAhorro(
  id: string,
  data: {
    nombre_meta?: string;
    monto_objetivo?: number;
    estado_meta?: "activa" | "pausada";
  }
): Promise<MetaAhorro> {
  const res = await fetch(`${API_BASE_URL}/estudiante/meta-ahorro/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al actualizar meta de ahorro");
  }

  return result;
}

export async function deleteMetaAhorro(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/estudiante/meta-ahorro/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Error al eliminar meta de ahorro");
  }
}

export interface Comercio {
  id_comercio: string;
  id_usuario: string;
  nombre_comercio: string;
  rubro: string;
  ubicacion: string;
  zona: string;
  universidad_cercana: string;
  tipo_comercio: string;
  horario_apertura: string;
  horario_cierre: string;
  fecha_registro: string;
  score_actual: number | null;
  nivel_riesgo_actual: string | null;
  estado: string;
}

export async function getComercio(): Promise<Comercio | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/comercio/profile`, {
      headers: { ...getAuthHeader() },
    });

    if (res.status === 404) return null;
    if (!res.ok) return null;

    return res.json();
  } catch {
    return null;
  }
}

export async function createComercio(data: {
  nombre_comercio: string;
  rubro: string;
  ubicacion: string;
  zona: string;
  universidad_cercana: string;
  tipo_comercio: string;
  horario_apertura: string;
  horario_cierre: string;
}): Promise<Comercio> {
  const res = await fetch(`${API_BASE_URL}/comercio`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al crear comercio");
  }

  return result;
}

export async function updateComercio(data: Partial<{
  nombre_comercio: string;
  rubro: string;
  ubicacion: string;
  zona: string;
  universidad_cercana: string;
  tipo_comercio: string;
  horario_apertura: string;
  horario_cierre: string;
}>): Promise<Comercio> {
  const res = await fetch(`${API_BASE_URL}/comercio/profile`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al actualizar comercio");
  }

  return result;
}