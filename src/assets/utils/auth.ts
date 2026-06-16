

export function isTokenExpired(token: string | null): boolean {
  if (!token) return false; // sin token no es "expirado", simplemente no hay sesión

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch {
    return false; // si no se puede parsear, no bloqueamos
  }
}