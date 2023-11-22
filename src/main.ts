import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { IoAdapter } from '@nestjs/platform-socket.io';
import { corsOptions } from './cors-options'; // Import the CORS options
import * as ejs from 'ejs'; // Import the template engine
import mongoose from 'mongoose';

async function bootstrap() {
  await connectDb();
  const app = await NestFactory.create(AppModule);
  app.use(cookieParser()); // Use cookie-parser for handling cookies
  // app.useWebSocketAdapter(new IoAdapter(app));
  app.enableCors(corsOptions);
  // app.set('view engine', 'ejs');
  // app.set('views', 'src/views'); // Specify the path to your views directory
  app.useWebSocketAdapter(new IoAdapter(app));
  await app.listen(3000);
}
bootstrap();

async function connectDb() {
  const MONGO_URI = `mongodb://${process.env.MONGO_HOST}:27017/chat`;

  await mongoose.connect(MONGO_URI);

  // Define a schema for messages
  const messageSchema = new mongoose.Schema({
    createdAt: {type: Date, default: Date.now},
    roomId: String,
    username: String,
    message: String,
  });

  // Create a Mongoose model
  const Message = mongoose.model('Message', messageSchema);
  console.log('Message registered');
}
