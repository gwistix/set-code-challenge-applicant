// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
import 'cypress-wait-until';

import DeviceDetailsPage from '../pages/device-details.page'
import DevicesListPage from '../pages/devices-list.page'
import { aliasQuery, hasOperationName } from '../utils/graphql-test-utils'


const devicesListPage = new DevicesListPage()
const deviceDetailsPage = new DeviceDetailsPage()
const defaultUser = 'default'


Cypress.Commands.add('loginAsTestUser', (userKey: string = defaultUser) => {
  Cypress.log({
    name: 'loginAsTestUser',
    displayName: 'login',
    message: `starting login as test user`,
  })
  cy.session(userKey, () => {
    // Implemented via API call ✓
    cy.request({
      method: 'GET',
      url: 'https://houston-staging.pdq.tools/v1/test-user',
      body: {userKey},
      email: 'test@example.com',
    }).then(({body}) => {
      window.localStorage.setItem('authToken', body.token)
    })
  })
})

Cypress.Commands.add('resetDemoData', () => {
  Cypress.log({
    name: 'resetDemoData',
    displayName: 'reset',
    message: `resetting demo data for current org`,
  })
})

Cypress.Commands.add('getFirstDevice', () => {
  cy.intercept('POST', '/v1/graphql', (req) => {
    aliasQuery(req, 'Devices')
  })
  devicesListPage.load()
  return cy.wait('@gqlDevicesQuery').then((x) => {
    console.log(x.response)
    return x.response.body.data.devices.edges[0].node
  })
})
