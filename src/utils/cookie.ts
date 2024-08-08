/**
 * Функция для получения значения cookie по его имени.
 *
 * @param {string} name - Имя cookie.
 * @returns {string | undefined} - Значение cookie, если оно найдено, иначе undefined.
 */
export function getCookie(name: string): string | undefined {
  const matches = document.cookie.match(
    new RegExp(
      '(?:^|; )' +
        // eslint-disable-next-line no-useless-escape
        name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') +
        '=([^;]*)'
    )
  );
  return matches ? decodeURIComponent(matches[1]) : undefined;
}

/**
 * Функция для установки cookie.
 *
 * @param {string} name - Имя cookie.
 * @param {string} value - Значение cookie.
 * @param {object} [props={}] - Дополнительные параметры cookie, такие как expires, path, domain и т.д.
 */
export function setCookie(
  name: string,
  value: string,
  props: { [key: string]: string | number | Date | boolean } = {}
) {
  // Устанавливаем путь по умолчанию
  props = {
    path: '/',
    ...props
  };

  let exp = props.expires;

  // Если параметр expires - число, интерпретируем его как количество секунд
  if (exp && typeof exp === 'number') {
    const d = new Date();
    d.setTime(d.getTime() + exp * 1000);
    exp = props.expires = d;
  }

  // Если параметр expires - объект Date, преобразуем его в строку UTC
  if (exp && exp instanceof Date) {
    props.expires = exp.toUTCString();
  }

  value = encodeURIComponent(value);
  let updatedCookie = name + '=' + value;

  // Добавляем остальные параметры cookie
  for (const propName in props) {
    updatedCookie += '; ' + propName;
    const propValue = props[propName];
    if (propValue !== true) {
      updatedCookie += '=' + propValue;
    }
  }

  // Устанавливаем cookie в браузере
  document.cookie = updatedCookie;
}

/**
 * Функция для удаления cookie по его имени.
 *
 * @param {string} name - Имя cookie, которое нужно удалить.
 */
export function deleteCookie(name: string) {
  // Устанавливаем cookie с прошедшим временем истечения для его удаления
  setCookie(name, '', { expires: -1 });
}
