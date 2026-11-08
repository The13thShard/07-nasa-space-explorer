import 'dotenv/config';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const app = express();
const port = process.env.PORT || 3000;
const projectDirectory = path.dirname(fileURLToPath(import.meta.url));

app.use(express.static(projectDirectory, { dotfiles: 'deny' }));
app.use('/api', rateLimit({
	windowMs: 15 * 60 * 1000,
	max: 100,
	standardHeaders: true,
	legacyHeaders: false,
}));

function isValidDate(date) {
	if (typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
		return false;
	}

	const parsedDate = new Date(`${date}T00:00:00.000Z`);
	return !Number.isNaN(parsedDate.getTime()) && parsedDate.toISOString().slice(0, 10) === date;
}

app.get('/api/apod', async (request, response) => {
	const startDate = request.query.start_date;
	const endDate = request.query.end_date;
	const today = new Date().toISOString().slice(0, 10);

	if (!isValidDate(startDate) || !isValidDate(endDate)) {
		return response.status(400).json({ msg: 'Provide valid start_date and end_date values.' });
	}

	if (startDate < '1995-06-16' || endDate > today || startDate > endDate) {
		return response.status(400).json({ msg: 'Choose a date range from June 16, 1995 through today.' });
	}

	if (!process.env.NASA_API_KEY) {
		return response.status(500).json({ msg: 'The server NASA API key is not configured.' });
	}

	try {
		const apiUrl = new URL('https://api.nasa.gov/planetary/apod');
		apiUrl.searchParams.set('api_key', process.env.NASA_API_KEY);
		apiUrl.searchParams.set('start_date', startDate);
		apiUrl.searchParams.set('end_date', endDate);

		const nasaResponse = await fetch(apiUrl);
		const apodData = await nasaResponse.json();
		return response.status(nasaResponse.status).json(apodData);
	} catch {
		return response.status(502).json({ msg: 'Could not connect to NASA APOD.' });
	}
});

app.listen(port, () => {
	console.log(`Space Explorer is running at http://localhost:${port}`);
});