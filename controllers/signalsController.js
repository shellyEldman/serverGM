const { emitSignal } = require('../service/signals');

let signals = {}
let intervals = {};

const get_signals = (req, res) => {
    res.status(200).json(signals);
}

const subscribe_signal = (req, res) => {
    const socketId = req.body.socketId;
    const signal = req.body.signal;
    const name = signal.name + "-" + socketId;

    if (!signal || !socketId) {
        res.status(400).json({ error: `Signal OR socketId was not provided` });
    }

    if (intervals[name]) {
        clearInterval(intervals[name]);
    }

    intervals[name] = setInterval(() => emitSignal(req.io, signal, socketId), 200);

    if (signals[socketId]) {
        signals[socketId] = [...signals[socketId].filter(s => s.name !== signal.name), { ...signal }];
    } else {
        signals[socketId] = [{ ...signal }];
    }

    res.status(200).json({ success: `Successfully subscribed to a signal - ${signal.name}` });
}

const unsubscribe_signal = (req, res) => {
    const socketId = req.body.socketId;
    const signalName = req.body.signalName;

    if (socketId && signalName) {
        const name = signalName + "-" + socketId;

        if (intervals[name]) {
            // clear interval
            clearInterval(intervals[name]);
        }

        if (signals[socketId]) {
            // remove from list
            signals[socketId] = signals[socketId].filter(s => s.name !== signalName);
            if (!signals[socketId].length) {
                delete signals[socketId];
            }
        }

        res.status(200).json({ success: `Successfully unsubscribed from a signal - ${signalName}` });
    } else {
        res.status(400).json({ error: `Signal name OR socketId was not provided` });
    }
}

const clearAllIntervals = (socketId) => {
    delete signals[socketId];

    Object.keys(intervals).forEach(name => {
        if (name.includes(socketId)) {
            clearInterval(intervals[name]);
            delete intervals[name];
        }
    });
}

module.exports = {
    get_signals,
    subscribe_signal,
    unsubscribe_signal,
    clearAllIntervals
}

