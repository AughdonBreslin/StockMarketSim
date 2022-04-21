

const dbConnection = require('../config/mongoConnection');
const data = require('../data/');
// const bands = data.bands;
// const albums = data.albums;

async function main() {

    console.log('Seeding...');
    const db = await dbConnection.dbConnection();
    await db.dropDatabase();


    // variables:
    // let band1;

    // Create band 1
    // try {
    //     band1 = await bands.create(
    //         'Band A',
    //         ['genre A', 'genre B'],
    //         'http://www.band1website.com',
    //         'recordLabel',
    //         ['Member A', 'Member B', 'Member C'],
    //         2018
    //     );
    //     band1_id = band1._id.toString();
    // } catch (e) {
    //     console.log(e);
    // }


    console.log('Done seeding database');
    await dbConnection.closeConnection();
}

main();