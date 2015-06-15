/* UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.0.0
 */

/*
 * Wait modal.
 */
waitModal = {

    shown: false,

	show: function () {
		
		var element = $( '#waitModal' );
		
		if ( element.val() == 'false' || element.val() == false ) {
			
			element.modal( 'show' );
			element.val( true );
			
		}
	},
    
	hide: function () {

		var element = $( '#waitModal' );
		
		if ( element.val() == 'true' || element.val() == true ) {

			element.modal( 'hide' );
			element.val( false );
			
		}
	}

};

/*
 * Home Object
 */
var home = {
	
	nama: 'Home',

	getContent: function() {

		page.load( $( '#content' ), 'html/home.html' );
		
	},
	
	setData: function() {
		
		throw new Error( 'Not Supported' );
		
	},
	
	load: function() {

		page.setName( home.nama );

	}
	
};

/*
 * Definisi resources untuk data SKPD.
 */
var skpd = {
	
	nama: 'SKPD',
	
	currentObject: null,
		
	defaultObject: {
		id: 0,
		kode: 'DEFAULT',
		nama: ''
	},

	success: function ( result ) {

		message.success( result );
		
		skpd.reload();
		
		skpd.currentObject = null;

	},
	
	reload: function() {

		var onSuccess = function( result ) {
		
			skpd.load( result.list );
			
			storage.set( result.list, skpd.nama );
		
		};
		
		rest.call( '/skpd', null, 'GET', onSuccess, message.error );

	},
	
	load: function( list ) {

		page.setName( skpd.nama );
		
		skpd.content.getContent();
		
		skpd.content.setData( list );
		
	},
	
	content: {

		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = skpd;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.kode + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="skpd.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-skpd">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		getContent: function( list ) {

			page.load( $( '#content' ), 'html/skpd.html' );
			
		},

		getObject: function() {
		
			var object = skpd.currentObject;
			
			if ( !object )
				object = choose( null, skpd.defaultObject);

			object.kode = $( '#form-skpd-kode' ).val();
			object.nama = $( '#form-skpd-nama' ).val();
							
			return object;
		
		},

		setDetail: function( id ) {

			var obj = storage.getById( skpd, id );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-skpd-kode' ).val( obj.kode );
			$( '#form-skpd-nama' ).val( obj.nama );
			
			skpd.currentObject = obj;
		
		},		
	},
	
	loader: {
	
		search: function( keyword ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				skpd.load( list );
				
			};
			
			rest.call( '/skpd/search/' + keyword, '', 'GET', onSuccess, message.error );
			
		}
	}
	
};

/*
 * Definisi resources untuk data bagian/bidang.
 */
