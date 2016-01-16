/**
 * monev.js
 *
 * UnitedVision. 2015
 * Manado, Indonesia.
 * dkakunsi.unitedvision@gmail.com
 * 
 * Created by Deddy Christoper Kakunsi
 * Manado, Indonesia.
 * deddy.kakunsi@gmail.com | deddykakunsi@outlook.com
 * 
 * Version: 1.1.0
 */

var KEGIATAN_PHOTO_FOLDER = 'profile';
var target = 'https://core-unitedvision.whelastic.net';
// var target = 'http://localhost:8080';
var monevRestAdapter = rest( target, 'monev' );

var programRestAdapter = {

	save: function( idSatuanKerja, id, nama, tahunAwal, tahunAkhir, callback ) {

		var program = {
			id: id,
			nama: nama,
			tahunAwal: tahunAwal,
			tahunAkhir: tahunAkhir
		};
		
		monevRestAdapter.call( '/program/' + idSatuanKerja, program, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah program: " + program ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		monevRestAdapter.call( '/program/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus program: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		monevRestAdapter.call( '/program/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil program: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( idSatuanKerja, callback ) {

		monevRestAdapter.call( '/program/satker/' + idSatuanKerja, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil program: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		monevRestAdapter.call( '/program/cari/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari program dengan kode kata kunci: " + keyword + ", hasil: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		monevRestAdapter.call( '/program', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil semua program: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapById: function( id, callback ) {

		monevRestAdapter.callFree( '/program/rekap/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Program dengan  id: " + id + ", hasil: " + result.model ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapByTahun: function( tahun, callback ) {

		monevRestAdapter.callFree( '/program/rekap/tahun/' + tahun, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Program dengan  tahun: " + tahun + ", hasil: " + result.list ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapBySatker: function( tahun, kode, callback ) {

		monevRestAdapter.callFree( '/program/rekap/tahun/' + tahun + '/satker/' + kode, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Program dengan  kode satuan kerja: " + kode  + ", hasil: " + result.model ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var kegiatanRestAdapter = {

	save: function( idProgram, id, nama, paguAnggaran, callback ) {

		var kegiatan = {
			id: id,
			nama: nama,
			paguAnggaran: paguAnggaran
		};
		
		monevRestAdapter.call( '/kegiatan/' + idProgram, kegiatan, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan kegiatan: " + kegiatan ); // LOG
			},
			message.error
		);
	},
	
	addSub: function( idKegiatan, id, nama, paguAnggaran, callback ) {

		var kegiatan = {
			id: id,
			nama: nama,
			paguAnggaran: paguAnggaran
		};
		
		monevRestAdapter.call( '/kegiatan/' + idKegiatan + '/sub', kegiatan, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan sub kegiatan: " + kegiatan ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		monevRestAdapter.call( '/kegiatan/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus kegiatan: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		monevRestAdapter.call( '/kegiatan/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( idSatuanKerja, callback ) {

		monevRestAdapter.call( '/kegiatan/satker/' + idSatuanKerja, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findByProgram: function( idProgram, callback ) {

		monevRestAdapter.call( '/kegiatan/program/' + idProgram, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		monevRestAdapter.call( '/kegiatan', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		monevRestAdapter.call( '/kegiatan/cari/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari kegiatan dengan kata kunci: " + keyword + ", hasil: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapById: function( id, callback ) {

		monevRestAdapter.call( '/kegiatan/rekap/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Kegiatan dengan id: " + id + ", hasil: " + result.model ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapByTahun: function( tahun, callback ) {

		monevRestAdapter.call( '/kegiatan/rekap/tahun/' + tahun, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Kegiatan dengan tahun: " + tahun + ", hasil: " + result.list ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapBySatker: function( tahun, kode, callback ) {

		monevRestAdapter.callFree( '/kegiatan/rekap/tahun/' + tahun + '/satker/' + kode, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Kegiatan dengan kode satuan kerja: " + kode  + ", hasil: " + result.list.length ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	rekapByProgram: function( tahun, id, callback ) {

		monevRestAdapter.callFree( '/kegiatan/rekap/tahun/' + tahun + '/program/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Rekap Kegiatan dengan  program: " + id  + ", hasil: " + result.model ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var anggaranRestAdapter = {

	save: function( idKegiatan, tahun, bulan, rencana, realisasi, callback ) {

		var anggaran = {
			tahun: tahun,
			bulan: bulan,
			rencana: rencana,
			realisasi: realisasi
		};
		
		monevRestAdapter.call( '/anggaran/' + idKegiatan, anggaran, "POST", function( result ) {
				callback( result );
				message.writeLog( "Menyimpan anggaran: " + result.object ); // LOG
			},
			message.error
		);
	},

	realisasi: function( idAnggaran, realisasi, callback ) {

		monevRestAdapter.call( '/anggaran/' + idAnggaran + '/realisasi/' + realisasi, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah realisasi untuk anggaran: " + idAnggaran ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		monevRestAdapter.call( '/anggaran/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus anggaran: " + id ); // LOG
			},
			message.error
		);
	},
	
	find: function( idKegiatan, tahun, bulan, callback ) {

		monevRestAdapter.call( '/anggaran/kegiatan/' + idKegiatan + '/tahun/' + tahun + '/bulan/' + bulan, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		monevRestAdapter.call( '/anggaran/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findByProgram: function( idProgram, callback ) {

		monevRestAdapter.call( '/anggaran/program/' + idProgram, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},

	findByKegiatan: function( idKegiatan, callback ) {

		monevRestAdapter.call( '/anggaran/kegiatan/' + idKegiatan, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var fisikRestAdapter = {

	save: function( idKegiatan, id, tahun, bulan, realisasi, callback ) {

		var fisik = {
			id: id,
			tahun: tahun,
			bulan: bulan,
			realisasi: realisasi
		};
		
		monevRestAdapter.call( '/fisik/' + idKegiatan, fisik, "POST", function( result ) {
				callback( result );
				message.writeLog( "Menyimpan fisik: " + result.object ); // LOG
			},
			message.error
		);
	},

	addFoto: function( idFisik, location, callback ) {

		var foto = {
			location: location
		};
	
		monevRestAdapter.call( '/fisik/' + idFisik + '/foto/location', foto, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah realisasi untuk fisik: " + idFisik ); // LOG
			},
			message.error
		);
	},

	addFotos: function( idFisik, listLocation, callback ) {

		var listFoto;
		var i;
		for ( i = 0; i < listLocation.length; i++ )
			listFoto[ i ] = { location: listLocation[ 0 ] };
	
		monevRestAdapter.call( '/fisik/' + idFisik + '/foto', listFoto, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah realisasi untuk fisik: " + idFisik ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		monevRestAdapter.call( '/fisik/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus fisik: " + id ); // LOG
			},
			message.error
		);
	},
	
	find: function( idKegiatan, tahun, bulan, callback ) {

		monevRestAdapter.call( '/fisik/kegiatan/' + idKegiatan + '/tahun/' + tahun + '/bulan/' + bulan, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		monevRestAdapter.call( '/fisik/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findByProgram: function( idProgram, callback ) {

		monevRestAdapter.call( '/fisik/program/' + idProgram, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},

	findByKegiatan: function( idKegiatan, callback ) {

		monevRestAdapter.call( '/fisik/kegiatan/' + idKegiatan, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

var aplikasiRestAdapter = {
	
	findKode: function( callback ) {
		
		monevRestAdapter.callFree( '/aplikasi/kode', null, "GET", function( result ) {
				callback( result );
				message.writeLog( "Kode aplikasi: " + result.object ); // LOG
			},
			message.error,
			false // Sychronous Access
		);
	}
};

