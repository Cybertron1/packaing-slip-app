import mongoose from 'mongoose';
import nc from 'next-connect';

export default nc()
  .use(async (req, res, next) => {
    if (mongoose.connection.readyState === 0) {
      await mongoose.connect('mongodb://localhost:27017/slip', {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false
      });
    }
    return next();
  });
