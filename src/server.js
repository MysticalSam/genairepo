const app = require('.');
const connectToMongo = require('./config/db.mongoose');

//define port
const port = process.env.PORT || 4000;

connectToMongo()
    .then(() => {
        app.listen(port, () => {
            console.log(`E-commerce API Server is running on port : ${port}`);
        })
    })
    .catch((err) => {
        console.log("MONGO db connection failed !!! ", err);
    })