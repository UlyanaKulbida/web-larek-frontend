import './scss/styles.scss'; // Стили

// Компоненты
import { AppApi } from './components/AppApi';
import { EventEmitter } from './components/base/events';
import { Modal } from './components/common/Modal';
import { Success } from './components/common/Success';

// Модели
import { BasketData } from './components/model/BasketData';
import { CardData } from './components/model/CardData';
import { OrderData } from './components/model/OrderData';

// Представления
import { Basket } from './components/view/Basket';
import { Card } from './components/view/Card';
import { FormContacts } from './components/view/FormContact';
import { FormPayment } from './components/view/FormPayment';
import { Page } from './components/view/Page';

// Типы
import { IOrder, IProduct } from './types';

// Утилиты
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';

// Инициализация EventEmitter
const events = new EventEmitter();

const ensureTemplate = (selector: string): HTMLTemplateElement =>
	ensureElement<HTMLTemplateElement>(selector);
const ensureContainer = (selector: string): HTMLElement =>
	ensureElement<HTMLElement>(selector);

// Загрузка шаблонов
const cardCatalogTemplate = ensureTemplate('#card-catalog');
const templateCardPreview = ensureTemplate('#card-preview');
const templateCardBasket = ensureTemplate('#card-basket');
const templateBasket = ensureTemplate('#basket');
const templatePayment = ensureTemplate('#order');
const templateContacts = ensureTemplate('#contacts');
const templateSuccess = ensureTemplate('#success');

// Инициализация контейнеров
const containerPage = ensureContainer('.page');
const containerModal = ensureElement<HTMLDivElement>('#modal-container');

// Инициализация API
const api = new AppApi(CDN_URL, API_URL);

// Экземпляры классов слоя модели
const cardsData = new CardData(events);
const basketData = new BasketData(events);
const orderData = new OrderData(events);

// Экземпляры классов слоя представлений
const page = new Page(containerPage, events);
const modal = new Modal(containerModal, events);
const basket = new Basket(templateBasket, events);
const success = new Success(templateSuccess, events);
const formOrder = new FormPayment(cloneTemplate(templatePayment), events);
const formContacts = new FormContacts(cloneTemplate(templateContacts), events);

// Загрузка продуктов
api
	.getProducts()
	.then((cards) => {
		cardsData.cards = cards;
	})
	.catch(console.error);

// ОБЩИЕ ФУНКЦИИ РЕНЕДЕРИНГА

// функцию для рендеринга элементов
function renderModal(content: HTMLElement) {
	modal.render(content);
}

// рендеринг карточек товаров
function renderCatalog(products: IProduct[]) {
	page.catalog = products.map((product) =>
		new Card(cardCatalogTemplate, events, {
			onClick: () => events.emit('preview:selected', product),
		}).render(product)
	);
}

// рендеринг предпросмотра карточки
function renderPreview(product: IProduct) {
	const cardPreview = new Card(templateCardPreview, events, {
		onClick: () => events.emit('preview:submit', product),
	}).render({
		...product,
		inBasket: basketData.inBasket(product.id),
	});
	renderModal(cardPreview);
}

// рендеринг корзины
function renderBasket() {
	const basketContent = basket.render({
		total: basketData.getTotal(),
		list: basketData.cardsBasket.map((product: IProduct, index: number) => {
			const card = new Card(templateCardBasket, events, {
				onClick: () => events.emit('basket:delete', product),
			});
			return card.render({
				title: product.title,
				id: product.id,
				price: product.price,
				index: ++index,
			});
		}),
	});
	renderModal(basketContent);
}

// ОБРАБОТКА СОБЫТИЙ
//открытие и закрытие модальных окон
const toggleModal = (isOpen: boolean) => {
	page.locked = isOpen;
};

events.on('modal:open', () => toggleModal(true));
events.on('modal:close', () => toggleModal(false));

// обновление карточек
events.on('cards:changed', renderCatalog);

// выбор карточки
events.on('preview:selected', (product: IProduct) => {
	renderPreview(product);
	modal.open();
});

// обработка корзины
events.on('basket:changed', () => {
	page.counter = basketData.cardsBasket.length;
});

events.on('basket:delete', (data: IProduct) => {
	basketData.deleteProductBasket(data.id);
	renderBasket();
});

events.on('basket:open', () => {
	renderBasket();
	modal.open();
});

// оформление заказа
events.on('basket:submit', () => {
	orderData.clearOrder();
	renderModal(formOrder.render({ valid: false, ...orderData.paymentData }));
});

// добавление и удаление товаров из корзины
events.on('preview:submit', (product: IProduct) => {
	if (basketData.inBasket(product.id)) {
		basketData.deleteProductBasket(product.id);
		renderPreview(product);
	} else {
		basketData.addProductBasket(product);
		renderPreview(product);
	}
});

// Валидации и ошибок
const validateOrderData = () => {
	orderData.paymentData = {
		payment: formOrder.payment,
		address: formOrder.address,
	};
};

const validateContactData = () => {
	orderData.contactData = {
		email: formContacts.email,
		phone: formContacts.phone,
	};
};

events.on('order:valid', validateOrderData);
events.on('contacts:valid', validateContactData);

events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	formOrder.valid = !(payment || address);
	formContacts.valid = !(email || phone);
	formOrder.errors = Object.values({ payment, address })
		.filter(Boolean)
		.join('; ');
	formContacts.errors = Object.values({ phone, email })
		.filter(Boolean)
		.join('; ');
});

// ввод контактных данных
events.on('order:submit', () => {
	orderData.clearContacts();
	renderModal(formContacts.render({ valid: false, ...orderData.contactData }));
});

// Отправка заказа
events.on('contacts:submit', () => {
	const orderDetails = {
		...orderData.contactData,
		...orderData.paymentData,
		items: basketData.getProductsIdBasket(),
		total: basketData.getTotal(),
	};

	api
		.postOrder(orderDetails)
		.then((result) => {
			orderData.clearOrder();
			orderData.clearContacts();
			basketData.clearBasket();
			renderModal(success.render(result));
		})
		.catch(console.error);
});

// Закрытие успешного сообщения
events.on('success:submit', () => modal.close());
