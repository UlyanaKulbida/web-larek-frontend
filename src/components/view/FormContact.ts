import { IFormOfContact, TOrderFormContacts } from '../../types';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class FormContacts
	extends Form<TOrderFormContacts>
	implements IFormOfContact
{
	private static readonly SELECTOR_EMAIL = 'email';
	private static readonly SELECTOR_PHONE = 'phone';

	protected inputEmail: HTMLInputElement;
	protected inputPhone: HTMLInputElement;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.initElements();
	}

	private initElements(): void {
		this.inputEmail = this.container.elements.namedItem(
			FormContacts.SELECTOR_EMAIL
		) as HTMLInputElement;
		this.inputPhone = this.container.elements.namedItem(
			FormContacts.SELECTOR_PHONE
		) as HTMLInputElement;

		if (!this.inputEmail || !this.inputPhone) {
			throw new Error('Элементы email и phone не найдены');
		}
	}

	// Устанавливает значение поля телефона
	set phone(value: string) {
		this.inputPhone.value = value;
	}

	// Возвращает значение поля телефона
	get phone(): string {
		return this.inputPhone.value;
	}

	// Устанавливает значение поля электронной почты
	set email(value: string) {
		this.inputEmail.value = value;
	}

	// Возвращает значение поля электронной почты
	get email(): string {
		return this.inputEmail.value;
	}
}
