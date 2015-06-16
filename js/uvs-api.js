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
 
var myUrl = {

	protocol: 'https',
	
	apiHost: 'core-unitedvision.whelastic.net',
	
	printHost: 'core-unitedvision.whelastic.net',
	
	apiProject: 'monev',
	
	printProject: 'monev',
	
	apiUrl: function( ) {
	
		return this.protocol + '://' + this.apiHost + '/' + this.apiProject;
		
	},
	
	printUrl: function( credential ) {
	
		return this.protocol + '://' + credential + this.printHost + '/' + this.printProject;
		
	},
	
	secureUrl: function( credential ) {
	
		return this.protocol + '://' + credential + '@' + this.apiHost + '/' + this.apiProject;
		
	}
	
};

var waitModal;

/*
 * Pesan yang akan ditampilkan ketika terjadi suatu proses.
 */
var message = {
	
	/*
	 * Sistem tidak menampilkan apapun.
	 */
	empty: function() { },
		
	/*
	 * Proses menghasilkan pesan yang perlu ditampilkan.
	 */
	write: function( msg ) {
		
		alert( msg );
		
	},
		
	/*
	 * Proses berhasil.
	 * Lakukan aksi berdasarkan tipe message.
	 */
	success: function(result) {
	
		switch ( result.tipe ) {
		
			case "SUCCESS": console.log( "Proses SUCCESS" );
					page.change( $( '#message' ), 
						'<div id="success-alert" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Selamat!</strong> Proses berhasil</div>');
					// alert( 'Berhasil' );
				break;
			case "ENTITY": console.log( "Entity Set" );
				break;
			case "LIST": console.log( "List Set" );
				break;
			case "OBJECT": console.log( "Object Set" );
					page.change( $( '#message' ), 
						'<div id="success-alert" class="alert alert-success alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Selamat!</strong> Proses berhasil</div>');
				break;
			case "MESSAGE": 
					page.change( $( '#message' ), 
						'<div id="warning-alert" class="alert alert-warning alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> ' + result.message + '</div>');
				break;
			case "ERROR": 
					page.change( $( '#message' ), 
						'<div id="error-alert" class="alert alert-danger alert-dismissible" role="alert"><button type="button" class="close" data-dismiss="alert" aria-label="Close"><span aria-hidden="true">&times;</span></button><strong>Error!</strong> ' + result.message + '</div>');
				break;
			default: console.log( "Tipe result tidak dikenali : " + result.tipe );
		}
		
		message.writeLog( 'Finish with success' ); // DEBUG
	
	},
		
	/*
	 * Secara default menampilkan pesan koneksi error ketika terjadi kesalahan.
	 */
	error: function() {

		alert( 'Tidak bisa melakukan koneksi ke server' );
		
	},
		
	/*
	 * Tampilkan error. Biasanya digunakan saat proses debugging.
	 */
	writeError: function( jqXHR, textStatus, errorThrown ) {

		alert( 'Error : ' + textStatus + ' - ' + errorThrown );
		
	},
		
	/*
	 * Tampilkan log. Biasanya browser debugger.
	 */
	writeLog: function( log ) {

		console.log( log );

	},
		
	/*
	 * Tampilkan error pada log. Biasanya browser debugger.
	 */
	log: function( jqXHR, textStatus, errorThrown ) {

		console.log( 'Error : ' + textStatus + ' - ' + errorThrown );
		
	},
	
	logResult: function( result ) {
		
		console.log( result.message );

	}
	
};

/*
 * Variabel untuk menampung data pegawai yang melakukan login.
 * Digunakan untuk otentikasi dan otorisasi.
 */
