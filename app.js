const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const PORT = 3000; 

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

const campgrounds = [
		{ name: 'Salmon Creek', img: 'fire.jpg' },
		{ name: 'Granite Hill', img: 'lake1.jpg' },
		{ name: 'Mountain Goat', img: 'lake2.jpg' },

		{ name: 'Salmon Creek', img: 'fire.jpg' },
		{ name: 'Granite Hill', img: 'lake1.jpg' },
		{ name: 'Mountain Goat', img: 'lake2.jpg' },

		{ name: 'Salmon Creek', img: 'fire.jpg' },
		{ name: 'Granite Hill', img: 'lake1.jpg' },
		{ name: 'Mountain Goat', img: 'lake2.jpg' },
];

// Route to Home Page:
app.get('/', (req, res) => {
	res.render('landing');
});

// Route to Campgrounds Page:
app.get('/campgrounds', (req, res) => {
	res.render('campgrounds', { campgrounds });
});

// Post Route 'sends information':
app.post('/campgrounds', (req, res) => {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let img =	req.body.img;
	const newCampground = { name, img };
	campgrounds.push(newCampground);
	// redirect back to campgrounds page
	res.redirect("/campgrounds");
});

app.get('/campgrounds/new', (req, res) => {
	res.render('new.ejs');
});

app.listen(PORT, () => {
	console.log('App Running in localhost:3000');
});