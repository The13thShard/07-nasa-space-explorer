// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

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
		const apodData = await response.json();

		if (!response.ok) {
			throw new Error(apodData.msg || 'NASA could not load the images.');
		}

		const apodItems = Array.isArray(apodData) ? apodData : [apodData];
		gallery.replaceChildren();

		apodItems.forEach((item) => {
			const card = document.createElement('article');
			const title = document.createElement('h2');
			const description = document.createElement('p');

			title.textContent = item.title;
			description.textContent = item.explanation;
			card.append(title);

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
	} catch (error) {
		gallery.textContent = `Unable to load APOD data: ${error.message}`;
	}
}

// Connect the existing button to the APOD request.
document.querySelector('.filters button').addEventListener('click', getSpaceImages);
