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

export interface ReglaAhorro {
  id_regla: string;
  id_estudiante: string;
  tipo_regla: "redondeo" | "porcentaje" | "fijo";
  valor_regla: number;
  redondeo_a?: number;
  activa: boolean;
  fecha_creacion: string;
}

export async function getReglasAhorro(): Promise<ReglaAhorro[]> {
  const res = await fetch(`${API_BASE_URL}/estudiante/reglas-ahorro`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return [];

  return res.json();
}

export async function getReglaAhorro(id: string): Promise<ReglaAhorro | null> {
  const res = await fetch(`${API_BASE_URL}/estudiante/reglas-ahorro/${id}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function createReglaAhorro(data: {
  tipo_regla: "redondeo" | "porcentaje" | "fijo";
  valor_regla: number;
  redondeo_a?: number;
}): Promise<ReglaAhorro> {
  const res = await fetch(`${API_BASE_URL}/estudiante/reglas-ahorro`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al crear regla de ahorro");
  }

  return result;
}

export async function updateReglaAhorro(
  id: string,
  data: {
    valor_regla?: number;
    redondeo_a?: number;
    activa?: boolean;
  }
): Promise<ReglaAhorro> {
  const body = data.activa !== undefined
    ? { ...data, activa: data.activa ? "true" : "false" }
    : data;

  const res = await fetch(`${API_BASE_URL}/estudiante/reglas-ahorro/${id}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(body),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al actualizar regla de ahorro");
  }

  return result;
}

export async function deleteReglaAhorro(id: string): Promise<void> {
  const res = await fetch(`${API_BASE_URL}/estudiante/reglas-ahorro/${id}`, {
    method: "DELETE",
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) {
    const result = await res.json();
    throw new Error(result.message || "Error al eliminar regla de ahorro");
  }
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

export interface SaldosWallet {
  usuario_id: string;
  wallet_address: string;
  fiat_bs: number;
  puntos_ayni: number;
  credito_usdc: number;
  credito_eurc: number;
}

export async function getSaldos(): Promise<SaldosWallet | null> {
  const res = await fetch(`${API_BASE_URL}/transaccion/saldos`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return null;

  return res.json();
}

export interface TransaccionPago {
  id_usuario: string;
  id_comercio?: string;
  monto_pago: number;
  categoria_gasto: string;
}

export interface PagoQRResponse {
  monto_debitado: number;
  ahorro_generado: number;
  meta_afectada: string;
  meta_completada: boolean;
  puntos_ganados: number;
  tx_hash_gamificacion: string | null;
}

export async function postPagoQR(data: TransaccionPago): Promise<PagoQRResponse> {
  const res = await fetch(`${API_BASE_URL}/transaccion/pago-qr`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify(data),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al realizar pago");
  }

  return result;
}

export interface Beneficio {
  id: number;
  nombre: string;
  descripcion: string;
  tipo: "DESCUENTO" | "CASHBACK" | "PRODUCTO_GRATIS" | "SERVICIO";
  valor: number;
  comercioId: number;
  comercioNombre?: string;
  activo: boolean;
  fecha_creacion?: string;
}

export interface BeneficioCanjeado {
  id: number;
  beneficioId: number;
  usuarioId: string;
  fecha_canje: string;
  beneficio?: Beneficio;
}

export async function getBeneficios(): Promise<Beneficio[]> {
  const res = await fetch(`${API_BASE_URL}/beneficios`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return [];

  return res.json();
}

export async function getBeneficioById(id: number): Promise<Beneficio | null> {
  const res = await fetch(`${API_BASE_URL}/beneficios/${id}`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return null;

  return res.json();
}

export async function canjearBeneficio(id: number): Promise<{
  tokens_quemados: number;
  id_beneficio: number;
  tx_hash: string;
}> {
  const res = await fetch(`${API_BASE_URL}/beneficios/${id}/redeem`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      ...getAuthHeader(),
    },
    body: JSON.stringify({}),
  });

  const result = await res.json();

  if (!res.ok) {
    throw new Error(result.message || "Error al canjear beneficio");
  }

  return result;
}

export async function getMisBeneficiosCanjeados(): Promise<BeneficioCanjeado[]> {
  const res = await fetch(`${API_BASE_URL}/beneficios/redeemed`, {
    headers: { ...getAuthHeader() },
  });

  if (!res.ok) return [];

  return res.json();
}