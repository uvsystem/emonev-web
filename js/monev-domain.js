/**
 * MonevDomain.js
 * 
 * UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.0.0
 */

/**
 * Home Object
 */
var home = {
	
	nama: 'HOME',

	getContent: function() {

		page.load( $( '#content' ), 'html/home.html' );
		
	},
	
	setData: function() {
		throw new Error( "Not yet implemented" );
	},
	
	load: function() {

		page.setName( home.nama );
		
		message.writeLog( 'loading home page content' ); // LOG

	}
	
};

var user = {

	nama: 'USER',
	
	load: function() {

		page.setName( home.nama );
		
		message.writeLog( 'loading user page content' ); // LOG

	}
};



/**
 * Definisi resources untuk data SKPD.
 */
var satkerDomain = {
	
	nama: 'SATKER',

	currentId: 0

};

/**
 *
 */
var programDomain = {
	
	nama: 'PROGRAM',
	
	currentId: 0,
	
	defaultObject: {},
	
	success: function( result ) {
		message.success( result );
		programDomain.reload();
	},
	
	reload: function() {
		page.setName( this.nama );
		
		var list = storage.get( programDomain.nama );
		
		this.load( list );
	},
	
	load: function( list ) {
	
		page.load( $( '#content' ), 'html/program.html' );

		this.content.setData( list );

		storage.set( list, this.nama );

		page.change( $( '#list-satuan-kerja' ), page.list.dataList.generateFromStorage( satkerDomain.nama, 'list-satuan-kerja') );
		
	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];

			activeContainer = programDomain;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.namaUnitKerja + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.tahunAwal + '</td>' +
					'<td>' + tmp.tahunAkhir + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="programDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-program">Detail</a></li>' +
						'<li><a href="#" onclick="programDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

				
			}
			
			page.change( $( '#table' ), html );

		},
		
		setDetail: function( id ) {

			programDomain.currentId = id;
			var program = storage.getById( programDomain, id );

			$( '#form-program-satuan-kerja' ).val( program.unitKerja.nama );
			$( '#form-program-nama' ).val( program.nama );
			$( '#form-program-tahun-awal' ).val( program.tahunAwal );
			$( '#form-program-tahun-akhir' ).val( program.tahunAkhir );
			
		},
		
		hapus: function( id ) {
			programRestAdapter.delete( id, programDomain.success );
		}
	}
};

/**
 *
 */
