# direct-react-router

## Как использовать

### Конфигурация

Конфигурация задает список роутов и алиасы для них. Также вам понадобится экземпляр `history`.

```ts
import { createBrowserHistory } from 'history';
import { RouterConfig } from 'direct-react-router';

const history = createBrowserHistory();

const config: RouterConfig = {
    routes: [
        { key: 'PAGE1', route: '/p1' },
        { key: 'PAGE2', route: '/p2/:login/count/:num' }
    ]
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
    return <Link href='/p2/test/count/12?aa=1&bb=2#xxx'>page1</Link>;
}

/*
location: {
    pathname: '/p2/test/count/12',
    search: '?aa=1&bb=2',
    hash: '#xxx',
    key: 'PAGE2',
    params: { login: 'test', num: '12' },
    query: { aa: '1', bb: '2' }
}
*/

```

### Генерация ссылок по ключам

```tsx
import { AdvancedLink } from 'direct-react-router';
// ...

render() {
    return (
        <Provider store={store}>
            <RouterContext.Provider value={{ config }}>
                ...
                <AdvancedLink routeKey='PAGE2' params={{ login: 'moo', num: '12' }} >page2</AdvancedLink>
                ...
            </RouterContext.Provider>
        </Provider>'
    );
}

/*
location: {
    pathname: '/p2/test/count/12',
    search: '',
    hash: '',
    key: 'PAGE2',
    params: { login: 'moo', num: '12' },
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
- настройки роутинга в одном месте
- можно использовать по частям (например, только middleware)
- парсит в адресах ключи и параметры, генерирует правильные url по ключам - не нужно завязываться в коде на конкретные url (в т.ч. не нужны спец. компоненты для условного рендеринга)
- не нужна генерация действий в componentDidMount
- можно использовать с react-router, а можно и не использовать)

## todo

- [x] импорт компонента ссылки из корня
- [x] устанавливать начальный path
- [x] location по умолчанию
- [x] редюсер
- [x] генерация ссылок по ключу????? (~~откуда брать конфиг? как вариант, можно коннектить каждую ссылку к стору и складывать конфиг в стор~~ конфиг передается через контекст)
- [x] обрубать `?` в query string
- [x] приоритет роутов - задаем в виде массива
- [ ] синхронизация в обратную сторону?
- [ ] exact
- [ ] base path
- [ ] придумать, как задавать query string и hash для AdvancedLink
- [ ] придумать, как задавать ссылку на ту же страницу, но с другими параметрами
- [ ] отписка от событий history
- [ ] query-string options

## cases

- SSR
- рендеринг адресов в ссылках, включая basename
