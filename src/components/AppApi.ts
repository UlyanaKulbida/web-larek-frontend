import { IAppApi, IOrder, IProduct, SuccessData } from '../types';
import { Api, ApiListResponse } from './base/api';

export class AppApi extends Api implements IAppApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string, options?: RequestInit) {
		super(baseUrl, options);
		this.cdn = cdn;
	}

	// Метод получения списка продуктов с сервера
	getProducts() {
		return this.get('/product').then((cards: ApiListResponse<IProduct>) => {
			return cards.items.map((item) => {
				return { ...item, image: this.cdn + item.image };
			});
		});
	}

	// Метод получения информации о продукте по его id
	getProductById(id: string) {
		return this.get('/product/' + id).then((product: IProduct) => {
			return { ...product, image: this.cdn + product.image };
		});
	}
	// Метод отправки заказа на сервер
	postOrder(order: IOrder) {
		return this.post('/order', order).then((success: SuccessData) => {
			return success;
		});
	}
}
