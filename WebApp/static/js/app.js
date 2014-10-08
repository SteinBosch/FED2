var movies = movies || {};

(function(){

	movies.controller = {
		init: function () {
			movies.routie.init();
			//if we have something on local storage place that
			if(localStorage.getItem('movies')) {
				//var response = JSON.parse(localStorage.getItem('movies'));
				//movies.content['movies'] = response;
				//console.log(movies.content['movies']);
				//movies.sections.movies();
				movies.underscore.dataManipulate(localStorage.getItem('movies'));
				console.log("has localStorage")

				movies.worker.init();
			} else {
				movies.worker.work();
				console.log("no localStorage")
			}
			movies.sections.init();
		}
	}

	movies.worker = {
		init: function () {
			console.log("worker activated");

			setInterval(function () {
				movies.worker.work();
				console.log("work");
			}, 5000);
		},
		work: function () {
			var worker = new Worker('static/js/worker.js');
			
			worker.addEventListener('message', function(e) {
			  	// Log the workers message.
			  	//console.log(e.data);
			  	localStorage.setItem('movies', e.data);
			  	movies.underscore.dataManipulate(e.data);

				
			}, false);

			worker.postMessage('http://dennistel.nl/movies');
		}
	},

	movies.underscore = {
		dataManipulate: function (data) {
			//console.log(data);
			parsedData = JSON.parse(data);
			//console.log(parsedData);
			for (i = 0; i < parsedData.length; i++) { 
				//console.log(parsedData[i].reviews);
										// _.map( function(num, key){ return num * 3; });
			    parsedData[i].reviews = _.map(parsedData[i].reviews, function(num, key) {
			    	//console.log(num);
				    return { // return what new object will look like
				        reviewScore: num.score,
				    };
				});
				parsedData[i].reviews = _.reduce(parsedData[i].reviews, function(memo, num){ 
					return memo + num.reviewScore ; 
				}, 0 ) / parsedData[i].reviews.length;
			}

			//console.log(parsedData);
			movies.underscore.filter(parsedData);
		},

		filter: function (data) {
			var genre = '';

			var hash = window.location.hash;
			//console.log(hash);
			var splitHash = hash.split("/");
			//console.log(splitHash);

			if (splitHash[1] === "genre") {
				genre = splitHash[2];
				//console.log(genre);
				for (i = 0; i < data.length; i++) { 
					var data = _.filter(data, function (data) { return _.contains(data.genres, genre);
						}
		        	);
		        };
			};
			var input = document.querySelector(".input").value;
			console.log(input);

					var filtered = _.where(data, {author: "Shakespeare", year: 1611});

			console.log(filtered);

			console.log (data)
			movies.underscore.update(data);

		},
		 

		update: function (dataReady) {
			movies.content['movies'] = dataReady;
			stringifyedData = JSON.stringify(dataReady);
			
			movies.sections.movies();
		}
	},

	movies.routie = {
		init: function () {

			routie({
			    'about': function() {
					movies.sections.toggle.about();
			    },
			    'movies': function() {
					movies.sections.toggle.movies();
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
		init: function () {
			movies.sections.about();
		},

		about: function () {
			// console.log("aboutsections");
			Transparency.render(document.getElementById('about'), movies.content.about);
			Transparency.render(document.getElementById('discription'), movies.content.about.discription);
		},

		movies: function () {
			// console.log("moviessections");
			Transparency.render(document.getElementById('movies'), movies.content.movies, {
				cover: {
					src: function() {
						return this.cover;
					}
				}
			});

		},

		toggle : {
			getAllElementsWithAttribute: function (attribute) {
			 	var matchingElements = [];
			 	var allElements = document.getElementsByTagName('*');
			 	for (var i = 0, n = allElements.length; i < n; i++) {
			    	if (allElements[i].getAttribute(attribute)) {
			      		// Element exists with attribute. Add to array.
			      		matchingElements.push(allElements[i]);
			   		}
			  	}
			  	return matchingElements;
			},

			
			about: function () {
				var hash = movies.sections.toggle.getAllElementsWithAttribute('data-route');
				hash[1].className = "";
				hash[0].classList.add("active");
				console.log("#about");
			},

			movies: function () {
				var hash = movies.sections.toggle.getAllElementsWithAttribute('data-route');
				hash[0].className = "";
				hash[1].classList.add("active");	
				console.log("#movies");
			},
		},
	}

	movies.controller.init();

	// console.log(movies.content.about.title);
	// console.log(movies.content.about.discription);
	// console.log(movies.content.movies);
})();