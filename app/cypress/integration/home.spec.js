/// <reference types="cypress" />

context('HomePage', () => {
  beforeEach(() => {
    cy.visit('/');
  });
  it('Search by enter', () => {
    //input earth and search
    cy.get('#topSearchKeyword')
      .type('test').should('have.value', 'test')
      .type('{enter}');
    cy.url().should('eq', 'http://localhost:3000/search/test');
  });
  it('Search by click', () => {
    //input earth and search
    cy.get('#topSearchKeyword')
      .type('test2').should('have.value', 'test2');
    cy.get('#topSearchGroup').click();
    cy.url().should('eq', 'http://localhost:3000/search/test2');
  });
  it('Tab check', () => {
    cy.get('#tab-all').click();
    cy.url().should('eq', 'http://localhost:3000/#all');
    cy.get('#panel-all').parent().should('have.class', 'active');

    cy.get('#tab-liked').click();
    cy.url().should('eq', 'http://localhost:3000/#liked');
    cy.get('#panel-liked').parent().should('have.class', 'active');

    cy.get('#tab-removed').click();
    cy.url().should('eq', 'http://localhost:3000/#removed');
    cy.get('#panel-removed').parent().should('have.class', 'active');
  });
  it('Check data', () => {
    cy.request('https://images-api.nasa.gov/search?q=earth&media_type=image&page=1').then(resp => {
      expect(resp.status).to.eq(200);
      expect(resp.body.collection.items).to.have.length(100);
    });
  });
});