var operator = {
	
	/*
	 * Mengambil objek pegawai yang berhasil login terakhir kali.
	 */
	getOperator: function() {

		var tmp = localStorage.getItem( 'operator' );
		
		if ( !tmp )
			return null;
		
		return JSON.parse( tmp );
		
	},
	
	setOperator: function( op ) {
		
		localStorage.setItem( 'operator', JSON.stringify( op ) );
		
	},
		
	/*
	 * Mengambil username dari pegawai yang berhasil login terakhir kali.
	 * Sering digunakan untuk melakukan REST request.
	 */
	getUsername: function() {

		var tmp = this.getOperator();

		if ( !tmp ) 
			return null;
	
		return tmp.username;
	},
		
	/*
	 * Mengambil password dari pegawai yang berhasil login terakhir kali.
	 * Hanya digunakan untuk kebutuhan yang spesifik.
	 */
	getPassword: function() {

		var tmp = this.getOperator();

		if ( !tmp )
			return null;

		return tmp.password;
		
	},
				
	/*
	 * Mengambil ROLE dari pegawai yang berhasil login terakhir kali.
	 * Digunakan untuk proses otorisasi setelah login.
	 */
	getRole: function() {

		var tmp = this.getOperator();

		if ( !tmp ) 
			return null;

		return tmp.role;
		
	},
	
	getSkpd: function() {
		
		var tmp = this.getOperator();
		
		if ( !tmp )
			return null;
		
		return tmp.skpd;
		
	},

	/*
	 * Reset objek token pada keadaan semula. Menghapus semua data pegawai yang berhasil login.
	 * Setelah memanggil fungsi ini, pegawai harus login lagi untuk melakukan proses berikutnya.
	 * Digunakan ketika logout.
	 */
	reset: function() {

		// Set token menjadi null. Pada sesi berikutnya, user harus login.
		this.setOperator( null );
		
	},
		
	/*
	 * Mengecek apakah token ada dan masih berlaku.
	 * Jika token ada dan masih berlaku, maka pegawai bisa melakukan proses berikutnya, selain dari pada itu, pegawai harus login kembali.
	 */
	isLogin: function() {

		var tmp = this.getOperator();
		
		if ( !tmp )
			return false;

		return true;
		
	}
};

/*
 * Fungsi untuk melakukan REST request.
 */
var rest = {

	/*
	 * Membuat REST request.
	 */
	call: function( path, data, method, success, error ) {

		// Jika tidak login, redirect ke halaman login.
		if ( operator.isLogin() == false ) {
				
			window.location.href = 'login.html';
			return;
				
		}

		// Token menjadi pengganti password user.
		var _password = operator.getPassword();
		var _username = operator.getUsername();

		var credential = _username + ':' + _password;
		
		var promise = $.ajax(
			{
		        type: method,
		        url: myUrl.apiUrl() + path,
							        
				contentType: 'application/json',
			
		        processData: false,
		        data: JSON.stringify( data ),
						
		        beforeSend: function ( jqXHR, settings )
				{
					// Sebelum proses, tampilkan wait modal.
					waitModal.show();	
					jqXHR.setRequestHeader ("Authorization", "Basic " + btoa( credential ) );
				}
			}
		);

	    promise.done( function( result )
		{
			// Otomatis parse object menjadi JSON. Dan eksekusi function.
			// result = JSON.parse( result );
				
			if ( result.tipe == "ERROR" )
				message.logResult( result ); // LOG

			success( result );
				
		} );

		// Panggil error ketika terjadi kesalahan.
		promise.fail( error );
			  
		promise.always( function ( jqXHR, textStatus )
		{
			// Setelah proses selesai, sembunyikan wait modal.
			waitModal.hide();
	    } );
			
	},

	callAjax: function( object ) {

		var path = object.path; 
		var data = object.data;
		var method = object.method;
		var success = object.success;
		var error = object.error;
			
		if ( !path ) throw new Error( 'api.js: callAjax(): url is undefined' );

		if ( !data ) data = { };
				
		if ( !method ) throw new Error( 'api.js: callAjax(): method is undefined' );				
			
		if ( !success ) success = message.success;
			
		if ( !error ) error = message.log;
			
		this.call( path, data, method, success, error );

	},

	callFree: function( path, data, method, success, error ) {

		var promise = $.ajax(
			{
		        type: method,
		        url: myUrl.apiUrl + path,
				//async: false,
				contentType: 'application/json',
		        processData: false,
		        data: JSON.stringify( data ),

				// Sebelum proses, tampilkan wait modal.
		        beforeSend: function ( jqXHR, settings )
				{
		            waitModal.show();
		        }
			}
			
		);

		// Otomatis parse object menjadi JSON. Dan eksekusi function.
		promise.done( function( result )
		{
			result = JSON.parse( result );
				
			if ( result.tipe == "ERROR" )
				message.logResult( result ); // LOG

			success( result );
				
		} );

		// Panggil error ketika terjadi kesalahan.
		promise.fail( error );
			  
		// Setelah proses selesai, sembunyikan wait modal.
		promise.always(function ( jqXHR, textStatus )
		{
		       waitModal.hide();
		} );
		
	},
	
	/*
	 * Proses login pegawai.
	 */
	login: function( _username, _password ) {

		var kredensi = {
			username: _username,
			password: _password
		};
		
		var promise = $.ajax(
		{
	        type: 'POST',
	        url: myUrl.apiUrl() + '/operator/login',
			
			contentType: 'application/json',
	        processData: false,
	        data: JSON.stringify( kredensi ),
		        
			beforeSend: function (jqXHR, settings)
			{
	            waitModal.show();
	        }
				
	    } );
			
		var success = function( result ) {

			//message.writeLog( "Parsing JSON" );
			//result = JSON.parse( result );
			
			if ( result.tipe == "OBJECT" ) {

				// Atur token baru, token menggunakan RestMessage
				operator.setOperator( result.object );

				message.write( "Berhasil Login!" );
				window.location.href = 'index.html';

			} else {

				message.write( result.message );

			}
		};

	    promise.done( success );
	    promise.fail( message.writeError );

		promise.always( function ( jqXHR, textStatus )
		{
	        waitModal.hide();
				
	    } );
			
	},

	/*
	 * Proses logout pegawai.
	 */
	logout: function ( ) {

		operator.reset();

		window.location.href = 'index.html';

	}

};

