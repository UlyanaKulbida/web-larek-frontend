// Интерфейс страницы 
export interface IPage {
  catalog: HTMLElement[];
  counterr: number;
  locked: boolean ; 
};

// Карточки товара
export interface ICard {
	id: string;
	description: string;
	image: string;
	title: string;
	category: string;
	price?: number;
	isInBasket: boolean;
	index: number;
};

// Продукт
export interface IProduct {
  id: string;
  image: string;
  title: string;
  description: string;
  category: string;
  price: number | null;
};

// Заказ
export interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: string | number;
  items: string[];
};

// Типы
export type PaymentMethod = 'card' | 'cash' | null;			// способ оплаты;
export type SuccessData = { id: string; total: string };	// успешный ответ при размещение заказа;
export type TOrderFormPayment = Pick<IOrder, 'payment' | 'address' | null>;  // форма вида оплаты и адреса доставки;
export type TOrderFormContacts = Pick<IOrder, 'email' | 'phone'>; // форма контактных данных;
export type FormErrors = Partial<Record<keyof IOrder, string>>;	// объект ошибок валидации формы;
export type TForm = { valid: boolean };	// валидация формы.

// Данные карточек
export interface ICardsData {
	cards: IProduct[];
	getCardId(cardId: string): IProduct | undefined;
};

// Данные заказа
export interface IOrderData {
	paymentData: TOrderFormPayment;
	contactData: TOrderFormContacts;
	checkValidation(): boolean;
	getOrderData(): IOrder;	
	clearOrder(): void;
	clearContacts(): void;
};

// Данные корзины
export interface IBasketData {
	cardsBasket: IProduct[];
	total: number;
	addProductBasket(product: IProduct): void;
	deleteProductBasket(id: string): void;
	clearBasket(): void;
	getTotal(): number;
	inBasket(productId: string): boolean;
	getProductsBasket(): IProduct[];
	getProductsIdBasket(): string[];
};

//Общая форма
export interface IForm {
	valid: boolean;
	errors: string;
};

// Форма для контактной информации
export interface IFormOfContact {
	email: string;
	phone: string;
};

// Форма для данных оплаты
export interface IFormOfPayment {
	payment: PaymentMethod | null;
	address: string;
}

// Успешное отображение заказа
export interface ISuccess {
	total: string;
};

//События клика 
export interface ICardActions {
  onClick(event: MouseEvent): void;
};

// API приложение
export interface IAppApi {
	getProducts(): Promise<IProduct[]>;
	getProductById(id: string): Promise<IProduct>;
	postOrder(order: IOrder): Promise<SuccessData>;
};