const api = require('./api');
const app = api.app;
app.listen(3000, () => console.log('Service on'));
