export const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://10.12.0.20:3001'], // Adjust this to your client's origin
  methods: ['GET', 'POST'],
  credentials: true,
};
