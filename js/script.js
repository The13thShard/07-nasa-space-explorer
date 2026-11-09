// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// Add each APOD result to the gallery.
function displaySpaceImages(apodItems) {
	const gallery = document.getElementById('gallery');

	gallery.replaceChildren();

	const itemsByDate = [...apodItems].sort((firstItem, secondItem) =>
		firstItem.date.localeCompare(secondItem.date)
	);

	itemsByDate.forEach((item) => {
		const card = document.createElement('article');
		const title = document.createElement('h2');
		const date = document.createElement('time');
		const description = document.createElement('p');

		card.className = 'gallery-item';
		title.textContent = item.title;
		date.dateTime = item.date;
		date.textContent = item.date;
		description.textContent = item.explanation;
		card.append(title, date);

		if (item.media_type === 'image') {
			const image = document.createElement('img');
			image.src = item.url;
			image.alt = item.title;
			card.append(image);
		} else {
			const mediaLink = document.createElement('a');
			mediaLink.href = item.url;
			mediaLink.textContent = 'View this media';
			mediaLink.target = '_blank';
			mediaLink.rel = 'noopener noreferrer';
			card.append(mediaLink);
		}

		card.append(description);
		gallery.append(card);
	});
}

// Load APOD images for the dates selected on the page.
async function getSpaceImages() {
	const startDate = startInput.value;
	const endDate = endInput.value;
	const gallery = document.getElementById('gallery');

	const apiUrl = new URL('/api/apod', window.location.origin);
	apiUrl.searchParams.set('start_date', startDate);
	apiUrl.searchParams.set('end_date', endDate);

	gallery.textContent = 'Loading space images...';

	try {
		const response = await fetch(apiUrl);
		const contentType = response.headers.get('content-type');

		if (!contentType || !contentType.includes('application/json')) {
			throw new Error('The APOD server returned a webpage instead of data. Run "npm start" and open http://localhost:3000.');
		}

		const apodData = await response.json();

		if (!response.ok) {
			throw new Error(apodData.msg || 'NASA could not load the images.');
		}

		// NASA returns a list for date ranges and one object for a single day.
		const apodItems = Array.isArray(apodData) ? apodData : [apodData];
		displaySpaceImages(apodItems);
	} catch (error) {
		gallery.textContent = `Unable to load APOD data: ${error.message}`;
	}
}

// Connect the existing button to the APOD request.
document.querySelector('.filters button').addEventListener('click', getSpaceImages);
