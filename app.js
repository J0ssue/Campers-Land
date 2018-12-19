const express		 = require('express'), 
			app 			 = express(),
			bodyParser = require('body-parser'), 
			PORT 			 = 3000,  
			mongoose 	 = require('mongoose');

mongoose.connect('mongodb://localhost/campers_land');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
	name: String,
	image: String,
}); 

const Campground = mongoose.model('Campground', campgroundSchema);

Campground.create(
	{
		name: 'Granite Hill',
		image: '//images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
	}, (err, campground) => {
				if (err) {
					console.log(err);
				} else {
					console.log('NEWLY CREATED CAMPGROUND');
					console.log(campground);
				}
	   }
);




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