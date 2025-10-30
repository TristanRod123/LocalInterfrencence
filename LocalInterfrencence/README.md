# LocalInterfrencence Project

## Overview
The LocalInterfrencence project is a web-based application that utilizes FastAPI for the backend and provides a user-friendly interface for text generation using a transformer model.

## Project Structure
```
LocalInterfrencence
├── server.py          # Backend API for text generation
├── static
│   ├── css
│   │   └── style.css  # CSS styles for the web application
│   └── js
│       └── app.js     # JavaScript for client-side interactions
├── templates
│   └── index.html     # Main HTML template for the web application
├── requirements.txt    # Python dependencies
└── README.md          # Project documentation
```

## Setup Instructions
1. **Clone the repository:**
   ```
   git clone <repository-url>
   cd LocalInterfrencence
   ```

2. **Install dependencies:**
   It is recommended to use a virtual environment. You can create one using:
   ```
   python -m venv venv
   source venv/bin/activate  # On Windows use `venv\Scripts\activate`
   ```
   Then install the required packages:
   ```
   pip install -r requirements.txt
   ```

3. **Run the application:**
   Start the FastAPI server:
   ```
   python server.py
   ```
   The application will be accessible at `http://127.0.0.1:8000`.

## Usage
- Navigate to `http://127.0.0.1:8000` in your web browser to access the application.
- Use the interface to input text and generate responses from the transformer model.

## License
This project is licensed under the MIT License.