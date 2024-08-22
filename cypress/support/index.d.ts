declare namespace Cypress {
  interface Chainable<Subject> {
    drag(targetEl: string): Chainable<Subject>;
    openOrderDetails(): Chainable<Subject>;
  }
}
