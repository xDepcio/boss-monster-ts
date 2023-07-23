"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Player = require("../logic/player/player");
function assignPlayer(req, res, next) {
    const userId = req.body.userId;
    const player = Player.getPlayer(userId);
    if (!player) {
        console.log('NP SUCH PLAYER IN ...ASSIGNPLAYER');
    }
    else {
        req.player = player;
        next();
    }
}
module.exports = {
    assignPlayer
};
