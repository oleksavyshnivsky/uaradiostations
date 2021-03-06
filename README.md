<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

- [Призначення](#%D0%BF%D1%80%D0%B8%D0%B7%D0%BD%D0%B0%D1%87%D0%B5%D0%BD%D0%BD%D1%8F)
- [Встановлення](#%D0%B2%D1%81%D1%82%D0%B0%D0%BD%D0%BE%D0%B2%D0%BB%D0%B5%D0%BD%D0%BD%D1%8F)
- [Склад проєкту](#%D1%81%D0%BA%D0%BB%D0%B0%D0%B4-%D0%BF%D1%80%D0%BE%D1%94%D0%BA%D1%82%D1%83)
  - [Popup-вікно](#popup-%D0%B2%D1%96%D0%BA%D0%BD%D0%BE)
  - [Сторінка налаштувань](#%D1%81%D1%82%D0%BE%D1%80%D1%96%D0%BD%D0%BA%D0%B0-%D0%BD%D0%B0%D0%BB%D0%B0%D1%88%D1%82%D1%83%D0%B2%D0%B0%D0%BD%D1%8C)
  - [Фоновий сценарій](#%D1%84%D0%BE%D0%BD%D0%BE%D0%B2%D0%B8%D0%B9-%D1%81%D1%86%D0%B5%D0%BD%D0%B0%D1%80%D1%96%D0%B9)
- [Стандартний набір станцій](#%D1%81%D1%82%D0%B0%D0%BD%D0%B4%D0%B0%D1%80%D1%82%D0%BD%D0%B8%D0%B9-%D0%BD%D0%B0%D0%B1%D1%96%D1%80-%D1%81%D1%82%D0%B0%D0%BD%D1%86%D1%96%D0%B9)
- [Проблеми](#%D0%BF%D1%80%D0%BE%D0%B1%D0%BB%D0%B5%D0%BC%D0%B8)
- [Контакт](#%D0%BA%D0%BE%D0%BD%D1%82%D0%B0%D0%BA%D1%82)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

## Призначення

Браузерне розширення для програвання українських радіостанцій.

![popup](https://oleksavyshnivsky.github.io/uaradiostations/popup.png)

## Встановлення

- Меню: Налаштування та керування Chrome (вертикальна трикрапка) — Інші інструменти — Розширення
- Галка вгорі праворуч: Режим розробника
- Кнопка вгорі ліворуч: Завантажити розпаковане розширення
- Вибрати директорію <code>extension</code> цього проєкту

## Склад проєкту

* <code>docs</code> — вебсайт зі стандартним набором станцій  
* <code>extension</code> — директорія розпакованого розширення
* <code>misc</code> — допоміжні файли на період розробки

### Popup-вікно

- popup.html
- common.css
- common.js
- popup.js

### Сторінка налаштувань

- options.html
- common.css
- common.js
- options.js

### Фоновий сценарій

- background.js

## Стандартний набір станцій

- docs/defaultstations.json — JSON-масив з елементами {title:'...',url:'...',website:'...'}, де title — назва станції, url — посилання на онлайн-трансляцію, website — посилання на сайт радіостанції

## Проблеми

- Розширення використовує застарілий маніфест v2, який перестане підтримуватися у червні 2023. Потрібно буде якось не забути до того часу подивитися, чи новий маніфест v3 почав підтримувати фонове аудіо.
- Станції Люкс FM відсутні через особливості їхньої онлайн-трансляції.

## Контакт

[Написати автору](mailto:oleksa.vyshnivsky@gmail.com)
