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
        PAGE1: '/p1',
        PAGE2: '/p2/:login/count/:num'
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
    const href = '/p2/test/count/12?aa=1&bb=2#xxx';
    return <Link href={href}>page1</Link>;
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
                <AdvancedLink
                    routeKey='PAGE2'
                    params={{ login: 'test', num: '12' }}
                    query={{ aa: '1', bb: '2' }}
                    hash='#xxx'
                >
                    page2
                </AdvancedLink>
                ...
            </RouterContext.Provider>
        </Provider>
    );
}

/*
href:
    /p2/test/count/12?aa=1&bb=2#xxx
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

Внимание! проверьте, что нет [лишних перерисовок](https://ru.reactjs.org/docs/context.html#caveats)

### Base path

Везде работаем с относительными путями.

- Для адресной строки — указать `basename` в `createBrowserHistory`.
- Для генерации ссылок — пробросить `basename` через контекст.

### Генерировать action при открытии страницы

Middleware генерирует экшены при изменении url в адресной строке. При открытии страницы экшен с текущим url по умолчанию не генерируется. Если он вам нужен, сгенерируйте его руками.

```ts
import { parseLocation, changeLocation } from 'direct-react-router';
// ...

const routeLoaction: RouterLocation = parseLocation(config, history.location);
store.dispatch(changeLocation(parsed));
```

## Достоинства

- плоский список роутов → всегда `exact === true` → порядок роутов не важен (если совпадает несколько → ошибка)
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
- [x] придумать, как задавать query string и hash для AdvancedLink
- [х] exact
- [ ] base path
- [ ] выключать spa переходы через пропсы
- [ ] query-string options

## подумать

- [ ] задавать тип ключа
- [ ] проверить, что приходит в action, если адрес - url encoded
- [ ] подумать, нужно ли кодировать hash при генерации url
- [ ] проверить, как ведет себя звездочка в роутах
- [ ] когда происходит отписка от событий history
- [ ] синхронизация в обратную сторону (store => url)?

## сделать примеры

- SSR
- рендеринг адресов в ссылках, включая basename
