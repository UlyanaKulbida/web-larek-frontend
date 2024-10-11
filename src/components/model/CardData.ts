import { ICardsData, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

export class CardData extends Model implements ICardsData {
	protected _cards: IProduct[];

	constructor(protected events: IEvents) {
		super(events);
		this._cards = [];
	}

	// Устанавливает новый массив карт и генерирует событие при изменении карточек
	set cards(value: IProduct[]) {
		this._cards = value;
		this.emitChanges('cards:changed', this._cards);
	}

	// Возвращает текущий массив карт
	get cards() {
		return this._cards;
	}

	// Возвращает карту по ее идентификатору
	getCardId(cardId: string): IProduct | undefined {
		const product = this._cards.find((item) => item.id === cardId);

		if (!product) throw Error(`Не найден продукт с id ${cardId}`);
		return product;
	}
}
