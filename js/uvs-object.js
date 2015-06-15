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
 * Home Object
 */
var home = {
	
	nama: 'Home',

	getContent: function() {

		page.load( $( '#content' ), 'html/home.html' );
		
	},
	
	setData: function() {

		rest.callAjax(
			{
				path: '/perusahaan/detail.php', 
				
				data:
				{
					bulan: myDate.getBulan(),
					tahun: myDate.getTahun()
				},
				
				method: 'POST', 
				
				success: function( result )
				{ 

					$( '#pemasukan' ).val( number.addCommas( result.object.income ) );
					$( '#pengeluaran' ).val( number.addCommas( result.object.expanse ) );
					$( '#laba' ).val( number.addCommas( result.object.laba ) );
					
				}, 
				
				error: function( result )
				{

					$( '#pemasukan' ).val( 'Data tidak ditemukan' );
					$( '#pengeluaran' ).val( 'Data tidak ditemukan' );
					$( '#laba' ).val( 'Data tidak ditemukan' );
				}
			}
		);
	},
	
	load: function() {

		page.setName( home.nama );

		//home.getContent();
		//home.setData();
		
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
	
		loadSearch: function( keyword ) {
		
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
var bagian = {
	
	nama: 'BAGIAN',
	
	currentObject: null,
		
	defaultObject: {
		id: 0,
		kode: 'DEFAULT',
		nama: '',
		skpd:{
			id: 0,
			kode: 'DEFAULT',
			nama: '',
		}
	},

	success: function ( result ) {

		message.success( result );
		
		bagian.reload();
		
		bagian.currentObject = null;

	},
	
	reload: function() {

		var onSuccess = function( result ) {
		
			bagian.load( result.list );
			
			storage.set( result.list, bagian.nama );
		
		};
		
		rest.call( '/bagian', null, 'GET', onSuccess, message.error );

	},
	
	load: function( list ) {

		page.setName( bagian.nama );
		
		bagian.content.getContent();
		
		bagian.content.setData( list );
		
	},
	

	content: {
	 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = bagian;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.kode + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + ( !tmp.skpd ? '' : tmp.skpd.nama ) + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="bagian.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-bagian">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},
		
		getContent: function( list ) {

			page.load( $( '#content' ), 'html/bagian.html' );
			
		},

		getObject: function() {
		
			var object = bagian.currentObject;
			
			if ( !object )
				object = choose( null, bagian.defaultObject);

			object.kode = $( '#form-bagian-kode' ).val();
			object.nama = $( '#form-bagian-nama' ).val();
			object.skpd = storage.getByNama( skpd, $( '#form-bagian-skpd' ).val() );
							
			return object;
		
		},

		setDetail: function( id ) {

			var obj = storage.getById( bagian, id );
			
			this.resetForm( obj );
			
			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-bagian-kode' ).val( obj.kode );
			$( '#form-bagian-nama' ).val( obj.nama );
			
			var namaSkpd = ( obj.skpd ) ? obj.skpd.nama : '';
			$( '#form-bagian-skpd' ).val( namaSkpd );
			
			bagian.currentObject = obj;
		
		},		
	},
	
	loader: {
	
		loadSearch: function( keyword ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				bagian.load( list );
				
			};
			
			rest.call( '/bagian/search/' + keyword, '', 'GET', onSuccess, message.error );
			
		},
		
		loadBySkpd: function( id ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				bagian.load( list );
				
			};
			
			rest.call( '/bagian/skpd/' + id, '', 'GET', onSuccess, message.error );
			
		}
	}
};

/*
 * Definisi resources untuk operatorAbsen.
 * Sangat tergantung pada variable page (api.js).
 */