/*
 * Variabel yang menampung fugsi halaman berupa perpindahan halaman secara dinamis.
 * Memungkinkan implementasi SPA (Single Page Application).
 */
var page = {

	toUvs: function () {
		window.location.href = "https://uvs.web.id/";
	},
	
	/*
	 * Ganti isi element dengan file HTML yang di-load dari URL.
	 */
	load: function( element, url ) {
		
		var promise = $.ajax(
			{
				type: 'GET',
				url: url,
				async: false,
			} 
		);

		promise.done( function ( result ) {
		
			page.change( element, result );
			
		});
			
		promise.fail( message.error );
		
	},

	/*
	 * Ganti isi element dengan konten HTML yang sudah di-definisi-kan.
	 */
	change: function ( element, content ) {

		// Apply semua JS dan CSS setelah 'dynamic content' di setup.
		if ( element )
			element.html( content ).trigger( "create" );

	},

	/*
	 * Atur nama halaman.
	 * Secara otomatis mengubah judul halaman, jika pada halaman terdapat component header.
	 * id header = 'header-text'.
	 */
	setName: function ( pageName ) {
	
		localStorage.setItem( 'page', pageName );

		// Atur header halaman.
		// page.change( $( '#page-header' ), '/ ' + pageName.toUpperCase() );
		
	},

	/*
	 * Ambil nama halaman.
	 * Sama dengan 'current page'.
	 */
	getName: function () {

		var pageName = localStorage.getItem ( 'page' );

		if ( pageName == 'undefined' )
			return null;
			
		return pageName.toUpperCase();
	},

	/*
	 * Atur konten.
	 * Ganti konten, nama halaman, dan pilihan.
	 */
	setContent: function ( list, resource, pageName ) {
	
		this.change( $( '#content' ), resource.getContent ( list ) );
		this.change( $( '#option-panel' ), resource.getOption () );

		this.setName( pageName );
	},
		
	/*
	 * Fungsi untuk menghasilkan konten berupa list.
	 */
	content: {
			
		/*
		 * Fungsi create default.
		 * Membuat item dalam list.
		 * NOTE: KETIKA DISENTUH, BUKA DETAIL. ID DIAMBIL DARI ATRIBUT 'ID' PADA ELEMENT 'DIV'.
		 */
		create: function ( object ) {
				
			return '<li>' +
				'<div id="' + object.id + '">' +
				'<h4>'+ object.nama + '</h4>' +
				'</div>' +
				'</li>';
		},
			
		/*
		 * Fungsi untuk menghasilkan list view.
		 * NOTE: CARA BUAT LIST VIEW NANTI BACA LAGI DI JQUERY MOBILE
		 */
		generate: function ( list, todo ) {

			var html = '<div data-role="collapsible-set">';
			html += '<ul data-role="listview" data-inset="true">';
			        
			for ( var index = 0; index < list.length; index++ ) {
						
				var object = list[ index ];
					
				html += todo( object );
			}
			
			html += '</ul>';
			html += '</div>';	
			
			return html;
		},

		home: {

			set: function() {
					
				if ( operator.getRole() == "ADMIN" ) {
					
					home.load();
					
				} else {
					
					absen.reload();
					
				}
			}
		},
		
		navigation: {
			
			set: function() {

				var html = '';
				
				if ( operator.getRole() == "ADMIN" ) {
					
					html = page.content.navigation.getAdmin();
					
				} else {
					
					html = page.content.navigation.getPegawai();
					
				}
				
				page.change( $( '#nav-menu' ), html );
				
			},
			
			getAdmin: function() {
				
				return '<li class="divider"><hr /></li>' +
					'<li><a id="menu-skpd" href="#" data-toggle="tooltip" data-placement="right" title="Unit Kerja"><span class="glyphicon glyphicon-home big-icon"></span><b class="icon-text">Unit Kerja</b></a></li>' +
					'<li><a id="menu-kegiatan" href="#" data-toggle="tooltip" data-placement="right" title="Kegiatan"><span class="glyphicon glyphicon-user big-icon"></span><b class="icon-text">Kegiatan</b></a></li>' +
					'<li><a id="menu-operator" href="#" data-toggle="tooltip" data-placement="right" title="Operator"><span class="glyphicon glyphicon-briefcase big-icon"></span><b class="icon-text">Operator</b></a></li>';
				
			},
			
			getPegawai: function() {
				
				return '<li class="divider"><hr /></li>' +
					'<li><a id="menu-kegiatan" href="#" data-toggle="tooltip" data-placement="right" title="Kegiatan"><span class="glyphicon glyphicon-user big-icon"></span><b class="icon-text">Kegiatan</b></a></li>';
				
			}
		},
		
		menu: {
			
			set: function() {

				var html = '';
				
				if ( operator.getRole() == "ADMIN" ) {
					
					html = page.content.menu.getAdmin();
					
				} else {
					
					html = page.content.menu.getPegawai();
					
				}
				
				page.change( $( '#menu-nav' ), html );
				
			},
			
			getAdmin: function() {
				
				return '<li><a id="nav-skpd" href="#">Unit Kerja<span class="glyphicon glyphicon-user pull-right"></span></a></li>' +
					'<li><a id="nav-operator" href="#">Operator<span class="glyphicon glyphicon-briefcase pull-right"></span></a></li>' +
					'<li><a id="nav-kegiatan" href="#">Kegiatan<span class="glyphicon glyphicon-tasks pull-right"></span></a></li>';
			},
			
			getPegawai: function() {
				
				return '<li><a id="nav-kegiatan" href="#">Kegiatan<span class="glyphicon glyphicon-shopping-cart pull-right"></span></a></li>';

			}
		}
	},
	
	list: {

		/*
		 * Fungsi default untuk me-return hasil.
		 */
		get: function ( result ) {

			if ( result.tipe != 'LIST' && !result.list ) {
			
				message.writeLog( 'Returning empty list' );
				return [ ];
			}

			return result.list;

		},

		/*
		 * Generate HTML5 list dari list object.
		 */
		dataList: {

			generateFromStorage: function ( storageName, listName ) {

				var list = storage.get( storageName );

				return this.generateFromList( list, listName );
			},

			generateFromList: function ( list, listName ) {
				var html = '<datalist id="' + listName + '">';

				html += page.list.option.generate( list );
				html += '</datalist>';
				
				return html;
			}
		},

		/*
		 * Generate list for <select>
		 */
		selectionList: {

			generateFromStorage: function ( storageName, selectedName ) {

				var list = storage.get( storageName );

				return this.generateFromList( list, selectedName );
			},

			generateFromList: function ( list, selected ) {

				var html = '';
				
				if ( selected == '' ) {
					
					html += '<option value="" selected> - Pilih - </option>';
					html = page.list.option.generate ( list );
				} else {
					
					html = page.list.option.generateSelected (list, selected );
				}

				return html;
			}
		},
		
		/*
		 * Generate option for list component.
		 */
		option: {

			generateSelected: function ( list, selected ) {

				var html = '';
				
				if ( !list ) {
				
					for( var index = 0; index < list.length; index++ ) {

						var tmp = list[ index ];

						if ( tmp.nama == selected ) {

							html += '<option selected>' + tmp.nama + '</option>';
						} else {

							html += '<option>' + tmp.nama + '</option>';
						}
					}
				}
				
				return html;
			},
			
			generate: function ( list ) {

				var html = '';
				
				if ( list ) {

					for( var index = 0; index < list.length; index++ ) {

						var tmp = list[ index ];
						html += '<option>' + tmp.nama + '</option>';
					}
				}
				
				return html;
				
			},
			
			generateNip: function ( list ) {

				var html = '';
				
				if ( list ) {

					for( var index = 0; index < list.length; index++ ) {

						var tmp = list[ index ];
						html += '<option>' + tmp.nip + '</option>';
					}
				}
				
				return html;
				
			},
			
			generateFromStorage: function( storageName ) {
				
				var list = storage.get( storageName );
				
				return this.generate( list );
				
			}
		},
	},
};

