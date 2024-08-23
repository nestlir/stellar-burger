describe('Тесты на конструктор', () => {
  beforeEach('перехват запроса на эндпоинт', () => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    // При условии, что приложение запущено
    cy.visit('http://localhost:4000');
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

    // Авторизация (если необходимо)
    cy.url().should('include', '/login');
    cy.get('input[name="email"]').type('wawa@wa.ru');
    cy.get('input[name="password"]').type('wawa123');
    cy.get('button').contains('Войти').click();

    // После успешной авторизации снова нажимаем на кнопку "Оформить заказ"
    cy.url().should('not.include', '/login'); // Убедитесь, что авторизация прошла успешно
    cy.get('button.button_type_primary.button_size_large').click();

    // Проверка успешного оформления заказа с увеличенным таймаутом
    cy.get('.kymTVSFEObODAY4TavAl', { timeout: 30000 }).should('be.visible');
    cy
      .get('.kymTVSFEObODAY4TavAl', { timeout: 30000 })
      .should('contain', 'Ваш заказ начали готовить'),
      // Закрытие модального окна с повторной проверкой
      cy.get('.RuQycGaRTQNbnIEC5d3Y').click({ force: true });
    cy.wait(1000); // Ждем 1 секунду, чтобы модальное окно закрылось
    cy.get('.RuQycGaRTQNbnIEC5d3Y').should('not.exist', { timeout: 10000 });
  });
});
