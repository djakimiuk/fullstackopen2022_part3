const mongoose = require("mongoose");

const password = process.argv[2];

const url = `mongodb+srv://djakimiuk:${password}@cluster0.lqq363l.mongodb.net/phonebook?retryWrites=true&w=majority`;

mongoose.set(`strictQuery`, false);
mongoose.connect(url);

const contactSchema = new mongoose.Schema({
  person: String,
  number: String,
});

const Contact = mongoose.model("Contact", contactSchema);

if (process.argv.length < 3) {
  console.log(`Password missing!`);
  process.exit(1);
} else if (process.argv.length === 3) {
  Contact.find({}).then((result) => {
    result.forEach((contact) => {
      console.log(contact);
    });
    mongoose.connection.close();
  });
} else if (process.argv.length === 5) {
  const contact = new Contact({
    person: process.argv[3],
    number: process.argv[4],
  });
  contact.save().then((result) => {
    console.log(`New contact saved!`);
    mongoose.connection.close();
  });
} else {
  console.log(`Invalid program startup!`);
}


