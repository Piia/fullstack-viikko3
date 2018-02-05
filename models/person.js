const mongoose = require('mongoose')
const url = process.env.MONGODB_URI

mongoose.connect(url)

const schema = new mongoose.Schema({
  name: String,
  number: String
})

const Person = mongoose.model('Person', schema);
Person.format = (person) => {
  return {
    name: person.name,
    number: person.number,
    id: person._id
  }
}

module.exports = Person
