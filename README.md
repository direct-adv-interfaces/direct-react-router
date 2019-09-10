# direct-react-router

[![NPM version][npm-image]][npm-url]
[![Bundle size][bundlephobia-image]][bundlephobia-url]
[![Build status][travis-image]][travis-url]
[![License][license-image]][license-url]

## Достоинства

- **redux first** → не зависит от жизненного цикла компонентов → нет сайд-эффектов в компонентах (например, больше не нужна генерация действий в `componentDidMount`)
- **настройки роутинга в одном месте** → в конфиге плоский список роутов и алиасы для них
- **алиасы вместо url** → роутер парсит алиасы роутов в адресах и генерирует по алиасам правильные url → не нужно завязываться в коде на конкретные url (в т.ч. не нужны спец. компоненты для условного рендеринга)
- **можно использовать по частям** (например, только middleware) → расширяемость (например, можно использовать с `react-router`, а можно и не использовать 😋)
- **поддержка TypeScript из коробки**

## Как установить

```sh
npm i direct-react-router
```

Зависимости: `react ^16.8.6`, `redux ^4.0.1`, `react-redux ^7.0.0`, `history ^4.9.0`.

## Как использовать

### Конфигурация

Конфигурация задает плоский список роутов и алиасы для них. Также вам понадобится экземпляр `history`.

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

Синтакис шаблонов путей:

```ts
const config: RouterConfig = {
    routes: {
        EXAMPLE1: '/:foo/:bar',  // named parameters
        EXAMPLE2: '/:foo/:bar?', // optional parameters
        EXAMPLE3: '/:foo*',      // zero or more
        EXAMPLE4: '/:foo+',      // one or more

        // see details: https://npmjs.org/package/path-to-regexp
    }
};
```

> При сравнении всегда `exact === true`, поэтому порядок описания роутов не важен. Если текущему URL соответствует несколько роутов, будет исключение.

### Middleware

```ts
import { createRoutingMiddleware } from 'direct-react-router';
// ...
const routerMiddleware = createRoutingMiddleware(config, history);
// ...
const store = createStore(rootReducer, routerMiddleware);
```

Теперь при каждом изменении url будет генериироваться action, который вы можете обрабатывать любым нужным способом. В него приходит информация о новом URL и его параметрах + его alias в конфиге.

```ts
/*
{
    type: '@@direct-react-router/LOCATION_CHANGED',
    location: {
        key: '<route key>',
        pathname: '...',
        search: '...',
        hash: '...',
        params: { ... },
        query: { ... }
    },
    action: 'PUSH'
}
*/
```

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
import { AdvancedLink, RouterContext } from 'direct-react-router';
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

### History action & state

Когда происходит action, добавляющий url в history (при клике по ссылке или при генерации вручную), по умолчанию используется действие `PUSH`. Вы можете генерировать действие `REPLACE`, указав необязательный параметр `replace` (`boolean`). Также вы можете указать необязательный параметр `state` (`any`). Значение, поля state будет передано в поле `state` экшена `LOCATION_CHANGED`.

```ts
import { callHistoryMethod, Link } from 'direct-react-router';
// ...

// генерируем экшен вручную
store.dispatch(callHistoryMethod('/my/path', { replace: true, state: 'xxx' }))

// генерируем экшен через ссылку
render() {
    return <Link href='/my/path' replace={true} state={'xxx'}>text</Link>;
}

/*
{
    type: '@@direct-react-router/LOCATION_CHANGED',
    location: {
        ...
        state: 'xxx'
    },
    action: 'REPLACE'
}
*/
```

### Base path

Везде работаем с относительными путями.

- Для адресной строки — указать `basename` в `createBrowserHistory`.
- Для генерации ссылок — пробросить `basename` через контекст.

```tsx
import { Link, RouterContext } from 'direct-react-router';
// ...
const basename = 'your/base/path';

// учитываем basename при обработке url
const history = createBrowserHistory({ basename });


render() {
    return (
        // учитываем basename при генерации url для ссылок
        <RouterContext.Provider value={{ basename }}>
            ...
            <Link href='/test/xxx' />
            ...
        </RouterContext.Provider>
    );
}

/*
href:
    /your/base/path/test/xxx
location: {
    pathname: '/test/xxx',
    ...
}
*/
```

### Генерировать action при открытии страницы

Middleware генерирует экшены при изменении url в адресной строке. При открытии страницы экшен с текущим url по умолчанию не генерируется. Если он вам нужен, сгенерируйте его руками.

```ts
import { parseLocation, changeLocation } from 'direct-react-router';
// ...

const routerLocation: RouterLocation = parseLocation(config, history.location);
store.dispatch(changeLocation(routerLocation));
```

## todo

- [x] импорт компонента ссылки из корня
- [x] устанавливать начальный path
- [x] location по умолчанию
- [x] редюсер
- [x] генерация ссылок по ключу????? (~~откуда брать конфиг? как вариант, можно коннектить каждую ссылку к стору и складывать конфиг в стор~~ конфиг передается через контекст)
- [x] обрубать `?` в query string
- [x] приоритет роутов - задаем в виде массива
- [x] придумать, как задавать query string и hash для AdvancedLink
- [x] exact
- [x] base path
- [x] атрибуты ссылки
- [x] callHistoryMethod, который принимает RouteArgs + добавить параметр с названием методов
- [ ] persistQuery
- [ ] переделать базовый компонент на HOC
- [ ] выключать spa переходы через пропсы
- [ ] query-string options

## подумать

- [x] проверить, как ведет себя звездочка в роутах
- [ ] проверить, что приходит в action, если адрес - url encoded
- [ ] подумать, нужно ли кодировать hash при генерации url
- [ ] когда происходит отписка от событий history

## License

MIT

[npm-image]: https://badgen.net/npm/v/direct-react-router
[npm-url]: https://npmjs.org/package/direct-react-router
[bundlephobia-image]: https://badgen.net/bundlephobia/minzip/direct-react-router
[bundlephobia-url]: https://bundlephobia.com/result?p=direct-react-router
[travis-image]: https://api.travis-ci.org/direct-adv-interfaces/direct-react-router.svg?branch=master
[travis-url]: https://travis-ci.org/direct-adv-interfaces/direct-react-router
[license-image]: https://badgen.net/github/license/direct-adv-interfaces/direct-react-router
[license-url]: LICENSE
