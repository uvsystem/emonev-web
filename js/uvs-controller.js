/* UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.1.0
 */

 $( document ).ready( function () {

	if ( operator.isLogin() == false ) {
		
		window.location.href = 'login.html';
		return;
		
	}
	
	if ( operator.getRole() != 'ADMIN' && operator.getRole() != 'PEGAWAI' ) {
		
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

	$( document ).on( 'click', '#menu-bagian', function() {

		page.change( $( '#message' ), '');
		bagian.reload();

	} );

	$( document ).on( 'click', '#menu-operator', function() {

		page.change( $( '#message' ), '');
		operatorAbsen.reload();

	} );

	$( document ).on( 'click', '#menu-pegawai', function() {
		
		page.change( $( '#message' ), '');
		pegawai.reload();

	} );

	$( document ).on( 'click', '#menu-otentikasi', function() {
		
		message.write("Maaf, belum tersedia");
		page.change( $( '#message' ), '');
		//otentikasi.reload();
		
	} );

	$( document ).on( 'click', '#menu-rekap', function() {
		
		page.change( $( '#message' ), '');
		rekap.reload();
		
	} );

	$( document ).on( 'click', '#menu-absensi', function() {
		
		page.change( $( '#message' ), '');
		absen.reload();

	} );


	
	// Navigation Handlers
	$( document ).on( 'click', '#nav-user', function() {

		user.load();

	} );

	$( document ).on( 'click', '#nav-home', function() {
		
		var todo;
		
		if ( operator.getRole() == 'ADMIN' ) {

			todo = home.load;
		
		} else if ( operator.getRole() == 'PEGAWAI' ) {
			
			todo = absen.reload;
			
		}
		
		todo();

	} );

	$( document ).on( 'click', '#nav-logout', function() {
		
		rest.logout();

	} );

	$( document ).on( 'click', '#nav-operator', function() {

		operatorAbsen.reload();

	} );

	$( document ).on( 'click', '#nav-pegawai', function() {
		
		pegawai.reload();

	} );

	$( document ).on( 'click', '#nav-otentikasi', function() {
		
		message.write("Maaf, belum tersedia");
		//otentikasi.reload();
		
	} );

	$( document ).on( 'click', '#nav-absensi', function() {
		
		absen.reload();

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
	
	// Bagian Handler
	$( document ).on( 'click', '#btn-bagian-tambah', function() {
	
		$( '#form-bagian-kode' ).val( '' );
		$( '#form-bagian-nama' ).val( '' );
		$( '#form-bagian-skpd' ).val( '' );

		page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );
		
	} );
	
	$( document ).on( 'click', '#btn-simpan-bagian', function() {

		var object = bagian.content.getObject();

		rest.call( '/bagian', object, 'POST', bagian.success, message.error );
		
		bagian.currentObject = null;

	} );



	// Absen handler.
	$( document ).on( 'click', '#btn-absen-tambah', function() {
		
		$( '#form-absen-nip' ).val( '' );
		$( '#form-absen-tanggal' ).val( '' );
		$( '#form-absen-pagi' ).val( '7:30' );
		$( '#form-absen-tengah' ).val( '11:30' );
		$( '#form-absen-siang' ).val( '13:00' );
		$( '#form-absen-sore' ).val( '16:00' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-simpan', function() {
		
		var nip = $( '#form-absen-nip' ).val();
		
		var loadPegawai = function( result ) {
			
			if ( result.tipe == 'ENTITY' ) {

				var _pegawai = result.object;
			
				var tanggal = myDate.fromDatePicker( $( '#form-absen-tanggal' ).val() );
				var pagi = $( '#form-absen-pagi' ).val();
				var tengah = $( '#form-absen-tengah' ).val();
				var siang = $( '#form-absen-siang' ).val();
				var sore = $( '#form-absen-sore' ).val();
				
				var _absen = {
					pegawai: _pegawai,
					tanggal: myDate.toFormattedString( tanggal ),
					pagi: pagi,
					tengah: tengah,
					siang: siang,
					sore: sore
				};
				
				rest.call( '/absen', _absen, 'POST', absen.success, message.error );
			}
		};
		
		rest.call( '/pegawai/' + nip, {}, 'GET', loadPegawai, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-sakit', function() {
	
		$( '#form-absen-sakit-nip' ).val( '' );
		$( '#form-absen-sakit-tanggal' ).val( '' );
		$( '#form-absen-sakit-keterangan' ).val( '' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );

	$( document ).on( 'click', '#btn-absen-sakit-simpan', function() {
		
		var nip = $( '#form-absen-sakit-nip' ).val();
		var keterangan = $( '#form-absen-sakit-keterangan' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-absen-sakit-tanggal' ).val() );
		
		var url = '/absen/sakit/' + nip + '/' + myDate.toFormattedString( tanggal );
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absen.success, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-izin', function() {
	
		$( '#form-absen-izin-nip' ).val( '' );
		$( '#form-absen-izin-tanggal' ).val( '' );
		$( '#form-absen-izin-keterangan' ).val( '' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );

	$( document ).on( 'click', '#btn-absen-izin-simpan', function() {
		
		var nip = $( '#form-absen-izin-nip' ).val();
		var keterangan = $( '#form-absen-izin-keterangan' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-absen-izin-tanggal' ).val() );
		
		var url = '/absen/izin/' + nip + '/' + myDate.toFormattedString( tanggal );
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absen.success, message.error );
		
	} );
	
	$( document ).on( 'click', '#btn-absen-cuti', function() {
	
		$( '#form-absen-cuti-nip' ).val( '' );
		$( '#form-absen-cuti-tanggal' ).val( '' );
		$( '#form-absen-cuti-keterangan' ).val( '' );
		
		var daftarNip = page.list.option.generateNip( storage.get( pegawai.nama ) );
		
		page.change( $( '#list-nip' ), daftarNip );
		
	} );

	$( document ).on( 'click', '#btn-absen-cuti-simpan', function() {
		
		var nip = $( '#form-absen-cuti-nip' ).val();
		var keterangan = $( '#form-absen-cuti-keterangan' ).val();
		var tanggal = myDate.fromDatePicker( $( '#form-absen-cuti-tanggal' ).val() );
		
		var url = '/absen/cuti/' + nip + '/' + myDate.toFormattedString( tanggal );
		var object = { keterangan: keterangan };
		
		rest.call( url, object, 'POST', absen.success, message.error );
		
	} );
	
	$( document ).on( 'change', '#absen-skpd', function() {
		
		var namaSkpd = $( '#absen-skpd' ).val();
		var _skpd = storage.getByNama( skpd, namaSkpd );
		
		var onSuccess = function( result ) {
			
			if ( result.tipe == 'LIST' )
				page.change( $( '#list-bagian' ), page.list.option.generate( result.list ) );
		};
		
		rest.call( '/bagian/skpd/' + _skpd.id, { }, 'GET', onSuccess, message.error );		
		
	} );
	
	$( document ).on( 'click', '#absen-cari', function() {
		
		var namaBagian = $( '#absen-bagian' ).val();
		var namaSkpd = $( '#absen-skpd' ).val();
		var tanggalAwal = myDate.fromDatePicker( $( '#absen-tanggal-awal' ).val() );
		var tanggalAkhir = myDate.fromDatePicker( $( '#absen-tanggal-akhir' ).val() );

		if ( namaBagian || namaBagian != '' ) {

			var _bagian = storage.getByNama( bagian, namaBagian );
		
			rest.call( '/absen/bagian/' + _bagian.id + '/' + myDate.toFormattedString( tanggalAwal ) + '/' + myDate.toFormattedString( tanggalAkhir ), { }, 'GET', absen.success, message.error );		
			
		} else if ( namaSkpd || namaSkpd != '' ) {

			var _skpd = storage.getByNama( skpd, namaSkpd );
				
			rest.call( '/absen/skpd/' + _skpd.id + '/' + myDate.toFormattedString( tanggalAwal ) + '/' + myDate.toFormattedString( tanggalAkhir ), { }, 'GET', absen.success, message.error );		
			
		} else {
				
			rest.call( '/absen/' + myDate.toFormattedString( tanggalAwal ) + '/' + myDate.toFormattedString( tanggalAkhir ), { }, 'GET', absen.success, message.error );		
			
		}
	} );

	$( document ).on( 'change', '#form-absen-nip', function() {
		
		var nip = $( '#form-absen-nip' ).val();
		
		var tmp = pegawai.getByNip( nip );
		
		$( '#form-absen-nama' ).val( tmp.nama );
		
	} );


	// Otentikasi handler.
	$( document ).on( 'click', '#btn-kategori-tambah', function() {

		kategori.currentObject = choose( null, kategori.defaultObject );
		kategori.content.resetForm( kategori.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-kategori', function() {

		var object = kategori.content.getObject();
		var url = '/kategori/simpan.php';

		if ( object.id == 0 )
			url = '/kategori/baru.php';

		rest.call( url, object, 'POST', kategori.success, message.error );

		kategori.currentObject = null;
		
	} );


	
	// Operator handler.
	$( document ).on( 'click', '#btn-operator-tambah', function() {

		operatorAbsen.currentObject = choose( null, operatorAbsen.defaultObject );
		operatorAbsen.content.resetForm( operatorAbsen.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-operator', function() {

		var object = operatorAbsen.content.getObject();

		rest.call( '/operator', object, 'POST', operatorAbsen.success, message.error );
		
		operatorAbsen.currentObject = null;

	} );

	
	
	// Pegawai handler(s).
	$( document ).on( 'click', '#btn-pegawai-tambah', function() {

		pegawai.currentObject = choose( null, pegawai.defaultObject );
		pegawai.content.resetForm( pegawai.currentObject );

	} );

	$( document ).on( 'click', '#btn-simpan-pegawai', function() {

		var object = pegawai.content.getObject();

		rest.call( '/pegawai', object, 'POST', pegawai.success, message.error );
		
		pegawai.currentObject = null;
		
	} );
	
	$( document ).on( 'change', '#form-pegawai-skpd', function() {
		
		var namaSkpd = $( '#form-pegawai-skpd' ).val();
		var _skpd = storage.getByNama( skpd, namaSkpd );
		
		var onSuccess = function( result ) {
		
			page.change( $( '#list-bagian' ), page.list.option.generate( result.list ) );
		};
		
		rest.call( '/bagian/skpd/' + _skpd.id, {}, 'GET', onSuccess, message.error );
	} );
	
	
	
	// Cari Handler.
	$( document ).on( 'focus', '#search', function() {
	
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
		
		if ( halaman == pegawai.nama ) {
		
			pegawai.loader.loadSearch( kataKunci );
			
		} else if ( halaman == operatorAbsen.nama ) {
		
			operatorAbsen.loader.loadSearch( kataKunci );
			
		} else if ( halaman == otentikasi.nama ) {
		
			otentikasi.loader.loadSearch( kataKunci );
			
		} else if ( halaman == absen.nama ) {
		
			absen.loader.loadSearch( kataKunci );
			
		} else if ( halaman == skpd.nama ) {
		
			skpd.loader.loadSearch( kataKunci );
			
		} else if ( halaman == bagian.nama ) {
		
			bagian.loader.loadSearch( kataKunci );
			
		} else {

			throw new Error( 'Nama halaman tidak terdaftar : ' + halaman );
			
		}
	} );
	
	// Rekap Handler
	$( document ).on( 'click', '#btn-rekap-bagian', function() {

		var listSkpd = storage.get( skpd.nama );
		var listBagian = storage.get( bagian.nama );
		
		page.change( $( '#list-skpd' ), page.list.option.generate( listSkpd ) );
		page.change( $( '#list-bagian' ), page.list.option.generate( listBagian ) );

		$( '#form-bagian-skpd' ).val( '' );
		$( '#form-bagian-bagian' ).val( '' );
	});
	
	$( document ).on( 'click', '#btn-rekap-skpd', function() {

		var listSkpd = storage.get( skpd.nama );
		page.change( $( '#list-skpd' ), page.list.option.generate( listSkpd ) );
		
		$( '#form-skpd-skpd' ).val( '' );
	});
	
	$( document ).on( 'change', '#form-bagian-skpd', function() {

		var namaSkpd = $( '#form-bagian-skpd' ).val();
		var _skpd = storage.getByNama( skpd, namaSkpd );
		
		var onSuccess = function( result ) {
			
			if ( result.tipe == 'LIST' )
				page.change( $( '#list-bagian' ), page.list.option.generate( result.list ) );
		};
		
		rest.call( '/bagian/skpd/' + _skpd.id, { }, 'GET', onSuccess, message.error );		
		
	});
	
	$( document ).on( 'click', '#btn-cetak-rekap-bagian', function() {

		var namaBagian = $( '#form-bagian-bagian' ).val();
		var tanggalAwal = $( '#form-bagian-tanggal-awal' ).val();
		var tanggalAkhir = $( '#form-bagian-tanggal-akhir' ).val();

		var formattedAwal = myDate.fromDatePicker( tanggalAwal );
		var formattedAkhir = myDate.fromDatePicker( tanggalAkhir );

		var _bagian = storage.getByNama( bagian, namaBagian );
		var firstDate = myDate.toFormattedString( formattedAwal );
		var lastDate = myDate.toFormattedString( formattedAkhir );
		
		printer.submitPost( '/pegawai/print/rekap/bagian/' + _bagian.id + '/' + firstDate + '/' + lastDate, [], 'GET' );	
		
	});
	
	$( document ).on( 'click', '#btn-cetak-rekap-skpd', function() {

		var namaSkpd = $( '#form-skpd-skpd' ).val();
		var tanggalAwal = $( '#form-skpd-tanggal-awal' ).val();
		var tanggalAkhir = $( '#form-skpd-tanggal-akhir' ).val();

		var formattedAwal = myDate.fromDatePicker( tanggalAwal );
		var formattedAkhir = myDate.fromDatePicker( tanggalAkhir );
		
		var _skpd = storage.getByNama( skpd, namaSkpd );
		var firstDate = myDate.toFormattedString( formattedAwal );
		var lastDate = myDate.toFormattedString( formattedAkhir );
		
		printer.submitPost( '/pegawai/print/rekap/skpd/' + _skpd.id + '/' + firstDate + '/' + lastDate, [], 'GET' );	
		
	});
	
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
