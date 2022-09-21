import express from 'express';
const app = express();
app.get('/ads', (_request, response) => {
    return response.send('Hello world');
});
app.listen(3333);
