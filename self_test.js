// self_test.js
// https://jrsinclair.com/articles/2016/gentle-introduction-to-javascript-tdd-intro/

// Test names starting with "=" (equal sign) are not counted towards successes.
// They are meant to be used to insert section headings in the output.

const START_DELAY           = 0;
const TIMEOUT_BETWEEN_TESTS = false;

const VERBOSE     = true;
const OUTPUT_HTML = true;
const OUTPUT_LOG  = !false;

const RED    = "color:red;";
const GREEN  = "color:green;";
const BLUE   = "color:blue;";
const GRAY   = "color:gray;";
const BLACK  = "color:black";
const BOLD   = "font-weight:bold;";
const NORMAL = "font-weight:normal;";


const STYLES = `
.test_results {
	font-size:1em; font-family:sans-serif;
	position:absolute; top:0; left:0; z-index:1000;
	max-width:100%; max-height:100%; overflow:auto; padding:1em;
	background:rgba(0,0,0, 0.75); color:#fff; font-family:monospace; white-space:pre;
	user-select:text; -webkit-user-select:text; -moz-user-select:text; -ms-user-select:text; cursor:auto;
}
.test_results { padding:1em; }
.test_results h1 { font-size:1.3em; }
.test_results h1 { font-size:1.3em; margin:0; }
.test_results h2 { font-size:1.15em; margin:1em 0 0.3em; }
.test_results p { padding:0.25em 0; position:relative; z-index:1; font-family:monospace,monospace; }
.test_results b.heading { color:#fc0; }
.test_results b.success { color:green; }
.test_results b.failure { color:red; }
.test_results button { display:inline-block; margin-top:0.5em; padding:0.1em 0.5em; }
`;


/**
 * run_tests()
 */
async function run_tests ( tests, output_element ) {
	const test_names = Object.keys( tests );
	var promise;

	let successes = 0;
	let failures  = 0;

	return new Promise( async (done)=>{
		for (let i = 0; i < test_names.length; ++i) {
			const test_name = test_names[i];
			const test      = tests[test_name];

			if (VERBOSE) {
				if (OUTPUT_LOG) {
					if (test_name.charAt(0) == '=') {
						console.groupCollapsed( "%c" + test_name, NORMAL );
					} else {
						console.groupCollapsed(
							"%cRunning: %c" + test_name,
							NORMAL+GRAY, NORMAL,
						);
					}
				}

				if (OUTPUT_HTML) {
					output_element.innerHTML
					+= "<p class='running'>[ .... ] <b>"
					+ test_name
					+ "</b></p>"
					;

					output_element.scrollTop += 999999;
				}

			}

			await new Promise( (assert)=>{
				if (TIMEOUT_BETWEEN_TESTS) {
					setTimeout( ()=>{
						try {
							return test( assert );
						}
						catch (error) {
							console.log( '%cERROR', 'color:red', error );
							assert( false );
						}
					});
				} else {
					try {
						return test( assert );
					}
					catch (error) {
						console.log( '%cERROR', 'color:red', error );
						assert( false );
					}
				}

			})
			.then( (result)=>{
				if (result === true) {
					if (VERBOSE && OUTPUT_LOG) {
						console.log(
							"%c" + "[%c  OK  %c] " + test_name,
							BOLD, GREEN, BLACK
						);
					}

					if (VERBOSE && OUTPUT_HTML) {
						output_element.innerHTML
						+= "<p class='success'>[<b class='success'>  OK  </b>] "
						+ test_name
						+ "</p>"
						;
					}

					if (VERBOSE && OUTPUT_LOG) console.groupEnd();

					if (test_name.charAt(0) != '=') ++successes;
				} else {
					if (VERBOSE && OUTPUT_LOG) console.groupEnd();

					if (VERBOSE && OUTPUT_LOG) {
						console.log(
							"%c" + "[%cFAILED%c] %c" + test_name,
							NORMAL+BLACK, RED, NORMAL+BLACK, BOLD+BLACK
						);
					}

					if (VERBOSE && OUTPUT_HTML) {
						output_element.innerHTML
						+= "<p class='failure'>[<b class='failure'>FAILED</b>] "
						+ test_name
						+ "</p>"
						;
					}

					++failures;
				}

				if (OUTPUT_HTML) {
					output_element.removeChild(
						output_element.querySelector( "p.running" )
					);
					output_element.scrollBy( 0, 9999 );
				}
			});
		}

		done({ "successes": successes, "failures": failures });
	});

} // run_tests


