import './config/env';
import express from 'express';
import morgan from 'morgan';
import helmet from 'helmet';
import ideasRoutes from './routes/ideasRoutes';
import { uuidMiddleware } from './middleware/uuidMiddleware';
import { errorMiddleware } from './middleware/errorMiddleware';

const app = express();
const port = process.env.PORT || 3000;

app.use(morgan('dev'));
app.use(helmet());
app.use(express.json());
app.use(uuidMiddleware);
app.use(errorMiddleware);

app.use('/api/ideas', ideasRoutes);

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
