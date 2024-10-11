export const API_URL = `${process.env.API_ORIGIN}/api/weblarek`;
export const CDN_URL = `${process.env.API_ORIGIN}/content/weblarek`;

export const settings = {
};

export const categoryTitle = new Map([
	['софт-скилл', 'card__category_soft'],
	['хард-скилл', 'card__category_hard'],
	['другое', 'card__category_other'],
	['дополнительное', 'card__category_additional'],
	['кнопка', 'card__category_button'],
]);

export const enum ErrorStatus {
	EmptyEmail = 'Не указан email',
    InvalidEmail = 'Не верный формат email',
	EmptyPhone = 'Не указан телефон',
    InvalidPhone = 'Не верный фрмат телефона',
	EmptyAddress = 'Не указан адрес',
	EmptyPayment = 'Не выбран способ оплаты',
};
