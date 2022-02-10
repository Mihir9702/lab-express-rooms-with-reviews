const router = require("express").Router();

// Import Models
const Room = require('../models/Rooms.model');
const Review = require('../models/Review.model');

// Middleware
const isLoggedIn = require('../middleware/isLoggedIn');

router.get('/', (req, res) => {
  // Get all Rooms and display on screen
  Room
    .find()
    .populate()
    .then(rooms => res.render('rooms/all-rooms', { rooms }))
    .catch(err => console.log(err))
});

router.get('/create-room', isLoggedIn, (req, res) => {
  res.render('rooms/create-room')
});

router.post('/create-room', isLoggedIn, (req, res) => {
  const { roomName, roomDescription, roomImageUrl } = req.body;

  // Logged in Users can create rooms
  Room
    .create({
      name: roomName,
      description: roomDescription,
      imageUrl: roomImageUrl,
      owner: req.user
    })
    .then(newRoom => {
      res.redirect(`/rooms/${newRoom._id}`)
    })
    .catch(err => {
      console.log(err);
    })
});

router.get('/:id', (req, res) => {
  // Get the room created
  Room
    .findById(req.params.id)
    .populate('owner reviews')
    .then(foundRoom => {
      res.render('rooms/room', foundRoom)
    })
    .catch(err => {
      console.log(err);
    })
});

router.get('/:id/update', isLoggedIn, (req, res) => {
  // Load form to update Room
  Room
    .findById(req.params.id)
    .then(foundRoom => {
      res.render('rooms/update-room', foundRoom)
    })
    .catch(err => {
      console.log(err);
    })
});

router.post('/:id/update', isLoggedIn, (req, res) => {
  const { roomName, roomDescription, roomImageUrl } = req.body;
  // Find Room ID in database and update
  Room
    // Update Room in Database
    .findByIdAndUpdate(req.params.id, {
      name: roomName,
      description: roomDescription,
      imageUrl: roomImageUrl,
    })
    // Render new room page with updated credentials
    .then(() => {
      res.redirect(`/rooms/${req.params.id}`)
    })
    .catch(err => {
      console.log(err);
    })
});

// Delete Room
router.post('/:id/delete', isLoggedIn, (req, res) => {
  // Find Room ID in database and delete
  Room
    // Delete Room in Database
    .findByIdAndDelete(req.params.id)
    // Redirect to page with all Rooms
    .then(() => {
      res.redirect(`/rooms`)
    })
    .catch(err => {
      console.log(err);
    })
});

// Reviews
router.get('/:id/add-review', isLoggedIn, (req, res) => {
  Room
    .findById(req.params.id)
    .then(foundRoom => {
      res.render('rooms/add-review', foundRoom)
    })
    .catch(err => {
      console.log(err)
    })
});

router.post('/:id/add-review', isLoggedIn, (req, res) => {
  const { review } = req.body;
  Review
    .create({
      user: req.user,
      comment: review
    })
    .then(review => {

      Room
        .findByIdAndUpdate(req.params.id, {
          $push: { reviews: review }
        })
        .then(() => {
          res.redirect(`/rooms/${req.params.id}`)
        })
        .catch(err => {
          console.log(err)
        })

    })
    .catch(err => {
      console.log(err)
    })

});

module.exports = router;
