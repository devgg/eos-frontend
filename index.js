const communication = require("./communication.js");
const server = require("./server.js");

class Argument {
  constructor(name, value) {
    this.name = name;
    this.value = value;
  }
}

class Action {
  constructor(contract, name, args, auth, description) {
    this.contract = contract;
    this.name = name;
    this.args = args;
    this.auth = new Argument("authentification", auth);
    this.description = description;
  }
}

function start(keyProvider, accounts, tables, actions) {
  communication.init(keyProvider, accounts, tables);
  server.start(actions);
}

module.exports.start = start;
module.exports.execute = communication.execute;
module.exports.Table = communication.Table;
module.exports.Argument = Argument;
module.exports.Action = Action;
