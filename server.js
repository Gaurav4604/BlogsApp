const express = require('express');
const morgan = require('morgan');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const {blogRouter} = require('./routes/blogRoutes');

dotenv.config({path: `${__dirname}/config.env`});

mongoose.connect(process.env.LOCAL_DB, {
    useNewUrlParser: true,
})
.then(() => console.log('db connection success'))
.catch((err) => console.log(err.message));

const app = express();

app.use(express.json());
app.use(morgan('dev'));

app.use('/api/v1/blogs', blogRouter);

app.listen(process.env.PORT, () => {
    console.log(`listening at port ${process.env.PORT}`)
});