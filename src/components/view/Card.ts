import { ICard, ICardActions } from '../../types';
import { categoryTitle } from '../../utils/constants';
import { cloneTemplate, ensureElement } from '../../utils/utils';
import { Component } from '../base/component';
import { IEvents } from '../base/events';

export class Card extends Component<ICard> {
	protected _id: string;
	protected _image: HTMLImageElement;
	protected _title: HTMLHeadingElement;
	protected _description: HTMLParagraphElement;
	protected _category: HTMLSpanElement;
	protected _price: HTMLSpanElement;
	protected addButton: HTMLButtonElement;
	protected _index: HTMLSpanElement;

	constructor(
		protected template: HTMLTemplateElement,
		protected events: IEvents,
		action?: ICardActions
	) {
		super(cloneTemplate(template), events);

		this._title = ensureElement<HTMLHeadingElement>(
			'.card__title',
			this.container
		);
		this._price = ensureElement<HTMLSpanElement>(
			'.card__price',
			this.container
		);
		this._category = this.container.querySelector(
			'.card__category'
		) as HTMLSpanElement;
		this._image = this.container.querySelector(
			'.card__image'
		) as HTMLImageElement;
		this._description = this.container.querySelector(
			'.card__text'
		) as HTMLParagraphElement;
		this._index = this.container.querySelector(
			'.basket__item-index'
		) as HTMLSpanElement;
		this.addButton = this.container.querySelector(
			'.card__button'
		) as HTMLButtonElement;

		if (action?.onClick) {
			if (this.addButton) {
				this.addButton.addEventListener('click', action.onClick);
			} else {
				this.container.addEventListener('click', action.onClick);
			}
		}
	}

	// Устанавливает идентификатор карточки
	set id(id: string) {
		this._id = id;
	}

	// обновляет текст заголовка карточки
	set title(title: string) {
		this.setText(this._title, title);
	}

	// Обновляет изображение карточки
	set image(src: string) {
		this.setImage(this._image, src, this.title);
	}

	// Обновляет текст описания карточки
	set description(description: string) {
		this.setText(this._description, description);
	}

	// Обновляет категорию карточки
	set category(category: string) {
		this.setText(this._category, category);
		this._category.classList.add('card__category' + categoryTitle[category]);
	}
	
	
	// Обновляет цену карточки
	set price(price: string) {
		if (price) {
			this.setText(this._price, `${price} синапсов`);
		} else {
			this.setText(this._price, 'Бесценно');
			this.setDisabled(this.addButton, true);
		}
	}

	// обновляет текст кнопки
	set inBasket(state: boolean) {
		this.setText(this.addButton, state ? 'Удалить из корзины' : 'В корзину');
	}

	// Обновляет индекс карточки.
	set index(index: number) {
		this.setText(this._index, String(index));
	}
}
