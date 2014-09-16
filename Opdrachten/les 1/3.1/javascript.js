function person(name) {
	this.name = name;

	this.speak = function () {
		console.log("Hello, my name is" + this.name);
	}
}
var bob = new person("bob");
