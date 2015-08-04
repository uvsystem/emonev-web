var restAdapter = rest( 'http://localhost:8080', 'monev' );

$( document ).ready( function () {
	
	$( '#btn-login' ).click( function () {
	
		var username = $( '#username' ).val();
		var password = $( '#password' ).val();

		restAdapter.login( username, password );

	} );

} );
