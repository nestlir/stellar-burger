describe('Тесты на конструктор', () => {
  beforeEach('перехват запросов на эндпоинты', () => {
    // Перехватываем запрос на получение ингредиентов и используем фикстуру
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );

    // Перехватываем запрос на оформление заказа
    cy.intercept('POST', 'api/orders', { fixture: 'order-response.json' }).as(
      'createOrder'
    );

    // Перехватываем запрос на авторизацию
    cy.intercept('POST', 'api/auth/login', { fixture: 'user.json' }).as(
      'login'
    );

    // Открываем приложение
    cy.visit('http://localhost:4000');

    // Ждем завершения загрузки ингредиентов
    cy.wait('@getIngredients');
  });

  it('Добавление ингредиентов, авторизация и оформление заказа', () => {
    // Клик на первую кнопку "Добавить" (добавляем булку)
    cy.get('button.common_button.HR_H4Fj42ZLB21Nz5vxx.mt-8').eq(0).click();
    cy.get('.constructor-element__row').should(
      'contain',
      'Краторная булка N-200i'
    );

    // Клик на вторую кнопку "Добавить" (добавляем начинку)
    cy.get('button.common_button.HR_H4Fj42ZLB21Nz5vxx.mt-8').eq(2).click();
    cy.get('.constructor-element__row').should(
      'contain',
      'Биокотлета из марсианской Магнолии'
    );

    // Клик на третью кнопку "Добавить" (добавляем соус)
    cy.get('button.common_button.HR_H4Fj42ZLB21Nz5vxx.mt-8').eq(11).click();
    cy.get('.constructor-element__row').should('contain', 'Соус Spicy-X');

    // Клик на кнопку "Оформить заказ"
    cy.get('button.button_type_primary.button_size_large').click();

    // Проверка перенаправления на страницу авторизации
    cy.url().should('include', '/login');

    // Выполняем авторизацию
    cy.get('input[name="email"]').type('wawa@wa.ru');
    cy.get('input[name="password"]').type('wawa123');
    cy.get('button').contains('Войти').click();

    // Ждем завершения авторизации и перехвата запроса
    cy.wait('@login');

    // Убедитесь, что авторизация прошла успешно и нас перенаправило обратно
    cy.url().should('not.include', '/login');

    // Снова нажимаем на кнопку "Оформить заказ"
    cy.get('button.button_type_primary.button_size_large').click();

    // Ждем завершения создания заказа
    cy.wait('@createOrder');

    // Проверяем, что модальное окно открылось
    cy.get('[data-test-id="modal"]').should('exist').and('be.visible');

    // Проверка номера заказа
    cy.get('[data-test-id="order-number"]').should('contain', '12345'); // '12345' — пример номера заказа из фикстуры

    // Закрываем модальное окно через крестик
    cy.get('[data-test-id="modal-close"]').click();

    // Проверяем, что модальное окно закрылось
    cy.get('[data-test-id="modal"]').should('not.exist');

    // Проверка, что конструктор пуст после оформления заказа
    cy.get('.constructor-element__row').should('not.exist');
  });
});
