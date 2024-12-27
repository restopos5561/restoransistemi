const { app, server } = require('./app');
const config = require('./config');

const PORT = config.port || 3000;

server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 