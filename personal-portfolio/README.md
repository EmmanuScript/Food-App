# Personal Portfolio Website in React

This project was bootstrapped with [Create React App](https://github.com/facebook/create-react-app).lt using:

- Front-end library: React
- CSS framework: React-bootstrap
- CSS animations library: Animate.css

## Form Validation Requirements

The Contact form (`src/components/Contact.js`) requires the following validation rules:

### Email Validation

- Must contain an '@' symbol
- Must have a valid domain (at least one '.' after the '@')
- Regex pattern: `/^[^\s@]+@[^\s@]+\.[^\s@]+$/`

### Phone Validation

- Accept format: (XXX) XXX-XXXX or XXX-XXX-XXXX or XXXXXXXXXX
- Must be exactly 10 digits (excluding formatting characters)
- Regex pattern: `/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4}$/`

### Required Fields

All form fields are required before submission:

- firstName (minimum 2 characters)
- lastName (minimum 2 characters)
- email (must match email pattern above)
- phone (must match phone pattern above)
- message (minimum 10 characters)

### Error Display

- Show validation errors in red text below each invalid field
- Disable submit button until all fields are valid
- Display error message: "Please fill in all required fields correctly" if user attempts to submit with invalid data

In the /personal-portfolio, you can run:

### `npm start`

Runs the app in the development mode.
Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

The page will reload when you make changes.
You may also see any lint errors in the console.

### `npm test`

Launches the test runner in the interactive watch mode.
See the section about [running tests](https://facebook.github.io/create-react-app/docs/running-tests) for more information.

### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.
