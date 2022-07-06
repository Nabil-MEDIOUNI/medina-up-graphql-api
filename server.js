const express = require('express');
const http = require('http');

const {
  ApolloServer,
  PubSub,
  AuthenticationError,
} = require('apollo-server-express');

const bodyParser = require('body-parser');
const cors = require('cors');
const cookieParser = require('cookie-parser');

const typeDefs = require('./src/graphql/typedefs');
const resolvers = require('./src/graphql/resolvers');
const authRoutes = require('./src/api/routes/auth');

const pubsub = new PubSub();

const app = express();

require('./db/config').connect();
require('./src/helpers/uploadFile').cloudinaryConfig();

const corsOptions = {
  origin: process.env.REACT_APP_API_URL,
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

app.use(bodyParser.json({ limit: '4mb' })); // ability to upload data less than 4mb
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', process.env.REACT_APP_API_URL);
  res.setHeader('Access-Control-Allow-Methods', 'POST,GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Credentials', true);
  if (req.method === 'OPTIONS') {
    return res.sendStatus(200);
  }
  next();
});

app.use('/auth', authRoutes);

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: ({ req, res, connection }) => {
    const authHeader = !connection && req.get('Authorization');

    if (!authHeader) {
      throw new AuthenticationError('Invalid, missing or expired token');
    }

    return {
      res, req, pubsub,
    };
  },
  introspection: true,
  playground: {
    settings: {
      'request.credentials': 'same-origin',
    },
  },
});

server.applyMiddleware({ app, cors: corsOptions });

const httpServer = http.createServer(app);
server.installSubscriptionHandlers(httpServer);

httpServer.listen(process.env.PORT);
