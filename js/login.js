$( document ).ready( function () {
	
	$( '#btn-login' ).click( function () {
	
		var username = $( '#username' ).val();
		var password = $( '#password' ).val();

		rest.login( username, password );

	} );

} );
