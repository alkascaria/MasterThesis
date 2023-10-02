# LabBook Web Editor

This project is a customized implementation of the TinyMCE editor tailored to meet the specific needs of creating and documenting chemistry experiments, especially for LabBook.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contact](#contact)

## Features

- **Automatic GHS Pictogram Insertion**: Easily insert GHS pictograms from a dedicated pictogram database.
- **Automatic Possible Hazards Table Creation**: Easily create Possible Hazards Table by insering GHS H, P and EUH Statements.
- **Exportable/Importable**: Save, delete and modify experiment documents.

## Installation

This requires both node.js (https://nodejs.org/en) and npm to be installed on the system.

Clone the repository to your local machine:

For Client

```bash
git clone https://github.com/alkascaria/tinymce-client.git
cd tinymce-client
```
Install the necessary dependencies:

```bash
npm install
```


For Server

This requires Express, CORS and MongoDB (https://www.mongodb.com/atlas/database) and its driver.

```bash
git clone https://github.com/alkascaria/tinymce-server.git
cd tinymce-server
```
Install the necessary dependencies:

```bash
npm install
```

Create the database collection:

```bash
node db.js
```

## Usage

Start the development server- Client:

```bash
npm run start
```
Start the server:

```bash
node server.mjs
```

Open your web browser and navigate to http://localhost:3000 to start using the LabBook WebEditor.

## License

This project is licensed under the MIT License.

## Contact

Alka Scaria
Project Link: Client - https://github.com/alkascaria/tinymce-client
              Server - https://github.com/alkascaria/tinymce-server