/**
 * process_file()
 */
async function process_file (tests_path, all_done, json, output_element) {
	const file_names = JSON.parse( json );

	let successes = 0;
	let failures  = 0;

	for (let i = 0; i < file_names.length; ++i) {
		const file_name = file_names[i];
		await new Promise( (file_done)=>{
			import( "./" + tests_path + "/" + file_name ).then( async (module)=>{
				const file_name = file_names[i];

				if (OUTPUT_LOG) console.log(
					"%c=== %c" + file_name + "%c ===",
					BOLD+BLUE, BOLD+BLACK, BOLD+BLUE
				);

				if (OUTPUT_HTML) {
					output_element.innerHTML
					+= "<h2><b class='heading'>===</b> <b>"
					+ file_name
					+ "</b> <b class='heading'>===</b></h2>"
					;
				}

				await run_tests( module.tests, output_element )
				.then( (results)=>{
					successes += results.successes;
					failures  += results.failures;
					file_done();
				});
			});
		});
	}
	all_done({ "successes": successes, "failures": failures });

} // process_file


/**
 * start()
 */
export async function start (tests_path = 'tests') {
	var output_element;
	let successes = 0;
	let failures  = 0;

	if (OUTPUT_HTML) {
		const style = document.createElement( "style" );
		style.innerHTML = STYLES;
		document.querySelector( "head" ).appendChild( style );

		output_element = document.createElement( "div" );
		document.body.appendChild( output_element );
		output_element.className = "test_results";
		output_element.innerHTML = "<h1>Self Test</h1>";
	}

	new Promise( (all_done)=>{
		fetch( tests_path ).then( (response)=>{
			if (!response.ok) {
				throw new Error('HTTP error, status = ' + response.status);
			}
			return response.text();

		}).then( async (json)=>{
			setTimeout( async ()=>{
				process_file( tests_path, all_done, json, output_element );
			});
		});

	}).then( (result)=>{
		successes += result.successes;
		failures  += result.failures;

	}).then( ()=>{
		const total = successes + failures;

		if (OUTPUT_LOG) {
			console.log(
				"%c=== %cRESULT %c===%c\n" + successes + " of " + total + " tests passed.",
				BOLD+BLUE, BOLD+BLACK, BOLD+BLUE, NORMAL
			);
			if (failures > 0) {
				console.log(
					"%c" + failures
					+ " test"
					+ ((failures == 1) ? "" : "s")
					+ " failed."
					, BOLD+RED
				);
			}
		}

		if (OUTPUT_HTML) {
			output_element.innerHTML
			+= "<h2><b class='heading'>===</b> <b>RESULT</b> <b class='heading'>===</b></h2>"
			+ "<p>"
			+ ((failures == 0) ? "<b class='success'>All " : successes + " of ")
			+ total + " tests passed."
			+ ((failures == 0) ? "</b>" : "")
			"</p>"
			;

			if (failures > 0) {
				output_element.innerHTML
				+= "<p><b class='failure'>"
				+ failures
				+ " test"
				+ ((failures == 1) ? "" : "s")
				+ " failed.</b></p>"
				;
			}

			if (failures == 0) {
				output_element.innerHTML
				+= "<p><button id='close'>Close results</button></p>"
				;
			} else {
				output_element.innerHTML
				+= "<p><button id='remove'>Show failed only</button>"
				+ " <button id='close'>Close results</button></p>"
				;

				output_element.querySelector( "#remove" ).addEventListener( "click", ()=>{
					output_element.querySelectorAll( "p.success" ).forEach( (p)=>{
						output_element.removeChild( p );
					});
				});
			}

			output_element.querySelector( "#close" ).addEventListener( "click", ()=>{
				document.body.removeChild( output_element );
			});

			output_element.querySelector( "#close" ).scrollIntoView();
		}
	});

} // start


/**
 * body.onload()
 */
addEventListener( "load", async ()=>{
	if (window.location.href.indexOf( "run_self_test" ) >= 0) {
		document.querySelectorAll( '.noscript' ).forEach( (element)=>{
			element.parentElement.removeChild( element );
		});
		setTimeout( start, START_DELAY );
	}
});