var myDate = {

	//Months definiton
	month: {

		getName: function ( index ) {

			if ( index > 12 )
				index -= 12;
			
			if ( index < 1 )
				index += 12;

			switch ( index ) {
				case 1: return 'January'
				case 2: return 'February'
				case 3: return 'March'
				case 4: return 'April'
				case 5: return 'May'
				case 6: return 'June'
				case 7: return 'July'
				case 8: return 'August'
				case 9: return 'September'
				case 10: return 'October'
				case 11: return 'November'
				case 12: return 'December'
			}
		},
		
		getRealName: function ( name ) {
			
			name = name.toLowerCase ();
	        
			switch ( name ) {
	        	case 'januari': return 'Januari'
	            case 'februari': return 'Februari'
	            case 'maret': return 'Maret'
	            case 'april': return 'April'
	            case 'mei': return 'Mei'
	            case 'juni': return 'Juni'
	            case 'juli': return 'Juli'
	            case 'agustus': return 'Agustus'
	            case 'september': return 'September'
	            case 'oktober': return 'Oktober'
	            case 'november': return 'November'
	            case 'desember': return 'Desember'
			}
		},
		
		getIndex: function ( name ) {
		
			name = name.toLowerCase ();
	        
			switch ( name ) {
	        	case 'januari': return 1
	            case 'februari': return 2
	            case 'maret': return 3
	            case 'april': return 4
	            case 'mei': return 5
	            case 'juni': return 6
	            case 'juli': return 7
	            case 'agustus': return 8
	            case 'september': return 9
	            case 'oktober': return 10
	            case 'november': return 11
	            case 'desember': return 12
			}
		}
	},

	now: function() {
	
		return new Date();
		
	},
	
	nowString: function() {
	
		var date = this.fromDate( new Date() );
		
		return this.toString( date );
		
	},
	
	nowFormattedString: function() {
	
		var date = this.fromDate( new Date() );
		
		return this.toFormattedString( date );
		
	},
	
	getAwal: function() {
		var date = new Date();
		
		return '1-' + ( date.getMonth() + 1 ) + '-' + date.getFullYear(); // return tanggal awal bulan berjalan
	},
	
	getAwalDatePicker: function() {
		var date = this.fromString( this.getAwal() );
		
		return this.toDatePickerString( date );
	},
	
	getAwalFormatted: function() {
		var date = this.fromString( this.getAwal() );
		
		return this.toFormattedString( date );
	},
	
	getAkhir: function() {
		var date = new Date();
		date.setMonth( date.getMonth() + 1 );
		date.setDate( 0 );
		
		return date.getDate() + '-' + ( date.getMonth() + 1 ) + '-' + date.getFullYear(); // return tanggal akhir bulan berjalan
	},
	
	getAkhirDatePicker: function() {
		var date = this.fromString( this.getAkhir() );
		
		return this.toDatePickerString( date );
	},
	
	getAkhirFormatted: function() {
		var date = this.fromString( this.getAkhir() );
		
		return this.toFormattedString( date );
	},

	getTanggal: function() {
		
		var date = new Date();
		
		return date.getDate();
		
	},
	
	getBulan: function() {
		
		var date = new Date();
		
		return date.getMonth() + 1;
		
	},
	
	getTahun: function() {
		
		var date = new Date();
		
		return date.getFullYear();
		
	},

	split: function ( str ) {
		var delim;
		
		if ( str.indexOf ( "/" ) != -1 ) {

			delim = "/";
		} else if ( str.indexOf ( "-" ) != -1 ) {

			delim = "-";
		} else {

			delim = " ";
		}
		
		var complete = function ( x ) {
		
			if ( x.length < 2 )
				x = "0" + x;
			
			return x;
		};
		
		var splitted = str.split ( delim );
		splitted[ 0 ] = complete( splitted[ 0 ] );
		splitted[ 1 ] = complete( splitted[ 1 ] );
		splitted[ 2 ] = complete( splitted[ 2 ] );

		return splitted;
	},
	
	fromDate: function ( date ) {

		return {
			day: date.getDate(),
			month: date.getMonth() + 1,
			year: date.getFullYear()
		};
	},
	
	fromDatePicker: function ( date ) {

		var str = this.split( date );
		
		return {
			day: str[ 2 ],
			month: str[ 1 ],
			year: str[ 0 ]
		}
	},
	
	fromString: function(date) {

		var str = this.split( date );
		
		return {
			day: str[ 0 ],
			month: str[ 1 ],
			year: str[ 2 ]
		}
	},
	
	fromFormattedString: function ( date ) {
	
		var str = this.split( date );
		
		return {
			day: str[ 1 ],
			month: str[ 0 ],
			year: str[ 2 ]
		};
	},
	
	toString: function ( date ) {
	
		return date.day + "-" + date.month + "-" + date.year;
	},
	
	toFormattedString: function ( date ) {
	
		return date.month + "-" + date.day + "-" + date.year;
	},
	
	toDatePickerString: function ( date ) {
	
		return date.year + "-" + date.month + "-" + date.day;
	},

	isBefore: function ( object, comparer ) {
	
		var number = object.year + object.month + object.day;
		var comparerNumber = parseInt( comparer.year ) + parseInt( comparer.month ) + parseInt( comparer.day );

		return ( number < comparerNumber );
	},

	isAfter: function ( object, comparer ) {
	
		var number = object.year + object.month + object.day;
		var comparerNumber = parseInt( comparer.year ) + parseInt( comparer.month ) + parseInt( comparer.day );
		
		return ( number > comparerNumber );
	},

	formatDate: function ( unformattedDate ) {

		var tmp = this.fromDate( unformattedDate );
		
		return this.toFormattedString( tmp );
	},

	formatDatePicker: function ( unformattedDate ) {

		var tmp = this.fromDatePicker( unformattedDate );
		
		return this.toFormattedString( tmp );
	},
	
	createFirstDate: function( bulan, tahun ) {
	
		var indexBulan = this.month.getIndex( bulan );
		
		return {
			day: 1,
			month: indexBulan,
			year: tahun
		};
	},
	
	createLastDate: function( bulan, tahun ) {
	
		var indexBulan = this.month.getIndex( bulan );
		
		var date = new Date();
		date.setMonth( indexBulan );
		date.setDate( 0 );
		date.setFullYear( tahun );

		return {
			day: date.getDate(),
			month: indexBulan,
			year: tahun
		};
	}
	
};

