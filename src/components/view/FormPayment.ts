import { IFormOfPayment, PaymentMethod, TOrderFormContacts } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { Form } from '../common/Form';

export class FormPayment
	extends Form<TOrderFormContacts>
	implements IFormOfPayment
{
	private static readonly CLASS_BUTTON_ACTIVE = 'button_alt-active';
	private static readonly SELECTOR_BUTTONS = '.order__buttons';
	private static readonly SELECTOR_ADDRESS = 'address';
	private static readonly SELECTOR_CARD = 'card';
	private static readonly SELECTOR_CASH = 'cash';
	private static readonly SELECTOR_ORDER_BUTTON = '.order__button';

	protected containerButtons: HTMLDivElement;
	protected paymentCard: HTMLButtonElement;
	protected paymentCash: HTMLButtonElement;
	protected _address: HTMLInputElement;
	protected orderButton: HTMLButtonElement;
	protected _payment: PaymentMethod | null;

	constructor(protected container: HTMLFormElement, events: IEvents) {
		super(container, events);
		this.initElements();
		this.initEventListeners();
	}

	private initElements(): void {
		this.containerButtons = ensureElement<HTMLDivElement>(
			FormPayment.SELECTOR_BUTTONS,
			this.container
		);
		this._address = this.container.elements.namedItem(
			FormPayment.SELECTOR_ADDRESS
		) as HTMLInputElement;
		this.paymentCard = this.container.elements.namedItem(
			FormPayment.SELECTOR_CARD
		) as HTMLButtonElement;
		this.paymentCash = this.container.elements.namedItem(
			FormPayment.SELECTOR_CASH
		) as HTMLButtonElement;
		this.orderButton = ensureElement<HTMLButtonElement>(
			FormPayment.SELECTOR_ORDER_BUTTON,
			this.container
		);
	}

	private initEventListeners(): void {
		this.orderButton.addEventListener('click', (evt) => {
			evt.preventDefault();
			this.events.emit('order:submit', {
				address: this._address.value,
				payment: this.payment,
			});
		});

		this.paymentCard.addEventListener('click', this.paymentClick.bind(this));
		this.paymentCash.addEventListener('click', this.paymentClick.bind(this));
	}

	private paymentClick(event: MouseEvent): void {
		const button = event.target as HTMLButtonElement;
		if (button) {
			this.payment = button.name as PaymentMethod;
			this.events.emit(`${this.container.name}:valid`);
		}
	}

	set address(value: string) {
		this._address.value = value;
	}

	get address(): string {
		return this._address.value;
	}

	get payment(): PaymentMethod | null {
		return this._payment;
	}

	protected set payment(value: PaymentMethod | null) {
		this._payment = value;
		this.paymentCard.classList.toggle(
			FormPayment.CLASS_BUTTON_ACTIVE,
			this.payment === 'card'
		);
		this.paymentCash.classList.toggle(
			FormPayment.CLASS_BUTTON_ACTIVE,
			this.payment === 'cash'
		);
	}
}