var kegiatan = {
	
	nama: 'KEGIATAN',
	
	currentObject: null,
		
	defaultObject: {
		id: 0,
		nama: '',
		anggaran: 0,
		awal: '',
		akhir: '',
		skpd:{
			id: 0,
			kode: 'DEFAULT',
			nama: '',
		}
	},

	success: function ( result ) {

		message.success( result );
		
		kegiatan.reload();
		
		kegiatan.currentObject = null;

	},
	
	reload: function() {

		var onSuccess = function( result ) {
		
			kegiatan.load( result.list );
			
			storage.set( result.list, kegiatan.nama );
		
		};
		
		if ( operator.getRole() == 'ADMIN' ) {
			
			rest.call( '/kegiatan', null, 'GET', onSuccess, message.error );
			
		} else if ( operator.getRole() == 'OPERATOR' ) {
			
			rest.call( '/kegiatan/skpd/' + operator.getSkpd().id, null, 'GET', onSuccess, message.error );
			
		} else {

		throw new Error( 'Role undefined ' + operator.getRole() );
			
		}
		
	},
	
	load: function( list ) {

		page.setName( kegiatan.nama );
		
		kegiatan.content.getContent();
		
		kegiatan.content.setData( list );
		
	},

	content: {
	 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = kegiatan;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + ( !tmp.skpd ? '' : tmp.skpd.nama ) + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + number.addCommas( tmp.anggaran ) + '</td>' +
					'<td>' + tmp.awal + '</td>' +
					'<td>' + tmp.akhir + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="realisasi.set(' + tmp.id + ')">Realisasi</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		getContent: function( list ) {

			page.load( $( '#content' ), 'html/kegiatan.html' );
			
		},

		getObject: function() {

			var object = kegiatan.currentObject;

			if ( !object )
				object = choose( null, kegiatan.defaultObject);

			object.nama = $( '#form-kegiatan-nama' ).val();
			object.skpd = storage.getByNama( skpd, $( '#form-kegiatan-skpd' ).val() );
			object.anggaran = $( '#form-kegiatan-anggaran' ).val();
			object.awal = $( '#form-kegiatan-awal' ).val();
			object.akhir = $( '#form-kegiatan-akhir' ).val();

			return object;

		},

		setDetail: function( id ) {

			var obj = storage.getById( kegiatan, id );
			
			this.resetForm( obj );
			
			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );
			
		},
		
		resetForm: function( obj ) {
			
			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );

			$( '#form-kegiatan-nama' ).val( obj.nama );
			$( '#form-kegiatan-anggaran' ).val( obj.anggaran );
			$( '#form-kegiatan-awal' ).val( obj.awal );
			$( '#form-kegiatan-akhir' ).val( obj.akhir );
			
			var namaSkpd = ( obj.skpd ) ? obj.skpd.nama : '';
			$( '#form-kegiatan-skpd' ).val( namaSkpd );
			
			kegiatan.currentObject = obj;
		
		},		
	},
	
	loader: {
	
		search: function( keyword ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				kegiatan.load( list );
				
			};
			
			rest.call( '/kegiatan/search/' + keyword, '', 'GET', onSuccess, message.error );
			
		},
		
		loadBySkpd: function( id ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				kegiatan.load( list );
				
			};
			
			rest.call( '/kegiatan/skpd/' + id, '', 'GET', onSuccess, message.error );
			
		},
		
		getById: function ( id, onSuccess ) {
			
			rest.call( '/kegiatan/' + id, '', 'GET', onSuccess, message.error );
			
		}
	}
};

/*
 * Definisi resources untuk operatorMonev.
 * Sangat tergantung pada variable page (api.js).
 */
var operatorMonev = {
	
	nama: 'OPERATOR',

	list: null,
	
	currentObject: null,
	
	defaultObject: {
		id: 0,
		username: '',
		password: '',
		role:'',
		skpd:{
			id: 0,
			nama: ''
		}
	},

	success: function ( result ) {

		message.success( result );
		
		operatorMonev.reload();
		
		operatorMonev.currentObject = null;

	},

	load: function( list ) {

		page.setName( operatorMonev.nama );
		
		operatorMonev.content.getContent();
		
		operatorMonev.content.setData( list );
		
	},
	
	reload: function() {

		var onSuccess = function( result ) {
		
			operatorMonev.load( result.list );
			
			//storage.set( result.list, operatorMonev.nama );
		
		};
		
		rest.call( '/operator', null, 'GET', onSuccess, message.error );

	},

	content: {
	 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = operatorMonev;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.username + '</td>' +
					'<td>' + tmp.password + '</td>' +
					'<td>' + tmp.role + '</td>' +
					'<td>' + ( tmp.skpd ? tmp.skpd.nama : '') + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="operatorMonev.content.setDetail(' + tmp.username + ')" data-toggle="modal" data-target="#modal-form-operator">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		getContent: function( list ) {

			page.load( $( '#content' ), 'html/operator.html' );
			
		},

		getObject: function() {
		
			var object = operatorMonev.currentObject;
			
			if ( !object )
				object = choose( null, operatorMonev.defaultObject);

			object.username = $( '#form-operator-username' ).val();
			object.password = $( '#form-operator-password' ).val();
			object.role = $( '#form-operator-role' ).val();
			object.skpd = storage.getByNama( skpd, $( '#form-operator-lokasi' ).val() );
				
			return object;
		
		},

		setDetail: function( username ) {

			var obj = storage.getByUsername( operatorMonev, username );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {
			
			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );

			$( '#form-operator-username' ).val( obj.username );
			$( '#form-operator-password' ).val( obj.password );
			$( '#form-operator-role' ).val( obj.tipe );
			$( '#form-operator-skpd' ).val( obj.skpd.nama );
			
			operatorMonev.currentObject = obj;
		
		},		

	},
	
	loader: {
		
		search: function( keyword ) {
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorMonev.content.setData( list );
				
			};
			
			rest.call( '/operator/search/' + keyword, '', 'GET', onSuccess, message.error );
			
		}
	}
};

