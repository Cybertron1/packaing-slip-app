import jwt from 'jsonwebtoken';
import nc from 'next-connect';

const secret = process.env.SHOPIFY_API_SECRET;

async function auth(req, res, next) {
  if (!req.headers.authorization) {
    res.status(401).send('JWT not provided');
    res.end();
  }

  let token = req.headers.authorization.replace('Bearer ', '');
  try {
    if (process.env.NODE_ENV === 'development') {
      token = jwt.decode(token);
    } else {
      console.log(process.env.NODE_ENV);
      token = jwt.verify(token, secret);
    }

  } catch (err) {
    res.status(401).send('invalid jwt');
    res.end();
    return;
  }
  req.token = token;
  return next();
}

const middleware = nc().use(auth);

export default middleware;
