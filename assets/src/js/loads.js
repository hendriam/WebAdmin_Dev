'use strict'

var toLoadSecondPage = function(routes, idOrClassName, callFunc) {
    $.ajax({
       url: routes,
       success: function(result){
          $(idOrClassName).html(result);
          hideErrMsg();
          callFunc();
       }
    });
    console.log(routes);
}

// =========================== call maskMOney =========================== //
var maskMoney = function() {
    $('#saldo_saldo').maskMoney({thousands:'.', decimal:',', precision:0});
    $('#saldo').maskMoney({thousands:'.', decimal:',', precision:0});
}

maskMoney();
// =========================== //call maskMoney =========================== //


// =========================== open isi Saldo Page =========================== //

var isGroupMaster = function(){
  var user_saldo = $('#user_saldo').val();
  var inUserSaldo = document.getElementById("user_saldo");
  getNamaLoket(user_saldo);
  if(user_saldo){
    $.ajax({
        type:'POST',
        url:base_url+'loket/is_group_master',
        data:'user='+user_saldo,
        success:function(html){
            if(html == 'suc'){
                inUserSaldo.classList.remove("is-invalid");
                inUserSaldo.classList.add("is-valid"); // username adalah group master
                $('#user_saldo_scs').show();
                $('#user_saldo_err').hide();
                document.getElementById("saldo_submit").disabled = false;
            }
            if(html == 'err'){
                inUserSaldo.classList.remove("is-valid");
                inUserSaldo.classList.add("is-invalid"); // username bukan group master
                $('#user_saldo_err').show();
                $('#user_saldo_scs').hide();
                document.getElementById("saldo_submit").disabled = true;
            }
        }
    });
  }
  else {
    inUserSaldo.classList.remove("is-invalid");
    inUserSaldo.classList.remove("is-valid");
    $('#user_saldo_scs').hide();
    $('#user_saldo_err').hide();
  }
}

var getNamaLoket = function (user) {
  if(user.length >= 8){
    $.ajax({
        type:'POST',
        url:base_url+'loket/get_loket_name',
        data:'user='+user,
        dataType:"json",
        success:function(html){
            $('#nama_saldo').val(html.nama);
        }
    });
  }
  else {
    $('#nama_saldo').val('');
  }
}

var reset = function() {
  document.getElementById("user_saldo").classList.remove("is-invalid");
  document.getElementById("user_saldo").classList.remove("is-valid");
  $('#user_saldo_scs').hide();
  $('#user_saldo_err').hide();
  $('#user_saldo').val('');
  $('#nama_saldo').val('');
  $('#saldo_saldo').val('');
  $('#bukti_saldo').val('');

  $('#nama_admin').val('');
  $('#user_admin').val('');
  $('#password_admin').val('');
  $('#jenis_admin').val('');
}

var resetSaldoForm = function (event){
    event.preventDefault();
    $.confirm({
      title: 'Confirm!',
      content: 'Reset Form ?',
      buttons: {
          confirm: function () {
            reset();
          },
          cancel: function () {
              $.alert('Reset dibatalkan');
          },
      }
  });
}

var isFormSaldoEmpty = function()
{
  var user = $('#user_saldo').val();
  var nama = $('#nama_saldo').val();
  var saldo = $('#saldo_saldo').val();
  var bukti = $('#bukti_saldo').val();
  if(user == "" || nama == "" || saldo == "" || bukti == ""){
    return false;
  }
  else {
    return true;
  }
}

var print = function(datas) {
  var bilangan = datas.nominal;
  var	reverse = bilangan.toString().split('').reverse().join(''),
      ribuan 	= reverse.match(/\d{1,3}/g);
      ribuan	= ribuan.join('.').split('').reverse().join('');

  var config = qz.configs.create("EPSON LX-300+ /II");

  var data = [
     '\x1B' + '\x61' + '\x31', // center align
     '\x1B' + '\x45' + '\x0D', // bold on
     'BUKTI DEPOSIT PT. INTERPRIMA NUSANTARA MANDIRI\n',
     '\x1B' + '\x61' + '\x30', // left align
     'No Kwitansi        : '+datas.no_kwitansi+'\n',
     'Tanggal            : '+datas.tanggal+'\n',
     'User Id            : '+datas.username+'\n',
     'Nama Loket         : '+datas.nama_loket+'\n',
     'Jumlah Setoran     : Rp. '+ribuan+'\n',
     'Terbilang          : '+datas.terbilang+'\n',
     '\x1B' + '\x61' + '\x31', // center align
     ' Penyetor                                          Diterima\n',
     '\x0A', //line break
     '\x0A', //line break
     '\x1B' + '\x61' + '\x31', // center align
     '(_________________)                               (_________________)\n',
     '\x1B' + '\x45' + '\x0A', // bold off
     '\x0A', //line break
     '\x0A' //line break
  ];

  qz.print(config, data).catch(function(e) { console.error(e); });
}

