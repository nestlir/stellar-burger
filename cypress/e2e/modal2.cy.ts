describe('Тесты на модальные окна с использованием cy.contains, закрытик по крестику и оверлей', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' });
    // При условии, что приложение запущено
    cy.visit('http://localhost:4000');
  });

  it('Открытие и закрытие модального окна через contains', () => {
    // Открываем модальное окно ингредиента по его названию
    cy.contains('Краторная булка N-200i').click();

    // Закрываем модальное окно через крестик
    cy.get('[data-test-id="modal-close"]').click();
    cy.get('.modal').should('not.exist');
  });

  it('Открытие и закрытие модального окна через contains', () => {
    // Открываем модальное окно ингредиента по его названию
    cy.contains('Биокотлета из марсианской Магнолии').click();

    // Закрываем модальное окно через клик на оверлей
    cy.get('[data-test-id="modal-overlay"]').click({ force: true });
  });
});
