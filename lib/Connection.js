const MongoClient = require('mongodb').MongoClient

class Connection {
    // or in the new async world
    static async connectToMongo() {
        if (this.db) return this.db
        this.db = await MongoClient.connect(this.url, this.options)
        console.log('DB CONNECTED')
        return this.db
    }
}

Connection.db = null
Connection.url = 'mongodb+srv://db-user:K1ttyl1tt3r@alamo.bylol.mongodb.net/alamo-db?retryWrites=true&w=majority'
Connection.options = {
    bufferMaxEntries:   0,
    useNewUrlParser:    true,
    useUnifiedTopology: true,
}

module.exports = { Connection }
