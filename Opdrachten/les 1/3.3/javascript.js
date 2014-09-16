var person = {
	name: 'Bob',
	
	speak: function () {
		console.log('Hi, my name is ' + this.name);
	},

	walk: function () {
		console.log('Hi, my name is ' + this.name + " and I walk");
	},

	eat: function () {
		console.log('Hello, my name is ' + this.name + " and I eat");
	}
}

person.speak();