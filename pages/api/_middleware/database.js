import mongoose from 'mongoose';
import nc from 'next-connect';

export default nc()
  .use(async (req, res, next) => {
    console.log(mongoose.connection.readyState);
    console.log(process.env.MONGO_DB_URI);
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect(process.env.MONGO_DB_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
    }
    return next();
  });
