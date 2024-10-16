import { IPage } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Page extends Component<IPage> {
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLButtonElement;
	protected _counter: HTMLSpanElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._catalog = ensureElement<HTMLElement>('.gallery', container);
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper', container);
		this._basket = ensureElement<HTMLButtonElement>(
			'.header__basket',
			container
		);
		this._counter = ensureElement<HTMLSpanElement>(
			'.header__basket-counter',
			this._basket
		);

		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Установка значения счетчика корзины
	set counter(value: number) {
		this.setText(this._counter, String(value) || '');
	}

	// Установка элементов каталога
	set catalog(items: HTMLElement[]) {
		if (items) {
			this._catalog.replaceChildren(...items);
		} else {
			this._catalog.innerHTML = '';
		}
	}

	// Блокировка и разблокировка страницы
	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
