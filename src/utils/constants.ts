
export const API_ORIGIN = window.location.hostname === 'ulyanakulbida.github.io' ? 'https://larek-api.nomoreparties.co'  : process.env.API_ORIGIN;
export const API_URL = `${API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${API_ORIGIN}/content/weblarek`;

export const settings = {
};

export const categoryTitle: Record<string, string> = {
    'софт-скил': '_soft',
    'другое': '_other',
    'дополнительное': '_additional',
    'кнопка': '_button',
    'хард-скил': '_hard'
}

export const enum ErrorStatus {
	EmptyEmail = 'Не указан email',
    InvalidEmail = 'Не верный формат email',
	EmptyPhone = 'Не указан телефон',
    InvalidPhone = 'Не верный фрмат телефона',
	EmptyAddress = 'Не указан адрес',
	EmptyPayment = 'Не выбран способ оплаты',
};
