const genres = require('./routes/genres');
const customers = require('./routes/customer');
const movies = require('./routes/movie');
const user = require('./routes/user');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
 
app.use(express.json());
app.use('/api/genres', genres);
app.use('/api/customers', customers);
app.use('/api/movies', movies);
app.use('/api/users', user);
const Course = require('./models/Course');

// Connect to our Db
mongoose.connect('mongodb://localhost/vidly' ,{useNewUrlParser: true}, (err) => {
    if(err){
        throw err;
    }else{
        console.log("Connected to our Db"); 
    }
});

// create a course object and save it to our Db
// const course = new Course({
//     name:"Android Development",
//     author:"Usoro Mosh",
//     tags:["Android", "Retrofit"]
// });

// course.save((err, newCourse) => {
//     // These is an example of a callback
//     if(!err){
//       console.log("course", newCourse)
//     }
// });

// Select * from courses where isPublished = true
// upperHand keys for quering data in mongodb
//eq (equal)
//ne (not equal)
//gt (greater than)
//gte (greater than or equal to)
//lt (less than)
//in
//nin(not)
// Course.find( {isPublished:true},(err, courses) => {
//     if(!err){
//         console.log(courses);
//     }
// })

// Start up our Server
const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));