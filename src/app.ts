import express, { Request, Response } from 'express';
import cors from 'cors';
import router from './app/routes';
import globalErrorHandler from './app/middlewire/globalErrorHandler';
import notFound from './app/middlewire/notFound';
import cookieParser from 'cookie-parser';


class Application {
  public App: express.Application;

  constructor() {
    this.App = express();
    this.middleware();
    this.routes();
  }

  private middleware() {
    this.App.use(express.json());
    this.App.use(cookieParser());
    this.App.use(cors({
      origin: ['https://royal-garage.vercel.app',"http://localhost:5173"],
      credentials: true
    }));
  }

  private routes() {
    //Application Routes
    this.App.use('/api', router);
    this.App.get('/', (req: Request, res: Response) => {
      res.status(200).json({
        success: true,
        message: 'Royal garage server on Fire 🔥🔥🔥',
      });
    });

    //Global error handel
    this.App.use(globalErrorHandler);

    //Not found
    this.App.use(notFound);
  }
}

export default new Application();