var operatorAbsen = {
	
	nama: 'OPERATOR',
	
	searchBy: '',

	list: null,
	
	currentObject: null,
	
	defaultObject: {
		username: '',
		password: '',
		tipe:'',
		skpd:{
			nama: ''
		},
		deskripsi:''
	},

	success: function ( result ) {

		message.success( result );
		
		operatorAbsen.reload();
		
		operatorAbsen.currentObject = null;

	},

	load: function( list ) {

		page.setName( operatorAbsen.nama );
		
		operatorAbsen.content.getContent();
		
		operatorAbsen.content.setData( list );
		
	},
	
	reload: function() {

		var onSuccess = function( result ) {
		
			operatorAbsen.load( result.list );
			
			storage.set( result.list, operatorAbsen.nama );
		
		};
		
		rest.call( '/operator', null, 'GET', onSuccess, message.error );

	},

	content: {
	 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = operatorAbsen;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.username + '</td>' +
					'<td>' + tmp.password + '</td>' +
					'<td>' + tmp.tipe + '</td>' +
					'<td>' + ( tmp.skpd ? tmp.skpd.nama : '') + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="operatorAbsen.content.setDetail(' + tmp.username + ')" data-toggle="modal" data-target="#modal-form-operator">Detail</button>' +
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
		
			var object = operatorAbsen.currentObject;
			
			if ( !object )
				object = choose( null, operatorAbsen.defaultObject);

			object.username = $( '#form-operator-username' ).val();
			object.password = $( '#form-operator-password' ).val();
			object.tipe = $( '#form-operator-tipe' ).val();
			object.deskripsi = $( '#form-operator-deskripsi' ).val();
			object.skpd = storage.getByNama( skpd, $( '#form-operator-lokasi' ).val() );
				
			return object;
		
		},

		setDetail: function( username ) {

			var obj = storage.getByUsername( operatorAbsen, username );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {
			
			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );

			$( '#form-operator-username' ).val( obj.username );
			$( '#form-operator-password' ).val( obj.password );
			$( '#form-operator-tipe' ).val( obj.tipe );
			$( '#form-operator-lokasi' ).val( obj.skpd.nama );
			$( '#form-operator-deskripsi' ).val( obj.deskripsi );
			
			operatorAbsen.currentObject = obj;
		
		},		
	},
	
	loader: {
	
		loadByUsername: function( username ) {
		
			var url = '/operator/' + username;
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorAbsen.load( list );
				
			};
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		},
		
		loadByTipe: function( tipe ) {
			
			var url = '/operator/tipe/' + tipe;
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorAbsen.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		},
		
		// Lokasi berarti SKPD, parameter lokasi adalah idSkpd.
		loadByLokasi: function( lokasi ) {
			
			var url = '/operator/lokasi/' + lokasi;
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				operatorAbsen.content.setRekapBarangHabis( list );
				
			};
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		}
	}
};

/*
 * Definisi resources untuk absen.
 * Sangat tergantung pada variable page (api.js).
 */
