wie gebruikt het al?

waarom voordeel?

Wat is nou het grootste verschil tussen less en sass?
less -> client side -> javascript
Sass -> Ruby -> processed server-side

Waarom kiezen de meeste developers niet voor less?
LESS because of the additional time needed for the JavaScript engine to process the code and output the modified CSS to the browser.\

	*	Mixins – herhalen van eerder geschreven code (less gewoon de class herahlen, sass @variable maken
	*	Parametric mixins – Classes to which you can pass parameters, like functions.
	*	Nested Rules – Classes within classes, which cut down on repetitive code.
	*	Operations – Math within CSS.
	*	Color functions – Edit your colors.
	*	Namespaces – Groups of styles that can be called by references.
	*	Scope – Make local changes to styles.
	*	JavaScript evaluation – JavaScript expressions evaluated in CSS

	/* Here we access part of the document */
	*	@height = `document.body.clientHeight`;
