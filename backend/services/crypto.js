const coinMap = {
  btc: "bitcoin",
  eth: "ethereum",
};

export async function getCryptoPrice(coin, currency = "usd") {
  try {
    coin = coin.toLowerCase();
    currency = currency.toLowerCase();

    const normalizedCoin = coinMap[coin] || coin;

    const res = await fetch(
      `https://api.coingecko.com/api/v3/simple/price?ids=${normalizedCoin}&vs_currencies=${currency}`,
    );

    const data = await res.json();
    return data[normalizedCoin]?.[currency];
  } catch {
    return null;
  }
}

export function resolveCoin(lowerMsg) {
  return lowerMsg.includes("eth") ? "ethereum" : "bitcoin";
}

export function resolveCurrency(lowerMsg) {
  return lowerMsg.includes("inr") ? "inr" : "usd";
}
