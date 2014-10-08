/*!
 * routie - a tiny hash router
 * v0.3.2
 * http://projects.jga.me/routie
 * copyright Greg Allen 2013
 * MIT License
*/
(function(w) {

  var routes = [];
  var map = {};
  var reference = "routie";
  var oldReference = w[reference];

  var Route = function(path, name) {
    this.name = name;
    this.path = path;
    this.keys = [];
    this.fns = [];
    this.params = {};
    this.regex = pathToRegexp(this.path, this.keys, false, false);

  };

  Route.prototype.addHandler = function(fn) {
    this.fns.push(fn);
  };

  Route.prototype.removeHandler = function(fn) {
    for (var i = 0, c = this.fns.length; i < c; i++) {
      var f = this.fns[i];
      if (fn == f) {
        this.fns.splice(i, 1);
        return;
      }
    }
  };

  Route.prototype.run = function(params) {
    for (var i = 0, c = this.fns.length; i < c; i++) {
      this.fns[i].apply(this, params);
    }
  };

  Route.prototype.match = function(path, params){
    var m = this.regex.exec(path);

    if (!m) return false;


    for (var i = 1, len = m.length; i < len; ++i) {
      var key = this.keys[i - 1];

      var val = ('string' == typeof m[i]) ? decodeURIComponent(m[i]) : m[i];

      if (key) {
        this.params[key.name] = val;
      }
      params.push(val);
    }

    return true;
  };

  Route.prototype.toURL = function(params) {
    var path = this.path;
    for (var param in params) {
      path = path.replace('/:'+param, '/'+params[param]);
    }
    path = path.replace(/\/:.*\?/g, '/').replace(/\?/g, '');
    if (path.indexOf(':') != -1) {
      throw new Error('missing parameters for url: '+path);
    }
    return path;
  };

  var pathToRegexp = function(path, keys, sensitive, strict) {
    if (path instanceof RegExp) return path;
    if (path instanceof Array) path = '(' + path.join('|') + ')';
    path = path
      .concat(strict ? '' : '/?')
      .replace(/\/\(/g, '(?:/')
      .replace(/\+/g, '__plus__')
      .replace(/(\/)?(\.)?:(\w+)(?:(\(.*?\)))?(\?)?/g, function(_, slash, format, key, capture, optional){
        keys.push({ name: key, optional: !! optional });
        slash = slash || '';
        return '' + (optional ? '' : slash) + '(?:' + (optional ? slash : '') + (format || '') + (capture || (format && '([^/.]+?)' || '([^/]+?)')) + ')' + (optional || '');
      })
      .replace(/([\/.])/g, '\\$1')
      .replace(/__plus__/g, '(.+)')
      .replace(/\*/g, '(.*)');
    return new RegExp('^' + path + '$', sensitive ? '' : 'i');
  };

  var addHandler = function(path, fn) {
    var s = path.split(' ');
    var name = (s.length == 2) ? s[0] : null;
    path = (s.length == 2) ? s[1] : s[0];

    if (!map[path]) {
      map[path] = new Route(path, name);
      routes.push(map[path]);
    }
    map[path].addHandler(fn);
  };

  var routie = function(path, fn) {
    if (typeof fn == 'function') {
      addHandler(path, fn);
      routie.reload();
    } else if (typeof path == 'object') {
      for (var p in path) {
        addHandler(p, path[p]);
      }
      routie.reload();
    } else if (typeof fn === 'undefined') {
      routie.navigate(path);
    }
  };

  routie.lookup = function(name, obj) {
    for (var i = 0, c = routes.length; i < c; i++) {
      var route = routes[i];
      if (route.name == name) {
        return route.toURL(obj);
      }
    }
  };

  routie.remove = function(path, fn) {
    var route = map[path];
    if (!route)
      return;
    route.removeHandler(fn);
  };

  routie.removeAll = function() {
    map = {};
    routes = [];
  };

  routie.navigate = function(path, options) {
    options = options || {};
    var silent = options.silent || false;

    if (silent) {
      removeListener();
    }
    setTimeout(function() {
      window.location.hash = path;

      if (silent) {
        setTimeout(function() { 
          addListener();
        }, 1);
      }

    }, 1);
  };

  routie.noConflict = function() {
    w[reference] = oldReference;
    return routie;
  };

  var getHash = function() {
    return window.location.hash.substring(1);
  };

  var checkRoute = function(hash, route) {
    var params = [];
    if (route.match(hash, params)) {
      route.run(params);
      return true;
    }
    return false;
  };

  var hashChanged = routie.reload = function() {
    var hash = getHash();
    for (var i = 0, c = routes.length; i < c; i++) {
      var route = routes[i];
      if (checkRoute(hash, route)) {
        return;
      }
    }
  };

  var addListener = function() {
    if (w.addEventListener) {
      w.addEventListener('hashchange', hashChanged, false);
    } else {
      w.attachEvent('onhashchange', hashChanged);
    }
  };

  var removeListener = function() {
    if (w.removeEventListener) {
      w.removeEventListener('hashchange', hashChanged);
    } else {
      w.detachEvent('onhashchange', hashChanged);
    }
  };
  addListener();

  w[reference] = routie;
   
})(window);;(function(t,e,n,r){function i(r){if(!n[r]){if(!e[r]){if(t)return t(r);throw Error("Cannot find module '"+r+"'")}var o=n[r]={exports:{}};e[r][0](function(t){var n=e[r][1][t];return i(n?n:t)},o,o.exports)}return n[r].exports}for(var o=0;r.length>o;o++)i(r[o]);return i})("undefined"!=typeof require&&require,{1:[function(t,e){var n,r,i,o,s,u=[].indexOf||function(t){for(var e=0,n=this.length;n>e;e++)if(e in this&&this[e]===t)return e;return-1};s=t("../lib/lodash.js"),o=t("./helpers"),r=t("./context"),i={},i.render=function(t,e,n,u){var l,a;return null==e&&(e=[]),null==n&&(n={}),null==u&&(u={}),l=u.debug&&console?o.consoleLogger:o.nullLogger,l("Transparency.render:",t,e,n,u),t?(s.isArray(e)||(e=[e]),t=(a=o.data(t)).context||(a.context=new r(t,i)),t.render(e,n,u).el):void 0},i.matcher=function(t,e){return t.el.id===e||u.call(t.classNames,e)>=0||t.el.name===e||t.el.getAttribute("data-bind")===e},i.clone=function(t){return n(t).clone()[0]},i.jQueryPlugin=o.chainable(function(t,e,n){var r,o,s,u;for(u=[],o=0,s=this.length;s>o;o++)r=this[o],u.push(i.render(r,t,e,n));return u}),("undefined"!=typeof jQuery&&null!==jQuery||"undefined"!=typeof Zepto&&null!==Zepto)&&(n=jQuery||Zepto,null!=n&&(n.fn.render=i.jQueryPlugin)),(e!==void 0&&null!==e?e.exports:void 0)&&(e.exports=i),"undefined"!=typeof window&&null!==window&&(window.Transparency=i),("undefined"!=typeof define&&null!==define?define.amd:void 0)&&define(function(){return i})},{"../lib/lodash.js":2,"./helpers":3,"./context":4}],2:[function(t,e,n){var r={};r.toString=Object.prototype.toString,r.toArray=function(t){for(var e=Array(t.length),n=0;t.length>n;n++)e[n]=t[n];return e},r.isString=function(t){return"[object String]"==r.toString.call(t)},r.isNumber=function(t){return"[object Number]"==r.toString.call(t)},r.isArray=Array.isArray||function(t){return"[object Array]"===r.toString.call(t)},r.isDate=function(t){return"[object Date]"===r.toString.call(t)},r.isElement=function(t){return!(!t||1!==t.nodeType)},r.isPlainValue=function(t){var e;return e=typeof t,"object"!==e&&"function"!==e||n.isDate(t)},r.isBoolean=function(t){return t===!0||t===!1},e.exports=r},{}],3:[function(t,e,n){var r,i,o,s;r=t("./elementFactory"),n.before=function(t){return function(e){return function(){return t.apply(this,arguments),e.apply(this,arguments)}}},n.after=function(t){return function(e){return function(){return e.apply(this,arguments),t.apply(this,arguments)}}},n.chainable=n.after(function(){return this}),n.onlyWith$=function(t){return"undefined"!=typeof jQuery&&null!==jQuery||"undefined"!=typeof Zepto&&null!==Zepto?function(){return t(arguments)}(jQuery||Zepto):void 0},n.getElements=function(t){var e;return e=[],s(t,e),e},s=function(t,e){var i,o;for(i=t.firstChild,o=[];i;)i.nodeType===n.ELEMENT_NODE&&(e.push(new r.createElement(i)),s(i,e)),o.push(i=i.nextSibling);return o},n.ELEMENT_NODE=1,n.TEXT_NODE=3,o=function(){return"<:nav></:nav>"!==document.createElement("nav").cloneNode(!0).outerHTML},n.cloneNode="undefined"==typeof document||null===document||o()?function(t){return t.cloneNode(!0)}:function(t){var e,r,o,s,u;if(e=Transparency.clone(t),e.nodeType===n.ELEMENT_NODE)for(e.removeAttribute(i),u=e.getElementsByTagName("*"),o=0,s=u.length;s>o;o++)r=u[o],r.removeAttribute(i);return e},i="transparency",n.data=function(t){return t[i]||(t[i]={})},n.nullLogger=function(){},n.consoleLogger=function(){return console.log(arguments)},n.log=n.nullLogger},{"./elementFactory":5}],4:[function(t,e){var n,r,i,o,s,u,l;l=t("./helpers"),o=l.before,i=l.after,s=l.chainable,u=l.cloneNode,r=t("./instance"),e.exports=n=function(){function t(t,e){this.el=t,this.Transparency=e,this.template=u(this.el),this.instances=[new r(this.el,this.Transparency)],this.instanceCache=[]}var e,n;return n=s(function(){return this.parent=this.el.parentNode,this.parent?(this.nextSibling=this.el.nextSibling,this.parent.removeChild(this.el)):void 0}),e=s(function(){return this.parent?this.nextSibling?this.parent.insertBefore(this.el,this.nextSibling):this.parent.appendChild(this.el):void 0}),t.prototype.render=o(n)(i(e)(s(function(t,e,n){for(var i,o,s,l,a,h,c;t.length<this.instances.length;)this.instanceCache.push(this.instances.pop().remove());for(;t.length>this.instances.length;)s=this.instanceCache.pop()||new r(u(this.template),this.Transparency),this.instances.push(s.appendTo(this.el));for(c=[],o=a=0,h=t.length;h>a;o=++a)l=t[o],s=this.instances[o],i=[],c.push(s.prepare(l,i).renderValues(l,i).renderDirectives(l,o,e).renderChildren(l,i,e,n));return c}))),t}()},{"./helpers":3,"./instance":6}],5:[function(t,e){var n,r,i,o,s,u,l,a,h,c,p,f,d,m,y,g,v={}.hasOwnProperty,b=function(t,e){function n(){this.constructor=t}for(var r in e)v.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};p=t("../lib/lodash.js"),c=t("./helpers"),n=t("./attributeFactory"),e.exports=o={Elements:{input:{}},createElement:function(t){var e,n;return e="input"===(n=t.nodeName.toLowerCase())?o.Elements[n][t.type.toLowerCase()]||s:o.Elements[n]||i,new e(t)}},i=function(){function t(t){this.el=t,this.attributes={},this.childNodes=p.toArray(this.el.childNodes),this.nodeName=this.el.nodeName.toLowerCase(),this.classNames=this.el.className.split(" "),this.originalAttributes={}}return t.prototype.empty=function(){for(var t;t=this.el.firstChild;)this.el.removeChild(t);return this},t.prototype.reset=function(){var t,e,n,r;n=this.attributes,r=[];for(e in n)t=n[e],r.push(t.set(t.templateValue));return r},t.prototype.render=function(t){return this.attr("text",t)},t.prototype.attr=function(t,e){var r,i;return r=(i=this.attributes)[t]||(i[t]=n.createAttribute(this.el,t,e)),null!=e&&r.set(e),r},t.prototype.renderDirectives=function(t,e,n){var r,i,o,s;s=[];for(i in n)v.call(n,i)&&(r=n[i],"function"==typeof r&&(o=r.call(t,{element:this.el,index:e,value:this.attr(i).templateValue}),null!=o?s.push(this.attr(i,o)):s.push(void 0)));return s},t}(),l=function(t){function e(t){e.__super__.constructor.call(this,t),this.elements=c.getElements(t)}return b(e,t),o.Elements.select=e,e.prototype.render=function(t){var e,n,r,i,o;for(t=""+t,i=this.elements,o=[],n=0,r=i.length;r>n;n++)e=i[n],"option"===e.nodeName&&o.push(e.attr("selected",e.el.value===t));return o},e}(i),h=function(t){function e(){return f=e.__super__.constructor.apply(this,arguments)}var n,r,i,s;for(b(e,t),n=["area","base","br","col","command","embed","hr","img","input","keygen","link","meta","param","source","track","wbr"],i=0,s=n.length;s>i;i++)r=n[i],o.Elements[r]=e;return e.prototype.attr=function(t,n){return"text"!==t&&"html"!==t?e.__super__.attr.call(this,t,n):void 0},e}(i),s=function(t){function e(){return d=e.__super__.constructor.apply(this,arguments)}return b(e,t),e.prototype.render=function(t){return this.attr("value",t)},e}(h),a=function(t){function e(){return m=e.__super__.constructor.apply(this,arguments)}return b(e,t),o.Elements.textarea=e,e}(s),r=function(t){function e(){return y=e.__super__.constructor.apply(this,arguments)}return b(e,t),o.Elements.input.checkbox=e,e.prototype.render=function(t){return this.attr("checked",Boolean(t))},e}(s),u=function(t){function e(){return g=e.__super__.constructor.apply(this,arguments)}return b(e,t),o.Elements.input.radio=e,e}(r)},{"../lib/lodash.js":2,"./helpers":3,"./attributeFactory":7}],6:[function(t,e){var n,r,i,o,s={}.hasOwnProperty;o=t("../lib/lodash.js"),r=(i=t("./helpers")).chainable,e.exports=n=function(){function t(t,e){this.Transparency=e,this.queryCache={},this.childNodes=o.toArray(t.childNodes),this.elements=i.getElements(t)}return t.prototype.remove=r(function(){var t,e,n,r,i;for(r=this.childNodes,i=[],e=0,n=r.length;n>e;e++)t=r[e],i.push(t.parentNode.removeChild(t));return i}),t.prototype.appendTo=r(function(t){var e,n,r,i,o;for(i=this.childNodes,o=[],n=0,r=i.length;r>n;n++)e=i[n],o.push(t.appendChild(e));return o}),t.prototype.prepare=r(function(t){var e,n,r,o,s;for(o=this.elements,s=[],n=0,r=o.length;r>n;n++)e=o[n],e.reset(),s.push(i.data(e.el).model=t);return s}),t.prototype.renderValues=r(function(t,e){var n,r,i,u;if(o.isElement(t)&&(n=this.elements[0]))return n.empty().el.appendChild(t);if("object"==typeof t){u=[];for(r in t)s.call(t,r)&&(i=t[r],null!=i&&(o.isString(i)||o.isNumber(i)||o.isBoolean(i)||o.isDate(i)?u.push(function(){var t,e,o,s;for(o=this.matchingElements(r),s=[],t=0,e=o.length;e>t;t++)n=o[t],s.push(n.render(i));return s}.call(this)):"object"==typeof i?u.push(e.push(r)):u.push(void 0)));return u}}),t.prototype.renderDirectives=r(function(t,e,n){var r,i,o,u;u=[];for(o in n)s.call(n,o)&&(r=n[o],"object"==typeof r&&("object"!=typeof t&&(t={value:t}),u.push(function(){var n,s,u,l;for(u=this.matchingElements(o),l=[],n=0,s=u.length;s>n;n++)i=u[n],l.push(i.renderDirectives(t,e,r));return l}.call(this))));return u}),t.prototype.renderChildren=r(function(t,e,n,r){var i,o,s,u,l;for(l=[],s=0,u=e.length;u>s;s++)o=e[s],l.push(function(){var e,s,u,l;for(u=this.matchingElements(o),l=[],e=0,s=u.length;s>e;e++)i=u[e],l.push(this.Transparency.render(i.el,t[o],n[o],r));return l}.call(this));return l}),t.prototype.matchingElements=function(t){var e,n,r;return n=(r=this.queryCache)[t]||(r[t]=function(){var n,r,i,o;for(i=this.elements,o=[],n=0,r=i.length;r>n;n++)e=i[n],this.Transparency.matcher(e,t)&&o.push(e);return o}.call(this)),i.log("Matching elements for '"+t+"':",n),n},t}()},{"../lib/lodash.js":2,"./helpers":3}],7:[function(t,e){var n,r,i,o,s,u,l,a,h={}.hasOwnProperty,c=function(t,e){function n(){this.constructor=t}for(var r in e)h.call(e,r)&&(t[r]=e[r]);return n.prototype=e.prototype,t.prototype=new n,t.__super__=e.prototype,t};a=t("../lib/lodash"),l=t("./helpers"),e.exports=r={Attributes:{},createAttribute:function(t,e){var i;return i=r.Attributes[e]||n,new i(t,e)}},n=function(){function t(t,e){this.el=t,this.name=e,this.templateValue=this.el.getAttribute(this.name)||""}return t.prototype.set=function(t){return this.el[this.name]=t,this.el.setAttribute(this.name,""+t)},t}(),i=function(t){function e(t,e){this.el=t,this.name=e,this.templateValue=this.el.getAttribute(this.name)||!1}var n,i,o,s;for(c(e,t),n=["hidden","async","defer","autofocus","formnovalidate","disabled","autofocus","formnovalidate","multiple","readonly","required","checked","scoped","reversed","selected","loop","muted","autoplay","controls","seamless","default","ismap","novalidate","open","typemustmatch","truespeed"],o=0,s=n.length;s>o;o++)i=n[o],r.Attributes[i]=e;return e.prototype.set=function(t){return this.el[this.name]=t,t?this.el.setAttribute(this.name,this.name):this.el.removeAttribute(this.name)},e}(n),u=function(t){function e(t,e){var n;this.el=t,this.name=e,this.templateValue=function(){var t,e,r,i;for(r=this.el.childNodes,i=[],t=0,e=r.length;e>t;t++)n=r[t],n.nodeType===l.TEXT_NODE&&i.push(n.nodeValue);return i}.call(this).join(""),this.children=a.toArray(this.el.children),(this.textNode=this.el.firstChild)?this.textNode.nodeType!==l.TEXT_NODE&&(this.textNode=this.el.insertBefore(this.el.ownerDocument.createTextNode(""),this.textNode)):this.el.appendChild(this.textNode=this.el.ownerDocument.createTextNode(""))}return c(e,t),r.Attributes.text=e,e.prototype.set=function(t){for(var e,n,r,i,o;e=this.el.firstChild;)this.el.removeChild(e);for(this.textNode.nodeValue=t,this.el.appendChild(this.textNode),i=this.children,o=[],n=0,r=i.length;r>n;n++)e=i[n],o.push(this.el.appendChild(e));return o},e}(n),s=function(t){function e(t){this.el=t,this.templateValue="",this.children=a.toArray(this.el.children)}return c(e,t),r.Attributes.html=e,e.prototype.set=function(t){for(var e,n,r,i,o;e=this.el.firstChild;)this.el.removeChild(e);for(this.el.innerHTML=t+this.templateValue,i=this.children,o=[],n=0,r=i.length;r>n;n++)e=i[n],o.push(this.el.appendChild(e));return o},e}(n),o=function(t){function e(t){e.__super__.constructor.call(this,t,"class")}return c(e,t),r.Attributes["class"]=e,e}(n)},{"../lib/lodash":2,"./helpers":3}]},{},[1]);;var movies = movies || {};

(function(){

	movies.controller = {
		init: function () {
			movies.routie.init();
			// if we have something on local storage place that
			if(localStorage.getItem('movies')) {
				var response = JSON.parse(localStorage.getItem('movies'));
				movies.content['movies'] = response;
				console.log(movies.content['movies']);
				movies.sections.movies();
				console.log("has localhost")
			} else {
				movies.xhr.trigger('GET', 'http://dennistel.nl/movies');
				console.log("has not localhost")
			}
			movies.sections.init();
		}
	}

	movies.routie = {
		init: function () {

			routie({
			    'about': function() {
					movies.sections.toggle.about();
			    },
			    'movies': function() {
					movies.sections.toggle.movies();
			    }
			});
		}
	}

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
	}

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

	movies.xhr = {
		trigger: function (type, url, success, data) {
			var req = new XMLHttpRequest;
			req.open(type, url, true);

			req.setRequestHeader('Content-type','application/json');

			type === 'POST' ? req.send(data) : req.send(null);

			req.onreadystatechange = function() {
				if (req.readyState === 4) {
					if (req.status === 200 || req.status === 201) {
						var response = JSON.parse(req.response);
						movies.content['movies'] = response;
						// console.log(movies.content['movies']);
						localStorage.setItem('movies', req.response);
						movies.sections.movies();
					}
				}
			}
		}
	};

	movies.controller.init();

	// console.log(movies.content.about.title);
	// console.log(movies.content.about.discription);
	// console.log(movies.content.movies);
})();