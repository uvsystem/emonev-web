/* UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 0.0.1
 */

 $( document ).ready( function () {

	if ( operator.isLogin() == false ) {
		
		window.location.href = 'login.html';
		return;
		
	}
	
	if ( operator.getRole() != 'ADMIN' && operator.getRole() != 'OPERATOR' ) {
		
		message.write( 'Maaf, anda tidak bisa mengakses halaman ini' );
		
		window.location.href = 'login.html';
		return;
		
	}
	
	page.content.navigation.set();
	page.content.menu.set();
	page.content.home.set();

	storage.reset();

	page.change( $( '#operator-nama' ), operator.getUsername() );

	$( function () {
	
		$( '[ data-toggle = "tooltip" ]' ).tooltip();
	  
	} );

	
	
	// Menu Handlers
	$( document ).on( 'click', '#menu-skpd', function() {

		page.change( $( '#message' ), '');
		skpd.reload();

	} );

	$( document ).on( 'click', '#menu-operator', function() {

		page.change( $( '#message' ), '');
		operatorMonev.reload();

	} );

	$( document ).on( 'click', '#menu-kegiatan', function() {
		
		page.change( $( '#message' ), '');
		kegiatan.reload();

	} );

	
	// Navigation Handlers
	$( document ).on( 'click', '#nav-user', function() {

		user.load();

	} );

	$( document ).on( 'click', '#nav-home', function() {
		
		var todo;
		
		if ( operator.getRole() == 'ADMIN' ) {

			todo = home.load;
		
		} else if ( operator.getRole() == 'OPERATOR' ) {
			
			todo = absen.reload;
			
		}
		
		todo();

	} );

	$( document ).on( 'click', '#nav-logout', function() {
		
		rest.logout();

	} );

	$( document ).on( 'click', '#nav-operator', function() {
		
		page.change( $( '#message' ), '');
		operatorMonev.reload();

	} );

	$( document ).on( 'click', '#nav-kegiatan', function() {
		
		page.change( $( '#message' ), '');
		kegiatan.reload();

	} );

	$( document ).on( 'click', '#nav-skpd', function() {
		
		page.change( $( '#message' ), '');
		skpd.reload();

	} );

	
	// Table Handler
	$( document ).on( 'click', '#prev', function() {
	
		var pageNumber = $( '#pageNumber' ).text();
		var previousPage = parseInt( pageNumber  ) - 1;
		
		if ( previousPage < 1 )
			previousPage = 1;
		
		activeContainer.content.setData( activeContainer.list, previousPage );
	
		page.change( $( '#pageNumber' ), previousPage );
		
	} );
	
	$( document ).on( 'click', '#next', function() {
	
		var pageNumber = $( '#pageNumber' ).text();
		var nextPage = parseInt( pageNumber ) + 1;

		var lastPage = activeContainer.list.length / set;
		if ( nextPage > lastPage ) {
			nextPage = Math.floor( lastPage );
			
			if ( ( nextPage * set ) < activeContainer.list.length )
				nextPage = nextPage + 1;
			
		}

		activeContainer.content.setData( activeContainer.list, nextPage );
	
		page.change( $( '#pageNumber' ), nextPage );
		
	} );

	
	// SKPD Handler
	$( document ).on( 'click', '#btn-skpd-tambah', function() {
	
		$( '#form-skpd-kode' ).val( '' );
		$( '#form-skpd-nama' ).val( '' );

	} );
	
	$( document ).on( 'click', '#btn-simpan-skpd', function() {

		var object = skpd.content.getObject();

		rest.call( '/skpd', object, 'POST', skpd.success, message.error );
		
		skpd.currentObject = null;

	} );
	
	
	// Operator handler.
	$( document ).on( 'click', '#btn-operator-tambah', function() {

		operatorMonev.currentObject = choose( null, operatorMonev.defaultObject );
		operatorMonev.content.resetForm( operatorMonev.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-operator', function() {

		var object = operatorMonev.content.getObject();

		rest.call( '/operator', object, 'POST', operatorMonev.success, message.error );
		
		operatorMonev.currentObject = null;

	} );

	
	// Kegiatan handler
	$( document ).on( 'click', '#btn-kegiatan-tambah', function() {

		kegiatan.currentObject = choose( null, kegiatan.defaultObject );
		kegiatan.content.resetForm( kegiatan.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-kegiatan', function() {

		var object = kegiatan.content.getObject();
		
		rest.call( '/kegiatan', object, 'POST', kegiatan.success, message.error );
		
		kegiatan.currentObject = null;

	} );
	
	
	// Realisasi Handler
	$( document ).on( 'click', '#btn-tambah-realisasi', function() {

		realisasi.currentObject = choose( null, realisasi.defaultObject );
		realisasi.content.resetForm( realisasi.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-realisasi', function() {

		var object = realisasi.content.getObject();
		
		rest.call( '/realisasi', object, 'POST', realisasi.success, message.error );

	} );
	
	
	// Cari Handler.
	$( document ).on( 'focus', '#search', function() {
	
		if ( page.getName() == 'REALISASI' ) {
			
			kegiatan.reload();
			
		}
	
		$( '#search' ).attr( 'placeholder', 'Masukan Kata Kunci' );
		page.change( $( '#table' ), '' );
		
	} );
	
	$( document ).on( 'blur', '#search', function() {
			
		$( '#search' ).attr( 'placeholder', 'Cari...' );
		$( '#search' ).val( '' );
		
	} );
	
	$( document ).on( 'change', '#search', function() {
	
		var kataKunci = $( '#search' ).val();
		var halaman = page.getName();
		
		if ( !halaman )
			throw new Error( 'Nama halaman belum di atur' );
		
		if ( halaman == skpd.nama ) {
		
			skpd.loader.search( kataKunci );
			
		} else if ( halaman == operatorMonev.nama ) {
		
			operatorMonev.loader.search( kataKunci );
			
		} else if ( halaman == kegiatan.nama ) {
		
			kegiatan.loader.search( kataKunci );
			
		} else {

			throw new Error( 'Nama halaman tidak terdaftar : ' + halaman );
			
		}
	} );
	
	
	// Alert auto-close
	$("#success-alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#success-alert").alert('close');
	});
	
	$("#warning-alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#success-alert").alert('close');
	});
	
	$("#error-alert").fadeTo(2000, 500).slideUp(500, function(){
	    $("#success-alert").alert('close');
	});
	
} );
