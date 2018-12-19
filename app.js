const express		 = require('express'), 
			app 			 = express(),
			bodyParser = require('body-parser'), 
			PORT 			 = 3000,  
			mongoose 	 = require('mongoose');

// mongoose.connect creates the new collection inside data dir:
mongoose.connect('mongodb://localhost/campers_land');
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));
app.set('view engine', 'ejs');

// SCHEMA SETUP
const campgroundSchema = new mongoose.Schema({
	name: String,//expects name string
	image: String,//expects image string
}); 

// starts the Campground schema:
const Campground = mongoose.model('Campground', campgroundSchema);

// creates new campgrounds with Campground class, takes in two parameters one for the new campground and another one is a callback for err handling and success handling:
// Campground.create(
// 	{
// 		name: 'Hanging Trees',
// 		image: 'https://images.unsplash.com/photo-1519095614420-850b5671ac7f?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=400&q=60',
// 	}, (err, campground) => {
// 				if (err) {
// 					console.log(err);
// 				} else {
// 					console.log('NEWLY CREATED CAMPGROUND');
// 					console.log(campground);
// 				}
// 	   }
// );


// Route to Home Page:
app.get('/', (req, res) => {
	res.render('landing');
});

// Route to Campgrounds Page:
app.get('/campgrounds', (req, res) => {
	// Get all campgrounds from DB
	Campground.find({}, (err, allCampgrounds) => {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds', { campgrounds:allCampgrounds });
		}
	});
	// res.render('campgrounds', { campgrounds });
});

// Post Route 'sends information':
app.post('/campgrounds', (req, res) => {
	// get data from form and add to campgrounds array
	let name = req.body.name;
	let image =	req.body.image;
	const newCampground = { name, image };
	// Create a new campground and save to DB:
	Campground.create(newCampground, (err, newlyCreated) => {
		if (err) {
			console.log(err);
		} else {
			// redirect to campgrounds page:
			res.redirect('/campgrounds');
		}
	});
});

app.get('/campgrounds/new', (req, res) => {
	res.render('new.ejs');
});

app.listen(PORT, () => {
	console.log('App Running in localhost:3000');
});