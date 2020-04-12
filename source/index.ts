import app from './core/app';
import startJobs from './jobs';

require('dotenv').config();

const PORT = process.env.PORT || 3000;

const startApp = (): void => {
    startJobs();

    try {
        app.set('port', PORT);
        app.listen(app.get('port'), () => {
            return console.log(`Server Running http://localhost:${PORT}`);
        });
    } catch (err) {
        console.error(`Error occured ${err}`);
    }
};

startApp();
