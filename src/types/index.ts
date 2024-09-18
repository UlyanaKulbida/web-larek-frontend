// Главная страница

export type PaymentMethod = 'online' | 'offline';

// Отображение на странице

export interface IPage {
  catalog: HTMLElement[];   // контейнер c  карточками товаров
  counterr: number;         // счетчик товаров в корзине
  locked: boolean ;         //прокрутки страницы
};

//Карточка Продукта

export interface IProduct {
    id: string;
    image: string;
    name: string;
    description: string;
    category: string;
    prise: number | null;
    inBasket: boolean;
};

// Корзина

export interface IBasket{
  items: string[];    //массив строк с товарами
  total: number;      //общая стоимость товаров
};

//Форма вида оплаты и адреса

interface IOrderForm {
  payment: PaymentMethod;
  address: string;
}

//Данные заказа

export interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  total: number | null;
  items: string[];
};

// Форма контактных данных

interface IContactsForm {
  email: string;
  phone: string;
}

// Форма успешного заказа

export interface IOrderResult {
  id: string;
  total: number;
}