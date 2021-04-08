const fs = require("fs");

const args = process.argv.slice(2);

const usage = `Usage :-
$ ./todo add "todo item"  # Add a new todo
$ ./todo ls               # Show remaining todos
$ ./todo del NUMBER       # Delete a todo
$ ./todo done NUMBER      # Complete a todo
$ ./todo help             # Show usage
$ ./todo report           # Statistics`;

function add(todo) {
  fs.appendFileSync("todo.txt", `${todo}\n`);
  console.log("Added todo:", `"${todo.toString()}"`);
}

function getData(filename) {
  return fs.readFileSync(filename, { encoding: "utf8" }).split()[0].split("\n");
}

function list() {
  try {
    if (fs.existsSync("todo.txt")) {
      const arr = getData("todo.txt");
      for (let index = arr.length - 2; index >= 0; index--) {
        console.log(`[${index + 1}]`, arr[index]);
      }
    } else {
      console.log("There are no pending todos!");
    }
  } catch (err) {
    console.error(err);
  }
}

function del(id) {
  try {
    if (fs.existsSync("todo.txt")) {
      let arr = getData("todo.txt");
      arr = arr.slice(0, arr.length - 1);
      let found = false;
      for (var key in arr) {
        if (key == id - 1) {
          arr.splice(key, 1);
          found = true;
        }
      }
      if (found) {
        fs.writeFileSync("todo.txt", `${arr[0]}\n`);

        for (let index = 1; index < arr.length; index++) {
          fs.appendFileSync("todo.txt", `${arr[index]}\n`);
        }
        console.log(`Deleted todo #${id}`);
      } else {
        console.log(`Error: todo #${id} does not exist. Nothing deleted.`);
      }
    } else {
      console.log("There are no pending todos!");
    }
  } catch (err) {
    console.error(err);
  }
}

function done(id) {
  try {
    if (fs.existsSync("todo.txt")) {
      let arr = getData("todo.txt");
      arr = arr.slice(0, arr.length - 1);
      let found = false;
      let text;
      for (var key in arr) {
        if (key == id - 1) {
          text = arr[key];
          arr.splice(key, 1);
          found = true;
        }
      }
      if (found) {
        fs.writeFileSync("todo.txt", `${arr[0]}\n`);

        for (let index = 1; index < arr.length; index++) {
          fs.appendFileSync("todo.txt", `${arr[index]}\n`);
        }
        fs.appendFileSync(
          "done.txt",
          `x ${new Date().toISOString().slice(0, 10)} ${text}\n`
        );
        console.log(`Marked todo #${id} as done.`);
      } else {
        console.log(`Error: todo #${id} does not exist.`);
      }
    } else {
      console.log("There are no pending todos!");
    }
  } catch (err) {
    console.error(err);
  }
}

async function report() {
  let done = 0;
  let todo = 0;
  if (fs.existsSync("done.txt")) {
    const arr = fs
      .readFileSync("done.txt", { encoding: "utf8" })
      .split()[0]
      .split("\n");
    if (arr.length - 1 < 0) done = 0;
    else done = arr.length - 1;
  }

  if (fs.existsSync("todo.txt")) {
    const arr = fs
      .readFileSync("todo.txt", { encoding: "utf8" })
      .split()[0]
      .split("\n");
    if (arr.length - 1 < 0) todo = 0;
    else todo = arr.length - 1;
  }
  console.log(
    `${new Date()
      .toISOString()
      .slice(0, 10)} Pending : ${todo} Completed : ${done}`
  );
}

switch (args[0]) {
  case "help":
    console.log(usage);
    break;
  case "add":
    if (args[1]) {
      add(args[1]);
    } else {
      console.log("Error: Missing todo string. Nothing added!");
    }
    break;
  case "ls":
    list();
    break;
  case "del":
    if (args[1]) {
      del(args[1]);
    } else {
      console.log("Error: Missing NUMBER for deleting todo.");
    }
    break;
  case "done":
    if (args[1]) {
      done(args[1]);
    } else {
      console.log("Error: Missing NUMBER for marking todo as done.");
    }
    break;
  case "report":
    report();
    break;
  default:
    console.log(usage);
}
