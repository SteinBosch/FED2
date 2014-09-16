function person(name) {
	this.name = name;

	this.speak = function () {
		console.log("Hello, my name is" + this.name);
	}
}

person.prototype.walk = function () {
	console.log('Hello, my name is ' + this.name + " and I walk");
};

person.prototype.eat = function () {
	console.log('Hello, my name is ' + this.name + " and I eat");
};

var bob = new person("bob");
