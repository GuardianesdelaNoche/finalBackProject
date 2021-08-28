const moongose = require('../lib/connectMongoose');
const Tag = require('../models/Tag');
const {initialTags, api, getAllNameFromTags} = require('./helpers');

beforeEach(async () => {
    await Tag.deleteMany({})

    const tag1 = new Tag(initialTags[0]);
    await tag1.save();

    const tag2 = new Tag(initialTags[1]);
    await tag2.save();
})
test('tags are returned as json', async () =>{
    await api
        .get('/api/v1/tags')
        .expect(200)
        .expect('Content-Type', /application\/json/)
})

test('there are returned two tags', async () =>{
    const response = await api.get('/api/v1/tags')
    expect(response.body.tags).toHaveLength(initialTags.length);
})

test('the firts tag is a Taichi', async () =>{
    const response = await api.get('/api/v1/tags')

    const names = response.body.tags.map(tag => tag.name)

    expect(names).toContain('Taichi al aire libre')
})

test('a valid tag can be added', async () => {
    const newTag = {
        name: 'Baile urbano'
    }

    await api
        .post('/api/v1/tags')
        .send(newTag)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    
    const {names, response} = await getAllNameFromTags();

    expect(response.body.tags).toHaveLength(initialTags.length + 1);
    expect(names).toContain(newTag.name)
})

test('tag without name is not added', async () => {
    const newTag = {
       
    }

    await api
        .post('/api/v1/tags')
        .send(newTag)
        .expect(500)
        .expect('Content-Type', /application\/json/)

    const response = await api.get('/api/v1/tags')

    expect(response.body.tags).toHaveLength(initialTags.length);

})
afterAll(()=>{
    moongose.close();
})
