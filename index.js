import { Server } from 'socket.io';
import Connection from './database/db.js';
import { getDocument, updateDocument } from './controller/document-controller.js'
const PORT = process.env.PORT || 9000;

Connection();
const BASEPATH = process.env.BASEPATH


const io = new Server(PORT, {
    cors: {
        origin: BASEPATH, // Corrected the URL format
        origin: '*', // Corrected the URL format
        methods: ['GET', 'POST']
    }
});
io.on('connection', socket => {
    socket.on('get-document', async documentId => {
        const document = await getDocument(documentId);
        socket.join(documentId);
        socket.emit('load-document', document.data);
        socket.on('send-changes', delta => {
            socket.broadcast.to(documentId).emit('receive-changes', delta);
        })
        socket.on('save-document', async data => {
            await updateDocument(documentId, data);
        })
    })
});