var absen = {

	nama: 'ABSEN',
	
	searchBy: '',
	
	defaultObject: {
		pegawai: {
			nip: '',
			nama: '',
			golongan: '',
			jabatan: '',
			skpd: '',
			bagian: ''
		},
		status: '',
		tanggalStr: '',
		penginput: {
			username: ''
		},
		pengubah: {
			username: ''
		},
		waktuAbsen: {
			pagiStr: '',
			tengahStr: '',
			siangStr: '',
			soreStr: ''
		}
	},
	
	currentObject: null,

	success: function ( result ) {

		message.success( result );
		
		absen.load( result.list );

		absen.currentObject = null;

	},

	load: function( list ) {
		
		page.setName( absen.nama );
		
		absen.content.getContent();
		
		absen.content.setData( list );
		
	},
	
	reload: function() {

		page.setName( absen.nama );
		
		absen.content.getContent();
		
	},

	loader: {
		
		loadSearch: function( keyword ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				absen.load( list );
				
			};
			
			rest.call( '/absen/search/' + keyword, '', 'GET', onSuccess, message.error );
			
		},

		loadByNip: function( nip, tanggalAwal, tanggalAkhir ) {
			
			var onSuccess = function( result ) {

				var list = page.list.get( result );
				absen.load( list );
				
			};
		
			var url = '/absen/pegawai/' + nip + '/' + tanggalAwal + '/' + tanggalAkhir;
			
			rest.call( url, obj, 'GET', onSuccess, message.error );
			
		},

		loadBySkpd: function( skpd, tanggalAwal, tanggalAkhir ) {
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				absen.load( list );
				
			};
			
			var url = '/absen/skpd/' + skpd + '/' + tanggalAwal + '/' + tanggalAkhir;
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		},

		loadByBagian: function( skpd, bagian, tanggalAwal, tanggalAkhir ) {
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				absen.load( list );
				
			};
			
			var url = '/absen/bagian/' + bagian + '/' + skpd + '/' + tanggalAwal + '/' + tanggalAkhir;
			
			rest.call( url, '', 'GET', onSuccess, message.error );
			
		}

	},

	content: {

		getContent: function() {

			page.load( $( '#content' ), 'html/absen.html' );

			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );
			page.change( $( '#list-bagian' ), page.list.option.generateFromStorage( bagian.nama ) );
			
		},

		getObject: function() {
		
			var object = absen.currentObject;
			
			if ( !object )
				object = choose( null, absen.defaultObject );
			
			return object;
			
		},

		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
			
			storage.set( list, absen.nama );
	
			activeContainer = absen;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];
				
				html += '<tr>' +
					'<td>' + tmp.pegawai.nip + '</td>' +
					'<td>' + tmp.pegawai.nama + '</td>' +
					'<td>' + tmp.tanggalStr + '</td>' +
					'<td>' + tmp.status + '</td>' +
					'<td>' + tmp.pagiStr + '</td>' +
					'<td>' + tmp.tengahStr + '</td>' +
					'<td>' + tmp.siangStr + '</td>' +
					'<td>' + tmp.soreStr + '</td>' +
					'<td>' + ( !tmp.keterangan ? '' : tmp.keterangan ) + '</td>';
				
					if ( operator.getRole() == 'ADMIN' && tmp.status == 'HADIR' ) {
						html += '<td>' +
						'<div class="btn-group btn-group-xs">' +
						'<button type="button" class="btn btn-danger" onclick="absen.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-absen">Detail</button>' +
						'</div>' +
						'</td>';
					} else {
						html += '<td>&nbsp</td>';
					}
					
					html += '</tr>';
			}
			
			page.change( $( '#table' ), html );
			
		},

		setDetail: function( id ) {

			var obj = storage.getById( absen, id );

			this.resetForm( obj );

		},
	
		resetForm: function( obj ) {
			
			$( '#form-absen-nip' ).val( obj.pegawai.nip );
			$( '#form-absen-nama' ).val( obj.pegawai.nama );
			$( '#form-absen-tanggal' ).val( obj.tanggal );
			$( '#form-absen-pagi' ).val( obj.pagiStr );
			$( '#form-absen-tengah' ).val( obj.tengahStr);
			$( '#form-absen-siang' ).val( obj.siangStr );
			$( '#form-absen-sore' ).val( obj.soreStr );
		}
		
	}
	
};

/*
 * Definisi resources untuk otentikasi.
 * Sangat tergantung pada variable page (api.js).
 */
