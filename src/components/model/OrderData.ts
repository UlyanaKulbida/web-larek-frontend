import {
	FormErrors,
	IOrder,
	IOrderData,
	TOrderFormContacts,
	TOrderFormPayment,
} from '../../types';
import { ErrorStatus } from '../../utils/constants';
import { IEvents } from '../base/events';

export class OrderData implements IOrderData {
	protected _paymentData: TOrderFormPayment;
	protected _contactData: TOrderFormContacts;
	protected order: IOrder;
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		this.clearOrder();
		this.clearContacts();
	}

	// Установка платежной информации
	set paymentData(info: TOrderFormPayment) {
		this._paymentData.payment = info.payment;
		this._paymentData.address = info.address;
		if (this.checkValidation()) {
			this.events.emit('order:ready', this.paymentData);
		}
	}

	// Получения платежной информации
	get paymentData() {
		return this._paymentData;
	}

	// Установка контактной информации
	set contactData(info: TOrderFormContacts) {
		this._contactData.email = info.email;
		this._contactData.phone = info.phone;
		if (this.checkValidation()) {
			this.events.emit('сontacts:ready', this.contactData);
		}
	}

	// Получение контактной информации
	get contactData() {
		return this._contactData;
	}

	// Проверка валидности полей
	checkValidation() {
		const errors: typeof this.formErrors = {};
		if (!this._paymentData.payment) {
			errors.payment = ErrorStatus.EmptyPayment;
		}
		if (!this._paymentData.address) {
			errors.address = ErrorStatus.EmptyAddress;
		}
		if (!this._contactData.email) {
			errors.email = ErrorStatus.EmptyEmail;
		} else if (!this.validateEmail(this._contactData.email)) {
			errors.email = ErrorStatus.InvalidEmail;
		}
		if (!this._contactData.phone) {
			errors.phone = ErrorStatus.EmptyPhone;
		} else if (!this.validatePhone(this._contactData.phone)) {
			errors.phone = ErrorStatus.InvalidPhone;
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	// Проверка валидности электронной почты.
	validateEmail(email: string): boolean {
		const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
		return emailRegex.test(email);
	}

	// Проверка валидности телефонного номера
	validatePhone(phone: string): boolean {
		const phoneRegex =
			/^\s*(?:\+?(\d{1,3}))?[-. (]*(\d{3})[-. )]*(\d{3})[-. ]*(\d{4})(?: *x(\d+))?\s*$/;
		return phoneRegex.test(phone);
	}

	// Получение данных заказа
	getOrderData() {
		return this.order;
	}

	// Очистка платежной информации
	clearOrder() {
		this._paymentData = {
			address: '',
			payment: null,
		};
	}

	// Очистка контактной информации
	clearContacts() {
		this._contactData = {
			email: '',
			phone: '',
		};
	}
}
