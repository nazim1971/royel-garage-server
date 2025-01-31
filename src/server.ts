import { Server } from 'http';
import app from './app';
import config from './app/config';

let server : Server
// Async method to start the server
async function start() {
  try {
    await config.connectDB();  
   server = app.App.listen(config.port, () => {
      console.log(`Server is running on Port: ${config.port}`);
    });
  } catch (error) {
    console.error('Error starting the server:', error);
  }
}


start();

process.on('unhandledRejection', ()=>{
  console.log(`Unhandle rejection and shutting down server`);
  if(server){
    server.close(()=>{
      process.exit(1)
    })
  }
  process.exit(1)
})

process.on('uncaughtException', () => {
  console.log(`😈 uncaughtException is detected , shutting down ...`);
  process.exit(1);
});
