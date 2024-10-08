# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

## Данные и Типы данных

Отображение на странице
```
export interface IPage {
  catalog: HTMLElement[];  - контейнер c  карточками товаров
  counterr: number;        - счетчик товаров в корзине
  locked: boolean ;        - прокрутки страницы
};
```

Продукт
```
export interface IProduct {
  id: string;
  image: string;
  name: string;
  description: string;
  category: string;
  price: number | null;
};
```

Заказ
```
export interface IOrder {
  payment: PaymentMethod;
  email: string;
  phone: string;
  address: string;
  priceTotal: number | null;
  itemsCard: IProduct[];
};
```
События клика 
``` 
export interface ICardActions { 
  onClick(event: MouseEvent): void;
}
``` 

Способ оплаты
```
export type PaymentMethod = 'online' | 'offline';
```

Каталог продуктов главного экрана
```
export type TProductCatalog = Pick<IProduct, 'category' | 'name' | 'image' | 'price'>;
```

Попап Карточка продукта
```
export type TProductModalCard = Pick<IProduct, 'category' | 'name' | 'description' | 'image' | 'price'>;
```

Попап Данные заказа в козине
```
export type TOrderModalBasket = Pick<IProduct & IOrder, 'name' | 'price' | 'priceTotal'>;
```

Форма вида оплаты и адреса доставки
```
export type TOrderFormPayment = Pick<IOrder, 'payment' | 'address'>;
```

Форма контактных данных
```
export type TOrderFormContacts = Pick<IOrder, 'email' | 'phone'>; 
```

Попап успешного заказа
```
export type OrderModalSuccess = Pick<IOrder, 'priceTotal'>;
```

## Архитектура приложения 
В архитектуре проекта используется парадигма MVP с брокером событий, код приложения разделен на следующие слои  : 

- данные (Model) - отвечают за хранение и передачу данных;
- представление (View) - отвечает за отображение данных на странице;
- презентер (Presenter) - отвечает за связь  между представлением и данными;

### Базовый код

#### Класс Api
 Класс для работы с сетью, принимает в конструктор базовый адрес сервера и  объект с заголовками HTTP запросов для взаимодействия с бэкендом сервиса.

конструктор
 - `baseUrl` - параметр содержит базовый URL  для запросов API к серверу;
 - `options` - параметр по умолчанию равен пустому объекту. Данному параметру устанавливается св-во headers - заголовок со значением, указывающий, что данные отправляемые на сервер, будут в формате JSON. Это св-во используется для указания дополнительных  заголовков HTTP запросов (если содержит какие-либо заголовки, они будут добавлены к объекту заголовков, в противном случае будет добавлен только заголовок по умолчанию).

методы
 - `handleResponse` -  обработка ответа с сервера (преобразование тела ответа в JSON-объект);
 - `GET` - получение данных с сервера к указанному URI;
 - `POST` - отправка данных на сервер к указанному URI.


#### Класс EventEmitter
Используется в презентере как класc-посредник между слоями представление (View) и данные (Model) для обработки событий и в слоях приложения для генерации событий. Реализует интерфейс IEvents, в параметры конструктора ничего не передается

методы
 - `on` - установка обработчика на событие01
 - `off` - снятие обработчика с события
 - `emit` - инициирование события с данными
 - `onAll` - слушание всех событий
 - `offAll` - сброс всех обработчиков
 - `trigger` - создание коллбек триггера, генерирующего событие при вызове


#### Класс Component
Используется для создания компонент интерфейса пользователя, управляющих DOM-элементами и наследуется всеми классами из слоя представления

конструктор
 - container -  DOM-элемент куда будет помещен нужный компонент.

### Слой данных
#### Класс ProductData
Отвечает за хранение и логику работы с данными карточек продуктов.\
Конструктор принимает инстант брокера событий.\
данные полей:
```
 - _products: IProduct[]    - массив объектов карточек продуктов;
 - _preview: string | null  - id карточки, выбранной для просмотра в попапе; 
 - events: IEvents          - экземпляр класса `EventEmitter` для инициации событийпри изменении данных; 
```
 методы взаимодействия с данными:
```
 - getCardProduct(idCard: string): IProduct - возвращает карточку по ее id;
```
#### Класс BasketData
Отвечает за хранение и логику работы с данными карточек продуктов в корзине.\
Конструктор принимает инстант брокера событий.\
данные полей:
```
 - products:IProduct[]      - массив объектов карточек продуктов в корзине;  
```
 методы взаимодействия с данными:
```
 - addProduct(card: IProduct): void - добавляет продукт в начало списка товаров в корзине;
 - deleteProduct(idCard: string): void - удаляет продукт из списка товаров в корзине;
 - inBasket(idCard: string): boolean - проверяет продукт уже выбран/не выбран 
 - getProducts(): IProduct - получает массив товаров;
 - clearBasket(): void - очищает корзину от товаров;
```

#### Класс OrderData
Отвечает за хранение и логику работы с  заказом.\
Конструктор принимает инстант брокера событий.\
данные полей:
```
 - payment: PaymentMethod - выбор способа оплаты;
 - address: string  - адрес;
 - email: string    - e-mail;
 - phone: string    - телефон; 
```
 методы взаимодействия с данными:
```
 - setOrderPayment(userData: TOrderFormPayment): void - сохраняет поля в форме адреса доставки;;
 - setOrderContacts(userData: TOrderFormContacts): void - сохраняет поля в форме контактных данных;
 - checkOrderPaymentValidation(): boolean - валидирует поля ввода в форме адреса доставки;
 - checkOrderContactsValidation(): boolean - валидирует поля ввода в форме контактных данных;
```