var otentikasi = {

	nama: 'OTENTIKASI',
	
	searchBy: '',

	currentObject: null,
	
	defaultObject: {
		id: 0,
	},

	success: function ( result ) {

		message.success( result );

		otentikasi.reload();
		
		otentikasi.currentObject = null;

	},

	load: function( list ) {

		page.setName( otentikasi.nama );
		
		otentikasi.content.getContent();
		
		otentikasi.content.setData( list );
		
	},
	
	reload: function() {
		
		var onSuccess = function( result ) {
		
			otentikasi.load( result.list );
			
			storage.set( result.list, otentikasi.nama );

			page.change( $( '#list-otentikasi' ), page.list.option.generateFromStorage( otentikasi.nama ) );
		
		};
		
		var url = '/otentikasi/perusahaan.php';

		rest.call( url, '', 'POST', onSuccess, message.error );

	},
	
	content: {
		 
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = otentikasi;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + ( ( tmp.parent != null && tmp.parent != undefined ) ? tmp.parent.nama : '' )+ '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="otentikasi.content.setDetail(' + tmp.id + ')" data-toggle="modal" data-target="#modal-form-otentikasi">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );
				
		},

		getContent: function( ) {

			page.load( $( '#content' ), 'html/otentikasi.html' );
			
		},

		getObject: function() {
		
			var object = otentikasi.currentObject;
			
			if ( !object )
				object = choose( null, otentikasi.defaultObject);
				
			object.parent = storage.getByNama( otentikasi, $( '#form-otentikasi-parent' ).val() );
			object.nama = $( '#form-otentikasi-nama' ).val();
			
			return object;
			
		},

		setDetail: function( id ) {

			var obj = storage.getById( otentikasi, id );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {

			$( '#form-otentikasi-parent' ).val( ( ( obj.parent != null && obj.parent != undefined ) ? obj.parent.nama : '' ) );
			$( '#form-otentikasi-nama' ).val( obj.nama );

			otentikasi.currentObject = obj;
		
		}
			
	},
	
	loader: {
		
		loadByIdParent: function( id ) {
		
			var _parent = storage.getById( otentikasi, id );

			this.loadByParent( _parent );
			
		},
		
		loadByParent: function( _parent ) {
		
			var url = '/otentikasi/parent.php';

			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				otentikasi.load( list );
				
			};
			
			rest.call( url, _parent, 'POST', onSuccess, message.error );
			
		},

		loadByNama: function( nama ) {
			
			var url = '/otentikasi/nama.php';
			var obj = { nama: nama };
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				otentikasi.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		}
	}

};

/*
 * Definisi resources untuk pegawai.
 * Sangat tergantung pada variable page (api.js).
 */
