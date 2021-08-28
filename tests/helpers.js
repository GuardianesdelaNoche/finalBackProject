const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const initialTags = [
    {
        name: "Taichi al aire libre",
    },
    {
        name: "Yoga en la naturaleza",
    },
]

const getAllNameFromTags = async() => {
    const response = await api.get('/api/v1/tags')
    return {
        names: response.body.tags.map(tag => tag.name),
        response
    }
}

module.exports = {
    initialTags,
    api,
    getAllNameFromTags
}