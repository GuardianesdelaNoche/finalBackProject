const Tag = require('../models/Tag');


module.exports = async function initTags() {
    try {
        const tags = [
            { name: 'yoga' },
            { name: 'baile' }, 
            { name: 'futbol' }, 
            { name:'paintball' }, 
            { name:'concierto'}
        ];
        const { deletedCount } = await Tag.deleteMany();
        console.log(`Deleted ${deletedCount} tags.`);

        await Tag.insertMany(tags);
    } catch (error) {
        console.log(error);
    }
}