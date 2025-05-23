export function esNumerico(num){
    return !isNaN(num) && !isNaN(parseFloat(num));
}

export function esEmailValido(email) {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}