var submitSaldoForm = function(event){
  event.preventDefault();
  var saldo = $("#saldo_saldo").val();
  var formData = new FormData($('#saldo_form')[0]);
  formData.delete('saldo_saldo');
  formData.append('saldo', saldo.split('.').join(""));

  $.confirm({
      title: 'Confirm!',
      content: 'Submit data... ??',
      buttons: {
          confirm: function () {
            qz.websocket.disconnect(); // close qz tray
            if(isFormSaldoEmpty()){
              $.ajax({
                  url:base_url+'saldo/setSaldoLoket',
                  method:'POST',
                  data:formData,
                  contentType:false,
                  processData:false,
                  dataType:"json",
                  success:function(datas){
                      if(datas.msg == 'failed') {
                        $.alert(datas.print);
                      }
                      if(datas.msg == 'success') {
                        qz.websocket.connect().then(function() {
                          print(datas);
                          reset();
                        });
                      }
                  }
              });
            }
            else {
              $.alert('salah satu form belum diisi');
            }
          },
          cancel: function () {

          },
      }
  });
}

$( function() {
  auto_complete_saldo();
});
var auto_complete_saldo = function() {
  $( function() {
      $( "#user_saldo" ).autocomplete({
        source: base_url+'saldo/usernameList',
        appendTo: "#auto_con_div"
      });

  });
}



// =========================== close isi Saldo Page =========================== //

// =========================== open tabel Rekap Page =========================== //



// =========================== close tabel Rekap Page =========================== //


// =========================== open create loket Page =========================== //
var resetLoketForm = function (event){
    event.preventDefault();
    $.confirm({
      title: 'Confirm!',
      content: 'Reset Form ?',
      buttons: {
          confirm: function () {
              document.getElementById("group").classList.remove("is-invalid");
              document.getElementById("group").classList.remove("is-valid");
              document.getElementById("username").classList.remove("is-invalid");
              document.getElementById("username").classList.remove("is-valid");
              $('#group_scs').hide();
              $('#group_err').hide();
              $('#user_scs').hide();
              $('#user_err').hide();
              $('#nama').val('');
              $('#username').val('');
              $('#password').val('');
              $('#kodepos').val('');
              $('#telp').val('');
              $('#alamat').val('');
              $('#email').val('');
              $('#prov').val('');
              $('#kab').val('');
              $('#saldo').val('');
              $('#group').val('');
          },
          cancel: function () {
              $.alert('Reset dibatalkan');
          },
      }
  });
}

var isFormLoketEmpty = function()
{
  var name = $('#nama').val();
  var username = $('#username').val();
  var password = $('#password').val();
  var kodepos = $('#kodepos').val();
  var telp = $('#telp').val();
  var alamat = $('#alamat').val();
  var email = $('#email').val();
  var prov = $('#prov').val();
  var kab = $('#kab').val();
  if(name == "" || username == "" || password == "" || kodepos == "" || telp == "" || alamat == "" || email == "" || prov == "" || kab == ""){
    return false;
  }
  else {
    return true;
  }
}