var kegiatanDomain = {
	
	nama: 'KEGIATAN',
	
	defaultObject: {},

	currentId: 0,
	currentParentId: 0,
	
	success: function( result ) {
		message.success( result );
		kegiatanDomain.reload();
	},
	
	reload: function() {
		page.setName( this.nama );
		this.load( [] );
	},
	
	load: function( list ) {

		page.load( $( '#content' ), 'html/kegiatan.html' );

		this.content.setData( list );

		storage.set( list, this.nama );
		
		page.change( $( '#list-satuan-kerja' ), page.list.dataList.generateFromStorage( satkerDomain.nama, 'list-satuan-kerja') );

		page.change( $( '#list-program' ), page.list.dataList.generateFromStorage( programDomain.nama, 'list-program') );

	},
	
	content: {
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];

			activeContainer = kegiatanDomain;
			activeContainer.list = list;

			var firstLast = tableSet( list, pageNumber );
			var html = '';	

			for ( var index = firstLast.first; index < firstLast.last; index++ ) {

				var tmp = list[ index ];

				html += '<tr href="#" onclick="kegiatanDomain.content.loadList(' + tmp.id + ')">' +
					'<td>' + tmp.namaProgram + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.paguAnggaran + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="kegiatanDomain.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-kegiatan">Detail</a></li>' +
						'<li><a href="#" onclick="kegiatanDomain.content.tambahSub(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-kegiatan">Tambah Sub Kegiatan</a></li>' +
						'<li><a href="#" onclick="kegiatanDomain.content.tambahRencana(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-realisasi">Tambah Rencana</a></li>' +
						'<li><a href="#" onclick="kegiatanDomain.content.hapus(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

			}

			if ( html != '' )
				page.change( $( '#table' ), html );

		},

		setDetail: function( id ) {

			var kegiatan = storage.getById( kegiatanDomain, id );
			kegiatanDomain.currentId = id;
			$( '#form-kegiatan-program' ).val( kegiatan.program.nama );
			$( '#form-kegiatan-nama' ).val( kegiatan.nama );
			$( '#form-kegiatan-anggaran' ).val( kegiatan.paguAnggaran );

		},

		tambahSub: function( id ) {

			page.change( $( '#message' ), '');
			kegiatanDomain.currentId = 0;
			kegiatanDomain.currentParentId = id;
			$( '#form-kegiatan-program' ).val( '' );
			$( '#form-kegiatan-nama' ).val( '' );
			$( '#form-kegiatan-anggaran' ).val( '' );

		},

		tambahRencana: function( id ) {

			kegiatanDomain.currentId = id;
			$( '#form-realisasi-tahun' ).val( '' );
			$( '#form-realisasi-bulan' ).val( '' );
			$( '#form-realisasi-rencana' ).val( '' );
			$( '#form-realisasi-anggaran' ).val( '' );
			$( '#form-realisasi-fisik' ).val( '' );
			
		},

		hapus: function( id ) {
			kegiatanRestAdapter.delete( id, kegiatanDomain.success );
		},

		loadList: function( id ) {

			kegiatanDomain.currentId = id;
			var kegiatan = storage.getById( kegiatanDomain, id );
			var listFisik = kegiatan.listFisik;
			
			anggaranRestAdapter.findByKegiatan( id, function( result ) {
				var listAnggaran = result.list;
				kegiatanDomain.content.loadAnggaran( listAnggaran );
			});

			kegiatanDomain.content.loadFisik( listFisik );

		},
	
		loadAnggaran: function( list ) {
				
			if ( !list )
				list = [ ];
			pageNumber = 0;

			activeContainer = {};
			activeContainer.list = list;

			var firstLast = tableSet( list, pageNumber );
			var html = '';	

			for ( var index = firstLast.first; index < firstLast.last; index++ ) {

				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.tahun + '</td>' +
					'<td>' + tmp.bulan + '</td>' +
					'<td>' + tmp.rencana + '</td>' +
					'<td>' + tmp.realisasi + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="kegiatanDomain.content.realisasiAnggaran(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-realisasi-anggaran">Realisasi</a></li>' +
						'<li><a href="#" onclick="kegiatanDomain.content.hapusAnggaran(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

			}

			if ( html != '' )
				page.change( $( '#table-anggaran' ), html );

		},
		
		realisasiAnggaran: function( id ) {

			kegiatanDomain.currentIdAnggaran = id;
			$( '#form-realisasi-tahun' ).val( '' );
			$( '#form-realisasi-bulan' ).val( '' );
			$( '#form-realisasi-rencana' ).val( '' );
			$( '#form-realisasi-anggaran' ).val( '' );

		},
		
		hapusAnggaran: function( id ) {
			anggaranRestAdapter.delete( id, kegiatanDomain.success );
		},
	
		loadFisik: function( list ) {

			if ( !list )
				list = [ ];

			activeContainer = {};
			activeContainer.list = list;

			var firstLast = tableSet( list, pageNumber );
			var html = '';	

			for ( var index = firstLast.first; index < firstLast.last; index++ ) {

				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.tahun + '</td>' +
					'<td>' + tmp.bulan + '</td>' +
					'<td>' + tmp.realisasi + '</td>' +
					'<td>' +
					'<div class="btn-group">' +
					  '<button type="button" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">' +
						'Pilihan <span class="caret"></span>' +
					  '</button>' +
					  '<ul class="dropdown-menu">' +
						'<li><a href="#" onclick="kegiatanDomain.content.realisasiFisik(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-realisasi-anggaran">Realisasi</a></li>' +
						'<li><a href="#" onclick="kegiatanDomain.content.hapusFisik(' + tmp.id + ')">Hapus</a></li>' +
					  '</ul>' +
					'</div>' +
					'</td>' +
					'</tr>';

			}

			page.change( $( '#table-fisik' ), html );

		},
		
		realisasiFisik: function( id ) {

			kegiatanDomain.currentIdFisik = id;
			$( '#form-realisasi-tahun' ).val( '' );
			$( '#form-realisasi-bulan' ).val( '' );
			$( '#form-realisasi-fisik' ).val( '' );

		},
		
		hapusFisik: function( id ) {
			fisikRestAdapter.delete( id, kegiatanDomain.success );
		}
	}
};

var rekapDomain = {

	nama: 'REKAP',
	
	reload: function() {
		
		rekap.content.getContent();
		
	},
	
	content: {
		
		getContent: function() {

			page.load( $( '#content' ), 'html/rekap.html');
			
		}
	}
};

/**
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

