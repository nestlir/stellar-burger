describe('Кастомные команды', () => {
  it('should open the order details modal and close it', () => {
    // Перехват запроса к API, который загружает детали ингредиента
    cy.intercept('GET', '**/643d69a5c3f7b9001cfa093c').as(
      'fetchIngredientDetails'
    );
    cy.visit('http://localhost:4000');

    // Открываем детали ингридиента
    cy.openOrderDetails();

    // Ожидаем изменения URL
    cy.url().should('include', '/ingredients/');

    // Закрываем модальное окно через кнопку
    cy.get('[data-test-id="modal-close"]').click();
  });
});

it('should open the order details modal and close it', () => {
  // Перехват запроса к API, который загружает детали ингредиента
  cy.intercept('GET', '**/643d69a5c3f7b9001cfa0941').as(
    'fetchIngredientDetails'
  );
  cy.visit('http://localhost:4000');

  // Открываем детали ингридиента
  cy.openOrderDetails();

  // Ожидаем изменения URL
  cy.url().should('include', '/ingredients/');

  // Закрываем модальное окно через клик на оверлей
  cy.get('[data-test-id="modal-overlay"]').click({ force: true });
});