$(document).ready(function(){

    $(document).on('submit', '#loket_form', function(event){
        event.preventDefault();
        var name = $('#nama').val();
        var saldoIn = $('#saldo').val();
        var formData = new FormData(this);
        formData.delete('saldo');
        formData.append('saldo', saldoIn.split('.').join(""));

        $.confirm({
            title: 'Confirm!, Yakin membuat Loket?',
            content: 'Submit data... ??',
            buttons: {
                confirm: {
                    text: 'Confirm',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function(){
                        if(isFormLoketEmpty()){
                           $.ajax({
                               url:base_url+'loket/createLoket',
                               method:'POST',
                               data:formData,
                               contentType:false,
                               processData:false,
                               dataType:"json",
                               success:function(html){
                                 if (html.msg == 'success'){
                                   $.alert('Berhasil membuat Loket');
                                   resetFormLoketValue();
                                   hideErrMsg();
                                 }
                                 else if (html.msg == 'failed') {
                                   $.alert('Gagal membuat Loket');
                                 }
                                 else {
                                   $.alert(html.msg);

                                 }
                               }
                           });
                        }
                       else {
                           $.alert('ada form yang belum diisi');
                       }
                    }
                },
                cancel: function () {
                },
            }
        });

    });



    $('#kodepos').on('change',function(){
        var kodepos = $(this).val();
        if(kodepos){
            $.ajax({
                type:'POST',
                url:base_url+'loket/search',
                data:'kodepos='+kodepos,
                dataType:"json",
                success:function(html){
                    $('#kab').val(html.kabupaten);
                    $('#prov').val(html.provinsi);
                }
            });
        }
        else {
            $('#kab').val('');
            $('#prov').val('');
        }
    });

    $('#group').on('change',function(){
        var group = $(this).val();
        var inpGrp = document.getElementById("group");
        if(group){
            $.ajax({
                type:'POST',
                url:base_url+'loket/username_exists',
                data:'user='+group,
                success:function(html){
                    if(html === 'suc'){
                        inpGrp.classList.add("is-valid");
                        $('#group_err').hide();
                        $('#group_scs').show();
                    }
                    else {
                        inpGrp.classList.add("is-invalid");
                        $('#group_scs').hide();
                        $('#group_err').show();
                    }
                }
            });
        }
        else {
            $('#group_scs').hide();
            $('#group_err').hide();
        }
    });

    $('#username').on('change',function(){
        var username = $(this).val();
        var inUser = document.getElementById("username");
        if(username){
            $.ajax({
                type:'POST',
                url:base_url+'loket/username_exists',
                data:'user='+username,
                success:function(html){
                    if(html === 'suc'){
                        inUser.classList.remove("is-valid");
                        inUser.classList.add("is-invalid"); // username sudah terdaftar
                        $('#user_scs').hide();
                        $('#user_err').show();
                    }
                    else{
                        inUser.classList.remove("is-invalid");
                        inUser.classList.add("is-valid"); // username boleh digunakan
                        $('#user_err').hide();
                        $('#user_scs').show();
                    }
                }
            });
        }
        else {
            $('#user_scs').hide();
            $('#user_err').hide();
        }
    });


});

// =========================== close create loket Page =========================== //


// =========================== open create Admin Page ============================ //

var loadJenisAdmin = function()
{
  $.ajax({
      url:base_url+'admin/setJenisAdminOption',
      method:'GET',
      success:function(html){
        $("#jenis_admin").append(html);
      }
  });
}

// load function
$("#create_admin").ready(function()
{
  loadJenisAdmin();

  $('#user_admin').on('change',function(){
    var username = $(this).val();
    if(username.length >= 5)
    {
      $.ajax({
          type:'POST',
          url:base_url+'admin/useradmin_exists',
          data:'username='+username,
          success:function(html){
              if(html === 'suc'){
                  document.getElementById("user_admin").classList.remove("is-valid");
                  document.getElementById("user_admin").classList.add("is-invalid"); // username sudah terdaftar
                  $('#user_admin_scs').hide();
                  $('#user_admin_err').show();
              }
              else{
                  document.getElementById("user_admin").classList.remove("is-invalid");
                  document.getElementById("user_admin").classList.add("is-valid"); // username boleh digunakan
                  $('#user_admin_err').hide();
                  $('#user_admin_scs').show();
              }
          }
      });
    }
  });


});

var isFormAdminEmpty = function()
{
  var name = $('#nama_admin').val();
  var username = $('#user_admin').val();
  var password = $('#password_admin').val();
  var jenis = $('#jenis_admin').val();

  if(name == "" || username == "" || password == "" || jenis == ""){
    return false;
  }
  else {
    return true;
  }
}

var submitAdminForm = function(event){
  event.preventDefault();
  var formData = new FormData($('#admin_form')[0]);

  $.confirm({
      title: 'Confirm!',
      content: 'Submit data... ??',
      buttons: {
          confirm: function () {
            if(isFormAdminEmpty()){
              $.ajax({
                  url:base_url+'admin/setAdmin',
                  method:'POST',
                  data:formData,
                  contentType:false,
                  processData:false,
                  dataType:"json",
                  success:function(datas){
                      if(datas.msg == 'failed') {
                        $.alert('Gagal Mendaftar Admin');
                      }
                      if(datas.msg == 'success') {
                        $.alert('Sukses Mendaftar Admin');
                        resetAdminF();
                      }
                  }
              });
            }
            else {
              $.alert('salah satu form belum diisi');
            }
          },
          cancel: function () {

          },
      }
  });
}

var resetAdminF = function() {
  document.getElementById("user_admin").classList.remove("is-invalid");
  document.getElementById("user_admin").classList.remove("is-valid");
  $('#user_admin_scs').hide();
  $('#user_admin_err').hide();
  $('#nama_admin').val('');
  $('#user_admin').val('');
  $('#password_admin').val('');
  $('#jenis_admin').val('');
}

var resetAdminForm = function (event){
    event.preventDefault();
    $.confirm({
      title: 'Confirm!',
      content: 'Reset Form ?',
      buttons: {
          confirm: function () {
              resetAdminF();
          },
          cancel: function () {
              $.alert('Reset dibatalkan');
          },
      }
  });
}
// =========================== close create Admin Page =========================== //
