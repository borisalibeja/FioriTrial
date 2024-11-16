# App Title (trial4)

## Description
This is a simple SAP Fiori application that interacts with an OData service to display and manage data. The app was generated using the SAP Fiori tools suite and is styled using the `sap_horizon` theme for a modern, responsive UI.

## Features
- Responsive Fiori UI built with UI5 (version 1.130.0).
- Integration with an OData service available at `https://academytrial.dest/`.
- Mock data support for local development.

## Pre-requisites
- [Node.js LTS](https://nodejs.org) (e.g., v16.x or higher).
- [NPM](https://www.npmjs.com/) (v8.x or higher).
- Active OData service at the specified URL or a local mock setup.

## Getting Started
### Running the App
1. Clone this repository and navigate to the project root:
    ```bash
    git clone <repo-url>
    cd trial4
    ```
2. Install dependencies:
    ```bash
    npm install
    ```
3. Start the application:
    ```bash
    npm start
    ```
    - This will open the app in your default browser at `http://localhost:8080`.

### Running with Mock Data
If the OData service is not accessible, you can run the app with mock data:
```bash
npm run start-mock
