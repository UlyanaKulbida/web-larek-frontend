import { ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Modal extends Component<HTMLElement> {
	closeButton: HTMLButtonElement;
	content: HTMLDivElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container, events);

		this.closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this.content = ensureElement<HTMLDivElement>('.modal__content', container);

		this.closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this.content.addEventListener('click', (event) => event.stopPropagation());
	}

	// Открытие попапа
	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	// Закрытие попапа
	close() {
		this.container.classList.remove('modal_active');
		this.events.emit('modal:close');
	}

	// Замена содержимого попапа без необходимости перерисовывать весь компонент
	render(obj: HTMLElement): HTMLElement {
		this.content.replaceChildren(obj);
		return this.container;
	}
}
