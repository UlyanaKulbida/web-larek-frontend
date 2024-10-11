import { IEvents } from './events';

/**
 * Базовый компонент
 */
export abstract class Component<T> {
	protected constructor(
		protected readonly container: HTMLElement,
		protected events?: IEvents
	) {
		// Учитывайте что код в конструкторе исполняется ДО всех объявлений в дочернем классе
	}

	// Сменить статус блокировки
	setDisabled(element: HTMLElement, state: boolean) {
		if (element) {
			if (state) element.setAttribute('disabled', 'disabled');
			else element.removeAttribute('disabled');
		}
	}

	// Установить текстовое содержимое
	protected setText(element: HTMLElement, value: unknown) {
		if (element) {
			element.textContent = String(value);
		}
	}

	// Установить изображение с алтернативным текстом
	protected setImage(element: HTMLImageElement, src: string, alt?: string) {
		if (element) {
			element.src = src;
			if (alt) {
				element.alt = alt;
			}
		}
	}

	// Вернуть корневой DOM-элемент
	render(data?: Partial<T>): HTMLElement {
		Object.assign(this as object, data ?? {});
		return this.container;
	}
}
