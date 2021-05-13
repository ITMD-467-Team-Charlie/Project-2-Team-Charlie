const mongoose = require('mongoose');
//tell mongoose to use es6 implementation of promises
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/userprofiles'); 
mongoose.connection
    .once('open', () => {console.log('Connected!');})
    .on('error', (error) => {
        console.warn('Error : ',error);
    });
//Called hooks which runs before something.
beforeEach((done) => {
    mongoose.connection.collections.userprofiles.drop(() => {
         //this function runs after the drop is completed
        done(); //go ahead everything is done now.
    }); 
});