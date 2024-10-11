import { IForm, TForm } from '../../types';
import { ensureAllElements, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Form<T> extends Component<TForm> implements IForm {
	protected _inputs: HTMLInputElement[];
	protected _submit: HTMLButtonElement;
	protected _errors: HTMLSpanElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container, events);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			container
		);

		this._inputs = ensureAllElements<HTMLInputElement>(
			'.form__input',
			container
		);

		this._errors = ensureElement<HTMLSpanElement>('.form__errors', container);

		this.container.addEventListener('submit', (e: Event) => {
			e.preventDefault();
			this.events.emit(`${this.container.name}:submit`);
		});

		this._inputs.forEach((input) => {
			input.addEventListener('input', () =>
				this.events.emit(`${this.container.name}:valid`)
			);
		});
	}

	//  Устанавливает состояние кнопки отправки (включена или отключена)
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	// Устанавливает текст сообщения об ошибке
	set errors(value: string) {
		this.setText(this._errors, value);
	}

	render(data: Partial<T> & TForm): HTMLElement {
		const { valid, ...other } = data;
		this.valid = valid;
		return super.render(other);
	}
}
