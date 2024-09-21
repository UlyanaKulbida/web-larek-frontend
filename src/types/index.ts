
// Отображение на странице
export interface IPage {
  catalog: HTMLElement[];   // контейнер c  карточками товаров
  counterr: number;         // счетчик товаров в корзине
  locked: boolean ;         //прокрутки страницы
};

// Продукт
export interface IProduct {
  id: string;
  image: string;
  name: string;
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
  priceTotal: number | null;
  itemsCard: IProduct[];
};

export type PaymentMethod = 'online' | 'offline'; // Способ оплаты
export type TProductCatalog = Pick<IProduct, 'category' | 'name' | 'image' | 'price'>;  // Каталог продуктов главного экрана
export type TProductModalCard = Pick<IProduct, 'category' | 'name' | 'description' | 'image' | 'price'>;  // Попап Карточка продукта
export type TOrderModalBasket = Pick<IProduct & IOrder, 'name' | 'price' | 'priceTotal'>; // Попап Данные заказа в корзине
export type TOrderFormPayment = Pick<IOrder, 'payment' | 'address'>;  // Форма вида оплаты и адреса доставки
export type TOrderFormContacts = Pick<IOrder, 'email' | 'phone'>; // Форма контактных данных
export type TOrderModalSuccess = Pick<IOrder, 'priceTotal'>;  // Попап успешного заказа

// Массив продуктов
export interface IProductData {
  products: IProduct[];
  preview: string | null;
  getCardsProduct: IProduct[];
  getCardProduct(idCard: string): IProduct;
};

// Массив данных в корзине
export interface IBasketData {
  products: IProduct[];
  addProduct(card: IProduct): void;
  deleteProduct(idCard: string): void;
  inBasket(idCard: string): boolean;
  getProducts(): IProduct;
  clearBasket(): void;
};

// Массив вида оплаты и контактных данных
export interface IOrderData {
  payment: PaymentMethod;
  address: string;
  email: string;
  phone: string;
  setOrderPayment(userData: TOrderFormPayment): void;
  setOrderContacts(userData: TOrderFormContacts): void;
  checkOrderPaymentValidation(): boolean;
  checkOrderContactsValidation(): boolean;
};

//События клика 
export interface ICardActions {
  onClick(event: MouseEvent): void;
}