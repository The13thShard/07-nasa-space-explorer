# Project 7: NASA API - Space Explorer App
NASA releases a new "Astronomy Picture of the Day" (APOD) every day—spotlighting breathtaking images of galaxies, stars, planets, and more.

Your task is to build an interactive web app that fetches and displays these photos using [NASA's API](https://api.nasa.gov/). Users will pick a date range and instantly view stunning photos from across the cosmos, along with titles and descriptions.

You'll get to use your skills to build something that's actually connected to real-world data from one of the most iconic organizations in the world.

## Starter Files
- The provided files include a NASA logo, date inputs, a button, a placeholder for your gallery, and basic layout and styling to help you get started.
- It also includes built-in logic (in `dateRange.js`) to handle the valid APOD date range—from June 16, 1995 to today. No need to modify it.
- All your custom JavaScript should go in `script.js`. That's where you'll write the code that fetches data and displays your gallery.

## Run the App
The app uses a small Node.js server so the NASA API key is not sent to the browser. Install Node.js 18 or newer, then run these commands from the project folder:

```sh
npm install
cp .env.example .env
```

Open `.env`, replace the example value with your newly generated NASA API key, then start the app:

```sh
npm start
```

Open http://localhost:3000 in your browser. Do not put a real API key in `js/script.js` or commit the `.env` file. Use the Node server rather than a static preview such as VS Code Live Server so requests go through the backend.
