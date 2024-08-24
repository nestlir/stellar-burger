describe('Тесты на модальные окна с использованием cy.contains, закрытие по крестику и оверлею', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    // При условии, что приложение запущено
    cy.visit('http://localhost:4000');
  });

  it('Открытие и закрытие модального окна через крестик', () => {
    // Проверяем, что модальное окно отсутствует
    cy.get('[data-test-id="modal"]').should('not.exist');

    // Открываем модальное окно ингредиента по его названию
    cy.contains('Краторная булка N-200i').click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-test-id="modal"]').should('exist').and('be.visible');

    // Закрываем модальное окно через крестик
    cy.get('[data-test-id="modal-close"]').click();

    // Проверяем, что модальное окно закрылось
    cy.get('[data-test-id="modal"]').should('not.exist');
  });

  it('Открытие модального окна и закрытие через клик на оверлей', () => {
    // Открываем модальное окно ингредиента по его названию
    cy.contains('Биокотлета из марсианской Магнолии').click();

    // Проверяем, что модальное окно открылось
    cy.get('[data-test-id="modal"]').should('exist').and('be.visible');

    // Закрываем модальное окно через клик на оверлей
    cy.get('[data-test-id="modal-overlay"]').click({ force: true });

    // Проверяем, что модальное окно закрылось
    cy.get('[data-test-id="modal"]').should('not.exist');
  });
});