var number = {

	/*
	 * Modifikasi angka menggunakan koma sebagai pemisah satuan.
	 */
	addCommas: function ( x ) {

		return x.toString().replace( /\B(?=(\d{3})+(?!\d))/g, "," );
	},

	/*
	 * Modifikasi angka dengan menghilangkan tanda koma.
	 */
	removeCommas: function ( x ) {

		return x.toString().replace( ",", "" );
	}
	
};

var storage = {

	set: function ( list, storageName ) {

		storageName = storageName.toLowerCase();

		message.writeLog("api.js: setStorage(): Storage " + storageName + " is set : " + ( list != null ) ); // LOG

		if ( list != null )
			list = JSON.stringify( list );

		localStorage.setItem( storageName, list );
	},

	get: function ( storageName ) {

		storageName = storageName.toLowerCase();

		var list = localStorage.getItem( storageName );
		
		message.writeLog( "api.js: getStorage(): List " + storageName + " is Ready : " + ( list != null ) ); // LOG
		
		if ( list != null )
			return JSON.parse( list );
		
		return [ ];
	},

	getByNama: function ( container, nama ) {
		
		var list = this.get( container.nama );
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];
			
				if ( nama == obj.nama )
					return obj;
			}
		}
		
		message.writeLog( "api.js: getByNama(): Returning null for nama " + nama + " from " + container.nama + " storage." ); // LOG
		
		return null;
	},

	getById: function ( container, id ) {

		var list = this.get( container.nama );
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];
				
				if ( id == obj.id )
					return obj;
			}
		}
		
		message.writeLog( "api.js: getById(): Returning null for id " + id + " from " + container.nama + " storage." ); // LOG
		
		return null;
	},

	getByKode: function ( container, kode ) {
		
		var list = this.get( container.nama );
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( kode == obj.kode )
					return obj;
			}
		}
		
		message.writeLog( "api.js: getByKode(): Returning null for kode " + kode + " from " + container.nama + " storage." ); // LOG
		
		return null;
	},

	getByNip: function ( container, nip ) {
		
		var list = this.get( container.nama );
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( nip == obj.nip )
					return obj;
			}
		}
		
		message.writeLog( "api.js: getByKode(): Returning null for nip " + nip + " from " + container.nama + " storage." ); // LOG
		
		return null;
	},

	getByUsername: function ( container, username ) {
		
		var list = this.get( container.nama );
		
		if ( list ) {

			for ( var index = 0; index < list.length; index++ ) {

				var obj = list[ index ];

				if ( username == obj.username )
					return obj;
			}
		}
		
		message.writeLog( "api.js: getByKode(): Returning null for username " + username + " from " + container.nama + " storage." ); // LOG
		
		return null;
	},

	reset: function () {

		this.fill ('SKPD');
		this.fill ('KEGIATAN');

	},

	fill: function ( storageName ) {

		var success = function( result ) {

			var list = null;
			
			if ( result.tipe == 'LIST' )
				list = result.list;
			
			storage.set( list, storageName );
		};

		var url = "/" + storageName.toLowerCase();
		
		rest.call( url, '', 'GET', success, message.empty );
	}
};

