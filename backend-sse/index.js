const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors')
const server = express();
const helmet = require('helmet')
const port = 3000;
server.use(cors())
server.use(helmet());
server.use(bodyParser.json({ strict: false }));

const useServerSentEventsMiddleware = (req, res, next) => {
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');

    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    res.flushHeaders();

    const sendEventStreamData = (data) => {
        console.log("DATA: ", data);
        const sseFormattedResponse = `data: ${JSON.stringify(data)}\n\n`;
        res.write(sseFormattedResponse);
    }

    Object.assign(res, {
        sendEventStreamData
    });

    next();
}

const streamRandomNumbers = (req, res) => {
    let interval = setInterval(function generateAndSendRandomNumber() {
        const data = {
            value: Math.random(),
        };

        res.sendEventStreamData(data);
    }, 1000);

    res.on('close', () => {
        clearInterval(interval);
        res.end();
    });
}

server.get('/random', useServerSentEventsMiddleware, streamRandomNumbers)
server.get('/', (req, res) => {
    res.send('AWS EC2 Ready')
})


server.listen(port, () => console.log(`Server Ready Post : ${port}`));
