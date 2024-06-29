const liveServer = require("live-server");
const params = {
    port: 2173,
    host: "192.168.43.68",
    open: true,
    file: "index.html",
    wait: 1000,
    logLevel: 2,
    // proxy: [['/api', 'http://www.abc.com/api/']]
};
liveServer.start(params);