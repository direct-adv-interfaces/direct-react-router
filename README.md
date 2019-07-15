# direct-react-router

## Как использовать

### Конфигурация

Конфигурация задает список роутов и алиасы для них. Также вам понадобится экземпляр `history`.

```ts
import { createBrowserHistory } from 'history';
import { RouterConfig } from 'direct-react-router';

const history = createBrowserHistory();

const config: RouterConfig = {
    routes: {
        PAGE1: '/p1/:login',
        PAGE2: '/p2'
    }
};
```

### Middleware

```ts
import { createRoutingMiddleware } from 'direct-react-router';
// ...
const routerMiddleware = createRoutingMiddleware(config, history);
// ...
const store = createStore(rootReducer, routerMiddleware);
```

Теперь при каждом изменении url будет генериироваться action, который вы можете обрабатывать любым нужным способом. В него приходит информация о новом URL и его параметрах + его alias в конфиге.

### Reducer + state

Вы можете подключить готовый редюсер, который будет обрабатывать события изменения URL и класть информацию в state. Также он отвечает за начальное состояние (начальный url).

```ts
import { RouterLocation, createRoutingReducer } from 'direct-react-router';

export interface State {
    location: RouterLocation;
    // ...
}

const rootReducer = combineReducers({
    location: createRoutingReducer(
        config,  // конфиг роутера
        history.location // начальный url
    ),
    // ...
});
```

### Ссылки

```tsx
import { Link } from 'direct-react-router';
// ...

render() {
    return <Link href='/p1/test?str=xxx'>page1</Link>;
}

/*
location: {
    pathname: '/p1/test',
    search: 'str=xxx',
    hash: '',
    key: 'PAGE1',
    params: {
        login: 'test'
    },
    query: {
        str: 'xxx'
    }
}
*/

```

### Генерация ссылок по ключам

```tsx
import { AdvancedLink } from 'direct-react-router';
// ...

render() {
    return <AdvancedLink routeKey='PAGE1' params={{ login: 'moo' }} >page1</AdvancedLink>;
}

/*
location: {
    pathname: '/p1/moo',
    search: '',
    hash: '',
    key: 'PAGE1',
    params: {
        login: 'moo'
    },
    query: { }
}
*/

```

Внимание! проверьте, что нет [лишних перерисовок](https://ru.reactjs.org/docs/context.html#caveats)

### Base path

Везде работаем с относительными путями.

- Для адресной строки — указать `basename` в `createBrowserHistory`.
- Для генерации ссылок — пробросить `basename` через контекст.

## Достоинства

- плоский список роутов
- парсит ключи и параметры - не нужны спец. компоненты для условного рендеринга
- не нужна генерация действий в componentDidMount
- можно использовать с react-router, а можно и не использовать)

## todo

- [ ] отписка от событий history
- [ ] exact

## cases

- SSR
- рендеринг адресов в ссылках, включая basename

## Подумать

- [x] импорт компонента ссылки из корня
- [x] устанавливать начальный path
- [x] location по умолчанию
- [x] редюсер
- [x] генерация ссылок по ключу????? (~~откуда брать конфиг? как вариант, можно коннектить каждую ссылку к стору и складывать конфиг в стор~~ конфиг передается через контекст)
- [ ] синхронизация в обратную сторону?
- [ ] exact
- [ ] base path
- [ ] приоритет роутов
- [ ] обрубать `?` в query string
- [ ] придумать, как задавать query string и hash для AdvancedLink
- [ ] придумать, как задавать ссылку на ту же страницу, но с другими параметрами