var pegawai = {

	nama: 'PEGAWAI',
	
	searchBy: '',
	
	defaultObject: {
		nip: '',
		nama: '',
		golongan: '',
		jabatan: '',
		bagian: {
			nama: '',
			skpd: {
				nama: ''
			}
		}
	},
	
	currentObject: null,

	listRole: [ { nama: 'OWNER'}, { nama: 'MANAGER'}, { nama: 'operatorAbsen'} ],
	
	success: function ( result ) {

		message.success( result );

		pegawai.reload( );

		pegawai.currentObject = null;
		
	},

	load: function( list ) {

		page.setName( pegawai.nama );
		
		pegawai.content.getContent();
		
		pegawai.content.setData( list );
		
	},
	
	reload: function() {
		
		var onSuccess = function( result ) {
		
			pegawai.load( result.list );
			
			storage.set( result.list, pegawai.nama );
		
		};
		
		var url = '/pegawai';

		rest.call( url, null, 'GET', onSuccess, message.error );
		
	},
	
	getListNip: function() {
		
		var list = storage.get( pegawai.nama );
		var listNip = [];
		
		for ( var index = 0; index < list.length; index++ ) {
			
			var tmp = list[ index ];
			
			listNip[ index ] = tmp.nip;
			
		}
		
		return listNip;
	},
	
	getByNip: function( nip ) {

		var listPegawai = storage.get( pegawai.nama );
		
		for ( var index = 0; index < listPegawai.length; index++ ) {
			
			var tmp = listPegawai[ index ];
			
			message.writeLog( tmp.nip + ': ' + ( tmp.nip == nip ) );
			
			if ( tmp.nip == nip)
				return tmp;
		}
		
		return { nama: 'Tidak terdaftar' };
	},

	content: {

		getContent: function() {

			page.load( $( '#content' ), 'html/pegawai.html' );
			
		},
		
		setData: function( list, pageNumber ) {

			if ( !list )
				list = [ ];
	
			activeContainer = pegawai;
			activeContainer.list = list;
			
			var firstLast = tableSet( list, pageNumber );
	
			var html = '';	
			
			for ( var index = firstLast.first; index < firstLast.last; index++ ) {
			
				var tmp = list[ index ];

				html += '<tr>' +
					'<td>' + tmp.nip + '</td>' +
					'<td>' + tmp.nama + '</td>' +
					'<td>' + tmp.golongan + '</td>' +
					'<td>' + tmp.jabatan + '</td>' +
					'<td>' + ( !tmp.bagian.skpd ? '' : tmp.bagian.skpd.nama ) + '</td>' +
					'<td>' + tmp.bagian.nama + '</td>' +
					'<td>' +
					'<div class="btn-group btn-group-xs">' +
					'<button type="button" class="btn btn-danger" onclick="pegawai.content.setDetail(' + tmp.nip + ')" data-toggle="modal" data-target="#modal-form-pegawai">Detail</button>' +
					'</div>' +
					'</td>' +
					'</tr>';
				
			}
			
			page.change( $( '#table' ), html );

		},

		getObject: function() {
		
			var object = pegawai.currentObject;
			
			if ( !object )
				object = choose( null, pegawai.defaultObject );
			
			object.nip = $( '#form-pegawai-nip' ).val();
			object.nama = $( '#form-pegawai-nama' ).val();
			object.golongan = $( '#form-pegawai-golongan' ).val();
			object.jabatan = $( '#form-pegawai-jabatan' ).val();
			object.bagian = storage.getByNama( bagian, $( '#form-pegawai-bagian' ).val() );
			
			return object;
		},
		
		setDetail: function( nip ) {

			var obj = storage.getByNip( pegawai, nip );
			
			this.resetForm( obj );
			
		},
		
		resetForm: function( obj ) {
		
			page.change( $( '#list-skpd' ), page.list.option.generateFromStorage( skpd.nama ) );
			page.change( $( '#list-bagian' ), page.list.option.generateFromStorage( bagian.nama ) );

			$( '#form-pegawai-nip' ).val( obj.nip );
			$( '#form-pegawai-nama' ).val( obj.nama );
			$( '#form-pegawai-golongan' ).val( obj.golongan );
			$( '#form-pegawai-jabatan' ).val( obj.jabatan );
			$( '#form-pegawai-skpd' ).val( obj.bagian.skpd.nama );
			$( '#form-pegawai-bagian' ).val( obj.bagian.nama );

			pegawai.currentObject = obj;
		
		}

	},
	
	loader: {
		
		loadSearch: function( keyword ) {
		
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				pegawai.load( list );
				
			};
			
			rest.call( '/pegawai/search/' + keyword, '', 'GET', onSuccess, message.error );
			
		},

		loadByIdabsen: function( id ) {
		
			var _absen = storage.getById( absen, id );
			
			this.loadByabsen( _absen );
		},
		
		loadByabsen: function( _absen ) {
		
			var url = '/pegawai/absen.php';
			
			var onSuccess = function( result ) {

				var list = page.list.get( result );
				pegawai.load( list );
					
			};

			rest.call( url, _absen, 'POST', onSuccess, message.error );
			
		},
		
		loadByKode: function( kode ) {
		
			var url = '/pegawai/kode.php';
			var obj = { kode: kode };
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				pegawai.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		},
		
		loadByNama: function( nama ) {
			
			var url = '/pegawai/nama.php';
			var obj = { nama: nama };
			
			var onSuccess = function( result ) {
			
				var list = page.list.get( result );
				pegawai.load( list );
				
			};
			
			rest.call( url, obj, 'POST', onSuccess, message.error );
			
		}
	
	}
	
};

var rekap = {

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

