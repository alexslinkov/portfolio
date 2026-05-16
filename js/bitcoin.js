/**
 * Определение текущей цены биткоина через публичное API CoinGecko.
 *
 * @param {string} [currency='usd'] — валюта котировки (usd, eur, rub, ...)
 * @returns {Promise<number>} цена биткоина в указанной валюте
 * @throws ошибка при недоступности API или сетевых проблемах
 */
async function getBitcoinPrice(currency = 'usd') {
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=bitcoin&vs_currencies=${encodeURIComponent(currency)}`;

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка HTTP ${response.status}: не удалось получить цену биткоина`);
    }

    const data = await response.json();

    if (!data.bitcoin || data.bitcoin[currency] === undefined) {
        throw new Error(`Валюта "${currency}" не поддерживается или данные отсутствуют`);
    }

    return data.bitcoin[currency];
}

// Альтернативный вариант через CoinDesk API (только USD, GBP, EUR)
async function getBitcoinPriceCoinDesk(currency = 'USD') {
    const url = 'https://api.coindesk.com/v1/bpi/currentprice.json';

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`Ошибка HTTP ${response.status}: не удалось получить цену биткоина`);
    }

    const data = await response.json();
    const upperCurrency = currency.toUpperCase();

    if (!data.bpi || !data.bpi[upperCurrency]) {
        throw new Error(`Валюта "${upperCurrency}" не поддерживается CoinDesk API (доступны: USD, GBP, EUR)`);
    }

    return data.bpi[upperCurrency].rate_float;
}

// Пример использования (раскомментировать для проверки в консоли браузера):
// getBitcoinPrice('usd').then(price => console.log('BTC/USD:', price));
// getBitcoinPrice('rub').then(price => console.log('BTC/RUB:', price));