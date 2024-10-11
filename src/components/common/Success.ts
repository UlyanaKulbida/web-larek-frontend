import { ISuccess } from '../../types';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Success extends Component<ISuccess> {
	protected submitButtonSuccessPay: HTMLButtonElement;
	protected _total: HTMLParagraphElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents
	) {
		super(cloneTemplate(template), events);

		this._total = ensureElement<HTMLParagraphElement>(
			'.order-success__description',
			this.container
		);
		this.submitButtonSuccessPay = ensureElement<HTMLButtonElement>(
			'.order-success__close',
			this.container
		);
		this.submitButtonSuccessPay.addEventListener('click', () =>
			this.events.emit('success:submit')
		);
	}

	set total(value: string) {
		this.setText(this._total, `Списано ${value || '0'} синапсов`);
	}

	get total(): string {
		return this._total.textContent?.replace(/\D/g, '') || '0';
	}
}