/*
 * Definisi resources untuk realisasi.
 * Sangat tergantung pada variable page (api.js).
 */
var realisasi = {
	
	nama: 'REALISASI',
	
	kegiatan: null,

	list: null,
	
	currentObject: null,
	
	defaultObject: {
		kegiatan: {
			nama: ''
		},
		tahun: '',
		bulan: '',
		anggaran: '',
		fisik: ''
	},

	success: function ( result ) {

		message.success( result );
		
		realisasi.reload();
		
		realisasi.currentObject = null;

	},

	load: function( list ) {

		page.setName( realisasi.nama );
		
		realisasi.content.getContent();
		
		realisasi.content.setData( list );
		
	},
	
	reload: function() {

		kegiatan.loader.getById( realisasi.kegiatan.id, function( result ) {
			
			var _kegiatan = result.model;
			
			realisasi.setKegiatan( _kegiatan );
			
		} );
		
	},
	
	set: function( idKegiatan ) {

		var _kegiatan = storage.getById( kegiatan, idKegiatan);
		
		realisasi.setKegiatan( _kegiatan );

	},
	
	setKegiatan: function ( _kegiatan ) {
		
		realisasi.kegiatan = _kegiatan;

		realisasi.load( _kegiatan.listRealisasi );

		page.change( $( '#form-kegiatan-skpd' ), _kegiatan.skpd.nama );
		page.change( $( '#form-kegiatan-nama' ), _kegiatan.nama );
		page.change( $( '#form-kegiatan-anggaran' ), number.addCommas( _kegiatan.anggaran ) );
		page.change( $( '#form-kegiatan-awal' ), _kegiatan.awal );
		page.change( $( '#form-kegiatan-akhir' ), _kegiatan.akhir );

		page.change( $( '#form-kegiatan-realisasi-anggaran' ), number.addCommas( _kegiatan.realisasiAnggaran ) );
		page.change( $( '#form-kegiatan-realisasi-fisik' ), number.addCommas( _kegiatan.realisasiFisik ) + ' %' );
		
	},
	
	content: {
	 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = realisasi;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.tahun + '</td>' +
					'<td>' + tmp.bulan + '</td>' +
					'<td>' + number.addCommas( tmp.anggaran ) + '</td>' +
					'<td>' + tmp.fisik + ' %</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},

		getContent: function( list ) {

			page.load( $( '#content' ), 'html/realisasi.html' );

		},

		getObject: function() {

			var object = realisasi.currentObject;

			if ( !object )
				object = choose( null, realisasi.defaultObject);

			object.kegiatan = realisasi.kegiatan;
			object.tahun = $( '#form-realisasi-tahun' ).val();
			object.bulan = $( '#form-realisasi-bulan' ).val();
			object.anggaran = $( '#form-realisasi-anggaran' ).val();
			object.fisik = $( '#form-realisasi-fisik' ).val();

			return object;

		},

		setDetail: function( username ) {
			
			throw new Error( 'Not Supported' );

		},
		
		resetForm: function( obj ) {

			$( '#form-realisasi-tahun' ).val( obj.tahun );
			$( '#form-realisasi-bulan' ).val( obj.bulan );
			$( '#form-realisasi-anggaran' ).val( obj.anggaran );
			$( '#form-realisasi-fisik' ).val( obj.fisik );
			
			realisasi.currentObject = obj;
		
		}
		
	},
	
	loader: {
		
	}

};