### Слой представления
Классы этого слоя отвечают за отображение в нутри контейнера (DOM - элемент)передаваемых в них данных.

#### Класс Page
Класс расширяетинтерфейс IPage, используется для отображения главной страницы: логотипа, каталога товаров, иконки корзины и количество товаров в ней. Страница блокируется при открытии модального окна.

данные полей:
```
 - counter: HTMLElement - DOM элемент счетчика товаров в корзине
 - catalog: HTMLElement - DOM элемент контейнера c  карточками
 - basket: HTMLElement - DOM элемент значка корзины
```

#### Класс Modal
Отвечает за работу с модальными окнами. 

данные полей:
```
 - closeButton: HTMLButtonElement - DOM элемент кнопки закрытия попапа;
 - content: HTMLElement - DOM элемент с контентом папапа.
```
методы взаимодействия с данными:
```
 - open() - открывает попап;
 - close(): void - закрывает попап;
 - render(): HTMLElement - отрисовывает данные в попапе.
```

#### Класс Form
Отвечает за работу с формой заказа. 

данные полей:
```
 - submit: HTMLButtonElement - DOM элемент кнопки отправки данных формы
 - errors: HTMLElement - DOM элемент отображения ошибки валидации формы
```
методы взаимодействия с данными:
```
 - checkInputValidation(error: string) - проверяет валидацию формы;
 - clear(): void - очищает форму.
```

#### Класс Product
Класс описывает компоненту карточки товара, расширяет интерфейс IProduct.  Используется для отображения карточки в галлереи товаров, в модальном окне просмотра информации товара  и просмотре карточки товара и корзине.\
данные полей:
```
 - id: string -  идентификатор карточки продукта;
 - image: HTMLElement - элемент с изображение мпродукта;
 - name: HTMLElement - заголовок с названием продукта;
 - description: HTMLElement - элемент с описанием продукта;
 - category: HTMLElement - элемент с указанием категории продукта;
 - price: HTMLElement - элемент со значением стоимости товара;
 - addButton: HTMLButtonElement - кнопка добавления товара в корзину.
```
методы взаимодействия с данными:
```
 - setId(value: sting) - задает значение идентификатора продукта;
 - setCategory(value: string) - задает значение категории продукта;
 - setTitle(value: string) - задает значение названия продукта;
 - setImage(value: string) - задает URL для изображения продукта;
 - setDescription(value: string) - задает описание продукта;
 - setPrice(value: number) - задает значение стоимости продукта.
```

#### Класс OrderModalBasket
Отвечает за работу с корзиной, отражает информацию по ее содержимому в попапе, стоимости каждой единицы товара, дает возможность удалить товар, считает и показывает общую сумму заказа.  

данные полей:
```
 - index: HTMLElement - DOM элемент индекса товара в корзине
 - name: HTMLElement - DOM элемент названия продукта
 - price: HTMLElement - DOM элемент стоимости товара
 - button: HTMLButtonElement - DOM элемент кнопки удалить
```
методы взаимодействия с данными:
```
 - setCards - добавляет товары с список;
 - setTotal - считает общую стоимость товаров.
```

#### Класс OrderFormPayment
Отвечает за работу с формой вида оплаты и адреса доставки в попапе.

данные полей:
```
 - btnOnReceipt: HTMLButtonElement - кнопка "Онлайн оплаты";
 - btmOnLine: HTMLButtonElement - кнопка "При получении";
 - inputAdress: HTMLInputElement - инпут для ввода адреса доставки.
``` 
методы взаимодействия с данными:
```
 - changeActiveBtn - смена активности кнопок выбора оплаты товара;
 - getInputValue - возвращает введенный адрес.
```

#### Класс OrderFormContacts
Отвечает за работу с формой контактных данных в попапе.

данные полей:
```
 - inputEmail: HTMLInputElement - инпут для ввода e-mail.
 - inputPhone: HTMLInputElement - инпут для ввода телефона.
``` 
методы взаимодействия с данными:
```
 - changeActiveBtn - смена активности кнопок выбора оплаты товара;
 - getInputValue - возвращает введенный адрес.
```

#### Класс OrderModalSuccess
Отвечает за работу с попапом успешного заказа.

данные полей:
```
 - totalPrice: number - общей стоимость товаров;
 - btnSuccessActions: HTMLButtonElement - кнопка перехода на главную страницу.
``` 
методы взаимодействия с данными:
```
 - setPriceTotal(value: number) - отображает общую сумму в попапе успешного заказа.
```

### Слой коммуникации
#### Класс AppApi
Наследует класс Api и предоставаляет методы  взаимодействия с бэкендом сервиса для работы с продуктами и заказами. 

## Взаимодействие компонентов
Взаимодействие осуществляется с помощью событий которые генерирует брокер событий и обработчиков этих событий, описанных в `index.ts`

События изменения данных:

- `items:change` - изменение списка товаров;


Взаимодействие пользователя с интерфейсом

События карточек:
- `card:select` - выбор карточки для отображения в модальном окне;
- `card:add` - добавление товара в корзину;
- `card:remove` - удаление товара из корзины;

События корзины:
- `basket:changed` - изменение списка товаров в корзине;
- `basket:open` - открытие окна корзины;
- `order:open` - открытие формы заказа;
- `card:remove` - изменение товаров в корзине;

События оплаты:
- `paymentCard:changed` - изменение способа оплаты "Онлайн";
- `paymentCash:changed` - изменение способа оплаты "При получении";

События кнопок:
- `order:submit` - сабмит формы заказа;
- `contact:submit` - сабмит формы контакты;
- `success:close` - закрытие окна успешной покупки;

События попапа:
- `modal:open` - открытие модального окна;
- `modal:close` - закрытие модального окна.