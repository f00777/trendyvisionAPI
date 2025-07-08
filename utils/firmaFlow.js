import crypto from 'crypto'

export function crearFirma(params, secretKey) {
  const ordenado = Object.keys(params).sort().map(key => `${key}=${params[key]}`).join('&');
  return crypto.createHmac('sha256', secretKey).update(ordenado).digest('hex');
}