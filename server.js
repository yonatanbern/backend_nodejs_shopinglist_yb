const exp = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const app = exp();

//Item object - conatains all user input data - for maintaing inside the db variable
class Item {
  constructor(id, name, description, count) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.count = count;
  }
}

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(exp.static("public"));
app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Headers", "Origin, X-Resquested-With, Content-Type, Accept");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();

});
app.set('view engine', 'ejs');

//DB Variable - contains all of the items
var listOfItems = [];


app.get('/', (req, res) => {
  res.sendFile(__dirname + '/indexx.html');
});


app.get('/about', (req, res) => {
  console.log("start listening on about");
  res.sendFile(__dirname + '/about.html');
});

//func for find item's index in the db variable
function getItemIndexById(id) {
  var i;
  for (i = 0; i < listOfItems.length; i++) {
    if (listOfItems[i].id == id) {
      return i;
    }
  }
  return -1;
}

/* REST Apis' Commands */

//Get all items' list
app.get('/items', (req, res) => {
  res.send(listOfItems);
});

//Get specific item by id in the url
app.get('/items/:itemid', (req, res) => {
  var id = req.params.itemid;
  var item_idx = getItemIndexById(id);
  if (item_idx >= 0){
    res.send(listOfItems[item_idx]);
  }
  else {
    res.send("Item Not found in the inventory...");
  }
});

//Add item to DB
app.post('/items', (req, res) => {

  var itm = new Item(req.body.id, req.body.name, req.body.description, parseInt(req.body.count));
  listOfItems.push(itm);
  res.send(listOfItems);
});

//Delete item by a *specific id from user
app.delete('/items', (req, res) => {
  var id = req.body.id;

  var itemIdx = getItemIndexById(id);
  if (itemIdx >= 0) {
    listOfItems.splice(itemIdx, 1);
    res.send(listOfItems);
  } else {
    res.send("Item NOT found, please check your request id..");
  }
});

//Update item description by given id
app.put('/items/updatedetail', (req, res) => {
  var id = req.body.id;
  var new_desc = req.body.description;
  var itemIdx = getItemIndexById(id);
  if (itemIdx >= 0) {
    listOfItems[itemIdx].description = new_desc;
    res.send("Item's description Updated succesfully!");
  } else {
    res.send("Item NOT found, please check your request id...");
  }
});


//Update item's count by given id & amount by user
app.put('/items', (req, res) => {

  var id = req.body.id;
  var amount = req.body.count;
  var operation = req.body.description;

  var itemIdx = getItemIndexById(id);
  if (itemIdx >= 0) {
    if (operation == "add") {
      listOfItems[itemIdx].count = listOfItems[itemIdx].count + parseInt(amount);
    } else if (operation == "sub") {
      listOfItems[itemIdx].count = listOfItems[itemIdx].count - parseInt(amount);
      if (listOfItems[itemIdx].count < 0) {
        listOfItems[itemIdx].count = 0;
      }
    }
    res.send(listOfItems);
  } else {
    res.send("Item NOT found, please check your request id...");
  }
});

/* end of REST */

// listening port for Server
app.listen(3000, function() {
  console.log("start listening on port 3000...");
});
