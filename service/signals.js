const emitSignal = (io, signal, socketId) => {
    const min = signal.min;
    const max = signal.max;
    const value = (Math.random() * (max - min) + min).toFixed(2);
    io.to(socketId).emit(signal.name, { value });
}

module.exports = {
    emitSignal
}