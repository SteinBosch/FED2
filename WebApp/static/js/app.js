//Namespace
var movies = movies || {};

//Self invoking function
(function(){

	movies.controller = {
		init: function () {
			if(localStorage.getItem('movies')) {
				console.log("has localStorage")

				movies.content['movies'] = JSON.parse(localStorage.getItem('movies'));
				movies.worker.init();
				movies.routie.init();

			} else {
				console.log("no localStorage")
				movies.worker.work();
				document.querySelector("#firstTimeData").classList.add("show");
				document.querySelector("#content").classList.add("showFirstTime");
				setTimeout(function () {
					console.log("localStorage set")
					movies.content['movies'] = JSON.parse(localStorage.getItem('movies'));
					movies.worker.init();
					movies.routie.init();
					document.querySelector("#firstTimeData").classList.remove("show");
					document.querySelector("#content").classList.remove("showFirstTime");

				}, 2000);
				
			}
			movies.misc.init();
		}
	}

	movies.worker = {
		init: function () {
			console.log("worker activated");

			setInterval(function () {
				movies.worker.work();
				console.log("work");
			}, 10000);

		},
		work: function () {
			var worker = new Worker('static/js/worker.js');
			
			worker.addEventListener('message', function(e) {

			  	movies.underscore.dataManipulate(e.data);

				
			}, false);

			worker.postMessage('http://dennistel.nl/movies');
		}
	},

	movies.underscore = {
		dataManipulate: function (data) {

			parsedData = JSON.parse(data);
			for (i = 0; i < parsedData.length; i++) { 
			    parsedData[i].reviews = _.map(parsedData[i].reviews, function(num) {

				    return {
				        reviewScore: num.score,
				    };
				});
				parsedData[i].reviews = _.reduce(parsedData[i].reviews, function(memo, num){ 
					return memo + num.reviewScore; 

				}, 0 ) / parsedData[i].reviews.length;
			}

			localStorage.clear('movies');
			localStorage.setItem('movies', JSON.stringify(parsedData));
			console.log("Work done");

		},

		filter: function (genre) {
			console.log(genre);

			var data = JSON.parse(localStorage.getItem('movies'));
			console.log(data);

			var data = _.filter(data, function (data) { return _.contains(data.genres, genre);});
			console.log(data);

			movies.underscore.update(data);
		},

		input: function (input) {
			var data = movies.content['movies'];
			var data = _.filter(data, function(data) {
							var title = data.title.toLowerCase();

							if (title.indexOf(input.toLowerCase()) !=-1) {
							    return data;
							}
						});
		    movies.underscore.update(data);
		},
		sortBy: function (sort) {
			var data = movies.content['movies'];
			console.log(data);
			console.log(sort);

	        if (sort === "datedown") {
	        	var data = _(data).chain().sortBy(function (num){ 
	
				    var parts = num.release_date.split(' ');

				    var monthNames = [ "January", "February", "March", "April", "May", "June",
				    "July", "August", "September", "October", "November", "December" ];

				    var monthValue = monthNames.indexOf(parts[1]);
				    var date = new Date( parts[2],  monthValue, parts[0]);
					var sort = -date.getTime();
					return sort;
		        }).value();
	        }

	        if (sort === "dateup") {
	        	var data = _(data).chain().sortBy(function (num){ 
	
				    var parts = num.release_date.split(' ');

				    var monthNames = [ "January", "February", "March", "April", "May", "June",
				    "July", "August", "September", "October", "November", "December" ];

				    var monthValue = monthNames.indexOf(parts[1]);
				    var date = new Date( parts[2],  monthValue, parts[0]);
					var sort = date.getTime();
					return sort;
		        }).value();

	        }	    		    

			console.log(data);
			movies.underscore.update(data);

		},
		reset: function () {
			var data = JSON.parse(localStorage.getItem('movies'));
			movies.underscore.update(data);
		},

		update: function (dataReady) {
			movies.content['movies'] = dataReady;
			movies.sections.movies();
		}
	},

	movies.detail = {
		data: function (title) {

			var data = JSON.parse(localStorage.getItem('movies'));

			var data = 
				_.filter(data, function (data) {
					var escapedUrl = data.title.replace(/ /g,"-").toLowerCase();
					//console.log(escapedUrl);
					if (title === escapedUrl) {
						console.log("ja");
						return data;
					};
				});

			console.log(data);
			movies.content['movies'] = data;
			movies.sections.detail();
		},
	},

	movies.routie = {
		init: function () {

			routie({
				'': function() {
			    	console.log("leeg")
			    	window.location.hash = "about"
			    },
			    'about': function() {
			    	movies.sections.about();
					movies.sections.toggle.about();
			    },
			    'movies': function() {
			    	movies.underscore.reset();
			    	movies.sections.movies();
					movies.sections.toggle.movies();
			    },
			    'movies/:title': function(title) {
			    	console.log(title);
			    	movies.detail.data(title);
			    	movies.sections.toggle.detail();
				},
			    'movies/genre/:genre': function(genre) {
			    	movies.underscore.filter(genre);
			    	movies.sections.toggle.movies();
				},
				'movies/sortby/:sort': function(sort) {
			    	movies.underscore.sortBy(sort);
			    	movies.sections.toggle.movies();
				},
				'movies/search/input': function() {
					var input = document.querySelector(".input").value;
					console.log(input);
					if (input.length > 0){
						console.log(input);
					   	movies.underscore.input(input);
			    		movies.sections.toggle.movies();
					}
					window.location.hash = "movies/search/input-done"
				},
				
			    'movies/*': function() {
			    	movies.sections.toggle.movies();
			    	movies.worker.work();
				},
			});
		}
	},

	movies.content = {

		about : {
			title : "About this app",
			discription : [
				{
					paragraph : "Cities fall but they are rebuilt. heroes die but they are remembered. the man likes to play chess; let's get him some rocks. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. bruce... i'm god. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all. rehabilitated? well, now let me see. you know, i don't have any idea what that means. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. rehabilitated? well, now let me see. you know, i don't have any idea what that means. cities fall but they are rebuilt. heroes die but they are remembered. no, this is mount everest. you should flip on the discovery channel from time to time. but i guess you can't now, being dead and all.",
				},
				{
					paragraph : "I did the same thing to gandhi, he didn't eat for three weeks. bruce... i'm god. cities fall but they are rebuilt. heroes die but they are remembered. i once heard a wise man say there are no perfect men. only perfect intentions. cities fall but they are rebuilt. heroes die but they are remembered. boxing is about respect. getting it for yourself, and taking it away from the other guy. well, what is it today? more spelunking? let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. bruce... i'm god. well, what is it today? more spelunking? it only took me six days. same time it took the lord to make the world. i did the same thing to gandhi, he didn't eat for three weeks.",
				},
				{
					paragraph : "Let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. boxing is about respect. getting it for yourself, and taking it away from the other guy. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. you measure yourself by the people who measure themselves by you. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. circumstances have taught me that a man's ethics are the only possessions he will take beyond the grave. you measure yourself by the people who measure themselves by you. you measure yourself by the people who measure themselves by you. that tall drink of water with the silver spoon up his ass. i once heard a wise man say there are no perfect men. only perfect intentions. mister wayne, if you don't want to tell me exactly what you're doing, when i'm asked, i don't have to lie. but don't think of me as an idiot. boxing is about respect. getting it for yourself, and taking it away from the other guy.",
				},
				{
					paragraph : "That tall drink of water with the silver spoon up his ass. well, what is it today? more spelunking? i now issue a new commandment: thou shalt do the dance. let me tell you something my friend. hope is a dangerous thing. hope can drive a man insane. i did the same thing to gandhi, he didn't eat for three weeks. the man likes to play chess; let's get him some rocks. i now issue a new commandment: thou shalt do the dance. i now issue a new commandment: thou shalt do the dance. multiply your anger by about a hundred, kate, that's how much he thinks he loves you. i don't think they tried to market it to the billionaire, spelunking, base-jumping crowd. that tall drink of water with the silver spoon up his ass. it only took me six days. same time it took the lord to make the world.",
				},
			],
		},

		movies : []
	},

	movies.sections = {

		about: function () {
			Transparency.render(document.getElementById('top'), {title : "About this app"});

			Transparency.render(document.getElementById('discription'), movies.content.about.discription);
		},

		movies: function () {
			Transparency.render(document.getElementById('top'), {title : "Favorite movies"});
			Transparency.render(document.getElementById('movies'), movies.content.movies, {
				cover: {
					src: function() {
						return this.cover;
					}
				},
				link: {
					href: function() {
						var escapedUrl = this.title.replace(/ /g,"-").toLowerCase();
						return "#movies/"+escapedUrl;
					},
					text: function() {
				      return "Details of this movie";
				    }
				}
			});
		},
		detail: function () {
			Transparency.render(document.getElementById('top'), {title : "Movie details"});
			Transparency.render(document.getElementById('detail'), movies.content.movies, {
				cover: {
					src: function() {
						return this.cover;
					}
				},
				actors: {
					url_photo: {
						src: function() {
							return this.url_photo;
							console.log(this);
						}
					},
				},
				genres: {
				    genre: {
						text: function() {
							return this.value;
						}
					},
				},
			});

		},

		toggle : {
			
			about: function () {
				document.querySelector("section[data-route=about]").classList.add("active");
				document.querySelector("section[data-route=movies]").className = "";
				document.querySelector("section[data-route=detail]").className = "";
			},

			movies: function () {
				document.querySelector("section[data-route=about]").className = "";
				document.querySelector("section[data-route=movies]").classList.add("active");
				document.querySelector("section[data-route=detail]").className = "";
			},
			detail: function () {
				document.querySelector("section[data-route=about]").className = "";
				document.querySelector("section[data-route=movies]").className = "";
				document.querySelector("section[data-route=detail]").classList.add("active");
			},
		},
	},
	
	movies.misc = {
		init: function () {
			movies.misc.app();
			movies.misc.hammer();
		},

		app: function () {

			var classname = document.getElementsByClassName("nav-toggle");

		    var classnameFunction = function() {
		        document.querySelector("body").classList.toggle("nav-active");
		    };

		    for(var i=0;i<classname.length;i++){
		        classname[i].addEventListener('click', classnameFunction, false);
		    };



		    var nav_a = document.querySelectorAll("nav a");
		    console.log(nav_a);

		    var nav_aFunction = function() {
		        document.querySelector("body").className = "";
		    };

		    for(var i=0;i<nav_a.length;i++){
		        nav_a[i].addEventListener('click', nav_aFunction, false);
		    };
		},

		hammer: function () {
			var content = document.getElementById("content");
			var navigation = document.getElementById("navigation");

			Hammer(content).on("swiperight", function() {
			    document.querySelector("body").classList.add("nav-active");
			});
			Hammer(navigation).on("swipeleft", function() {
			    document.querySelector("body").className = "";
			});
		},
	},

	movies.controller.init();
})();