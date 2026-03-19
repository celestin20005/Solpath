const TAUX_BASE = 10;

const COEFFICIENTS = {
  basic:    1.20,
  standard: 1.00,
  premium:  0.85
};

const PLAFONDS = {
  basic:    100,
  standard: 300,
  premium:  1000
};

function calculerCoins(kwh, gamme) {
  const coefficient = COEFFICIENTS[gamme] || 1.00;
  return Math.floor(kwh * TAUX_BASE * coefficient);
}

function coinsEnFCFA(coins) {
  return coins * 5;
}

function estDansLesLimites(kwh, gamme) {
  return kwh <= (PLAFONDS[gamme] || 300);
}

module.exports = { calculerCoins, coinsEnFCFA, estDansLesLimites };