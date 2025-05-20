# Asset Generator

The Asset Generator is a Node.js application that allows users to generate HTML assets for grids and 3D cat banners using Handlebars templates.

## Features

- Generate grid assets with customizable properties.
- Generate 3D cat banners with multiple assets.
- Supports English and French versions of the assets.
- Outputs HTML files in a structured directory.

## Prerequisites

Before running the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (version 14 or higher)
- [npm](https://www.npmjs.com/) (comes with Node.js)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/ArthurPPinheiro/dynamite-asset-generator.git
   cd dynamite-asset-generator
   ```

2. Install the dependencies:

   ```bash
   npm install
   ```

## Running the Project

1. Start the server:

   ```bash
   npm start
   ```

   Alternatively, if you want to use `nodemon` for automatic server restarts during development:

   ```bash
   npx nodemon app.js
   ```

2. Open your browser and navigate to:

   ```
   http://localhost:3000
   ```

## Usage

### Generating Grid Assets

1. On the homepage, select "Grid Interruptor" from the asset type dropdown.
2. Fill out the form with the required details:
   - English and French titles, CTA text, and alt text.
   - General properties like date, Cat ID, width, alignment, color, and image path.
3. Click "Generate Asset" to create the grid asset.
4. The generated HTML files will be saved in the `outputs/` directory.

### Generating 3D Cat Banners

1. On the homepage, select "3D CatBanner" from the asset type dropdown.
2. Fill out the form with the required details:
   - Title and date.
   - Add multiple assets with English and French properties, Cat ID, and image paths.
3. Click "Generate Asset" to create the 3D cat banner.
4. The generated HTML files will be saved in the `outputs/` directory.

## Project Structure

- **`app.js`**: Main entry point of the application.
- **`routes/`**: Contains route handlers for grid and cat banner generation.
- **`models/`**: Contains the `Grid` class for handling grid data.
- **`templates/`**: Handlebars templates for generating HTML assets.
- **`views/`**: EJS templates for rendering the frontend forms.
- **`public/`**: Static files (e.g., CSS, JS, images).
- **`outputs/`**: Directory where generated HTML files are saved.

## Dependencies

- `express`: Web framework for Node.js.
- `express-handlebars`: Handlebars template engine for Express.
- `ejs`: Embedded JavaScript templates for rendering forms.
- `body-parser`: Middleware for parsing request bodies.
- `nodemon`: Development tool for automatically restarting the server.

## Troubleshooting

- **Error: ENOENT: no such file or directory**  
  Ensure the `outputs/` directory is created before writing files. The application automatically creates the directory if it doesn't exist.

- **Port Already in Use**  
  If port 3000 is already in use, set a different port by running:  
  ```bash
  PORT=4000 npm start
  ```

## License

This project is licensed under the ISC License.

## Author

Arthur Pinheiro