var printer = {

	submitPost: function( path, params, method ) {
	
		// Token menjadi pengganti password user.
		var _password = operator.getTokenString();
		var _username = operator.getUsername();
		var _credential = _username + ':' + _password + '@';
		
		method = method || "post"; // Method POST sebagai default.

		var form = document.createElement( "form" );
		form.setAttribute( "method", method );
		form.setAttribute( "action", myUrl.printUrl( _credential ) + path );

		for( var key in params ) {
		
			if ( params.hasOwnProperty( key ) ) {
			
				var hiddenField = document.createElement( "input" );
				hiddenField.setAttribute( "type" , "hidden" );
				hiddenField.setAttribute( "name", key );
				hiddenField.setAttribute( "value", params[ key ] );

				form.appendChild( hiddenField );
				
			 }
			 
		}

		document.body.appendChild( form );
		
		form.submit();
		
	}
	
};

/*
 * Pilih berdasarkan 2 pilihan.
 */
function choose( option1, option2 ) {

	if ( option1 )
		return option1;
	
	return copyOf( option2 );
	
};

function copyOf( object ) {

	return $.extend( {}, object );
	
};

var setupPage = function( list, container ) {

	if ( !list )
		list = [ ];
		
	page.setContent( list, container, container.nama );
	
};

var activeContainer;
var set = 20;
var tableSet = function( list, pageNumber) {

	// Jika list kosong, return default value.
	if ( list.length == 0 ) {
		
		return {
			first: 0,
			last: 0
		};
	}
		
	if ( !pageNumber )
		pageNumber = 1;
				
	pageNumber--;
	
	var first = pageNumber * set;
	var last = ( pageNumber * set ) + set;
	
	if ( last > list.length )
		last = list.length;
	
	return {
		first: first,
		last: last
	};

};
