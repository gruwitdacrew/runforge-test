# AI_LOG

## Чем пользовался

- **DeepSeek Harness** (агент в DSH Web GUI) с моделью **deepseek-flash** — генерация проекта, конфигов, компонентов, стилей и тестов.
- **Vite 6 / TypeScript 5.8** — проверка типов и сборка (`pnpm build`).
- **Vitest 3 + React Testing Library** — прогон тестов.
- **Headless Chrome + CDP** (`Emulation.setDeviceMetricsOverride`) — проверка вёрстки и отсутствия горизонтального скролла на 360px и 1360px, сбор `console`-ошибок.
- Пакетный менеджер **pnpm 11**.

## Промпты

### 1. Постановка задачи

> Реализуй тестовое задание на React + Vite (TypeScript предпочтительно). Страница Runs для продукта Runforge: список запусков, поиск, фильтр по статусу, открытие деталей. Данные — из локального mock-сервиса (Promise с задержкой). Модель Run: id, name, repository, branch, status (queued/running/succeeded/failed), createdAt, durationSeconds?, logs[], result?. Нужны: список, фильтр All/Queued/Running/Succeeded/Failed с заметным активным состоянием, поиск по name и repository вместе с фильтром, детали в drawer с логами и result, статусы текстом, состояния loading/error/empty, адаптив от 360px. Стиль Runforge: молочный фон, тёмно-синие элементы, единые отступы. Разбей на компоненты, минимум 6 запусков во всех статусах, задержка 500–800 мс.

Агент собрал каркас: Vite + React + TS, mock-сервис, список, фильтры, drawer, skeleton, состояния, CSS-токены.

### 2. Уточнение архитектуры и URL-состояния

> Добавь бонусы: сортировку по дате и длительности и синхронизацию фильтра/поиска/сортировки с URL. Открытый запуск тоже держи в URL, чтобы «Назад» браузера закрывал drawer. Для drawer сделай нормальную доступность: role="dialog", focus trap, Esc, возврат фокуса на строку. Не используй UI-библиотеки, только CSS.

Здесь появились `lib/urlQuery.ts`, `hooks/useQueryState.ts` (ref-зеркало состояния + `popstate`), закрытие drawer через `history.back()` с фолбэком на `replaceState`.

### 3. Тесты

> Напиши тесты Vitest + React Testing Library: фильтрация по статусу, поиск (name и repository), открытие деталей запуска. Для деталей проверь логи и result, потом возврат к списку. Дополнительно проверь error state и Retry. Учти, что mock отвечает с задержкой 520–800 мс.

Итог: 4 теста в `src/App.test.tsx`, все проходят.

## Замеченные ошибки AI и исправления

### 1. Неверный относительный импорт в тесте (TS2307)

AI создал `src/App.test.tsx` с импортом `import App from '../App'` — путь на уровень выше, хотя тест лежит рядом с `App.tsx`. Сборка упала:

```text
src/App.test.tsx(4,17): error TS2307: Cannot find module '../App' or its corresponding type declarations.
```

**Исправление:** заменил на `import App from './App'`. Ошибку поймал `tsc --noEmit` в составе `pnpm build`.

### 2. Неиспользуемая константа в mock-сервисе (TS6133)

В `src/api/mockRuns.ts` AI объявил `const HOUR = 60 * MINUTE`, но нигде её не использовал (даты считаются в минутах). `noUnusedLocals` в tsconfig справедливо уронил сборку:

```text
src/api/mockRuns.ts(4,7): error TS6133: 'HOUR' is declared but its value is never read.
```

**Исправление:** константа удалена, мёртвый код не остался.

### 3. Обрезанный ряд фильтров на 360px

На первом мобильном скриншоте ряд статусов («All / Queued / Running / Succeeded / Failed») обрезался по правому краю: контейнер был `overflow-x: auto`, и часть фильтров оказывалась вне экрана без явной подсказки о скролле.

**Исправление:** на ширине ≤560px фильтры переносятся (`flex-wrap: wrap`, `overflow: visible`), теперь видны все пять кнопок; на desktop они по-прежнему в одну строку.

### 4. Ошибка в способе проверки адаптива (не в коде)

Первые скриншоты «на 360px» выглядели так, будто контент вылезает за экран. Причина оказалась в методике: headless Chrome с `--window-size=360,900` без мобильной эмуляции рендерит страницу в окне шире 360px и просто обрезает снимок. Проверка через CDP с `Emulation.setDeviceMetricsOverride` показала `innerWidth = scrollWidth = 360` — вёрстка в порядке. Для дальнейших проверок использовал только CDP-эмуляцию.

## Ручная проверка результата

- `pnpm build` — типы и production-сборка без ошибок.
- `pnpm test` — 4/4 теста.
- CDP-проверка desktop (1360px), mobile (360px), loading, empty, error, drawer: `console`-ошибок нет, горизонтального скролла нет.
- Отдельно проверены сценарии: открытие drawer по прямому URL `?run=...`, закрытие по Esc/Back, сброс фильтров из empty state, Retry после `?fail=1`.

## Замечание по окружению

pnpm 11 по умолчанию не запускает postinstall-скрипты. Для работы Vite/esbuild добавлен `pnpm-workspace.yaml`:

```yaml
allowBuilds:
  esbuild: true
```

Это не влияние AI на код приложения, но без этого шага `node_modules` остаётся неполным после `pnpm install`.
