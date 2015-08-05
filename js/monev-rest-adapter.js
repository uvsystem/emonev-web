/**
 * MonevRestAdapter.js
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

var target = 'https://core-unitedvision.whelastic.net';
var restAdapter = rest( target, 'monev' );

var programRestAdapter = {

	save: function( idSatuanKerja, id, nama, tahunAwal, tahunAkhir, callback ) {

		var program = {
			id: id,
			nama: nama,
			tahunAwal: tahunAwal,
			tahunAkhir: tahunAkhir
		};
		
		restAdapter.call( '/program/' + idSatuanKerja, program, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah program: " + program ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		restAdapter.call( '/program/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus program: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		restAdapter.call( '/program/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil program: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( idSatuanKerja, callback ) {

		restAdapter.call( '/program/satker/' + idSatuanKerja, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil program: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/program/cari/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari program dengan kode kata kunci: " + keyword + ", hasil: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		restAdapter.call( '/program', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil semua program: " + ( result.list ? result.list.length : 0 ) ); // LOG
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
		
		restAdapter.call( '/kegiatan/' + idProgram, kegiatan, 'POST',
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
		
		restAdapter.call( '/kegiatan/' + idKegiatan + '/sub', kegiatan, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menyimpan sub kegiatan: " + kegiatan ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		restAdapter.call( '/kegiatan/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus kegiatan: " + id ); // LOG
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		restAdapter.call( '/kegiatan/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findBySatker: function( idSatuanKerja, callback ) {

		restAdapter.call( '/kegiatan/satker/' + idSatuanKerja, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findByProgram: function( idProgram, callback ) {

		restAdapter.call( '/kegiatan/program/' + idProgram, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findAll: function( callback ) {

		restAdapter.call( '/kegiatan', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil kegiatan: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	search: function( keyword, callback ) {

		restAdapter.call( '/kegiatan/cari/' + keyword, null, 'GET',
			function( result ) {
				message.writeLog( "Mencari kegiatan dengan kata kunci: " + keyword + ", hasil: " + ( result.list ? result.list.length : 0 ) ); // LOG
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
		
		restAdapter.call( '/anggaran/' + idKegiatan, anggaran, "POST", function( result ) {
				callback( result );
				message.writeLog( "Menyimpan anggaran: " + result.object ); // LOG
			},
			message.error
		);
	},

	realisasi: function( idAnggaran, realisasi, callback ) {

		restAdapter.call( '/anggaran/' + idAnggaran + '/realisasi/' + realisasi, null, 'POST',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah realisasi untuk anggaran: " + idAnggaran ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		restAdapter.call( '/anggaran/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus anggaran: " + id ); // LOG
			},
			message.error
		);
	},
	
	find: function( idKegiatan, tahun, bulan, callback ) {

		restAdapter.call( '/anggaran/kegiatan/' + idKegiatan + '/tahun/' + tahun + '/bulan/' + bulan, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		restAdapter.call( '/anggaran/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findByProgram: function( idProgram, callback ) {

		restAdapter.call( '/anggaran/program/' + idProgram, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil anggaran: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},

	findByKegiatan: function( idKegiatan, callback ) {

		restAdapter.call( '/anggaran/kegiatan/' + idKegiatan, null, 'GET',
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
		
		restAdapter.call( '/fisik/' + idKegiatan, fisik, "POST", function( result ) {
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
	
		restAdapter.call( '/fisik/' + idFisik + '/foto/location', foto, 'PUT',
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
	
		restAdapter.call( '/fisik/' + idFisik + '/foto', listFoto, 'PUT',
			function( result ) {
				callback( result );
				message.writeLog( "Menambah realisasi untuk fisik: " + idFisik ); // LOG
			},
			message.error
		);
	},
	
	"delete": function( id, callback ) {

		restAdapter.call( '/fisik/' + id, null, 'DELETE',
			function( result ) {
				callback( result );
				message.writeLog( "Menghapus fisik: " + id ); // LOG
			},
			message.error
		);
	},
	
	find: function( idKegiatan, tahun, bulan, callback ) {

		restAdapter.call( '/fisik/kegiatan/' + idKegiatan + '/tahun/' + tahun + '/bulan/' + bulan, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findOne: function( id, callback ) {

		restAdapter.call( '/fisik/' + id, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + result.object ); // LOG
				callback( result );
			},
			message.error
		);
	},
	
	findByProgram: function( idProgram, callback ) {

		restAdapter.call( '/fisik/program/' + idProgram, null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil fisik: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	},

	findByKegiatan: function( idKegiatan, callback ) {

		restAdapter.call( '/fisik/kegiatan/' + idKegiatan, null, 'GET',
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
		
		restAdapter.callFree( '/aplikasi/kode', null, "GET", function( result ) {
				callback( result );
				message.writeLog( "Kode aplikasi: " + result.object ); // LOG
			},
			message.error,
			false // Sychronous Access
		);
	}
};

var unitKerjaRestAdapter = {
	
	all: function( callback ) {

		var restAdapter = rest( target, 'ehrm' );
		restAdapter.call( '/satker', null, 'GET',
			function( result ) {
				message.writeLog( "Mengambil semua unit kerja: " + ( result.list ? result.list.length : 0 ) ); // LOG
				callback( result );
			},
			message.error
		);
	}
};

