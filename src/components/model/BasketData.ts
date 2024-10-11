import { IBasketData, IProduct } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

// Управление данными корзины покупок
export class BasketData extends Model implements IBasketData {
	protected _cardsBasket: IProduct[];
	protected _total: number;

	constructor(protected events: IEvents) {
		super(events);
		this.clearBasket();
	}

	// Возвращает защищенное св-во _total
	get total() {
		return this._total;
	}

	// Возвращает защищенное св-во _cardsBasket
	get cardsBasket() {
		return this._cardsBasket;
	}

	// Обновляет и генерирует событие при изменении корзины
	protected set cardsBasket(cardsBasket: IProduct[]) {
		this._cardsBasket = cardsBasket;
		this.events.emit('basket:changed', this.cardsBasket);
	}

	// Добавляет продукт, если его еще нет в корзине
	addProductBasket(product: IProduct) {
		if (!this.inBasket(product.id)) {
			this.cardsBasket = [...this.cardsBasket, product];
		}
	}

	// Удаляет продукт из корзины,
	// отфильтровывая продукт с указанным идентификатором
	deleteProductBasket(id: string) {
		this.cardsBasket = this.cardsBasket.filter((cards) => cards.id !== id);
	}

	// Удаляет все продукты из корзины
	// и сбрасывает общее количество
	clearBasket() {
		this.cardsBasket = [];
		this._total = 0;
	}

	// Вычисляет общую цену всех продуктов в корзине
	getTotal() {
		return this.cardsBasket.reduce((res, current) => {
			return res + current.price;
		}, 0);
	}

	// Проверяет, есть ли в корзине продукт по его id
	inBasket(productId: string): boolean {
		const cardId = this.cardsBasket.find((product) => product.id === productId);
		return cardId !== undefined;
	}

	// Возвращает товары находящиеся в корзине
	getProductsBasket(): IProduct[] {
		return this.cardsBasket.filter((item) => this.inBasket(item.id));
	}

	// Возвращает товары находящиеся в корзине
	getProductsIdBasket(): string[] {
		return this.cardsBasket
			.filter((card) => card.price > 0)
			.map((card) => card.id);
	}
}
