var restAdapter = rest( 'https://core-unitedvision.whelastic.net', 'monev' );

$( document ).ready( function () {
	
	$( '#btn-login' ).click( function () {
	
		var username = $( '#username' ).val();
		var password = $( '#password' ).val();

		restAdapter.login( username, password );

	} );
} );
