'use strict'
var _route_loket       = 'loket';
var _route_laporan     = 'laporan';
var _route_saldo       = 'saldo';
var _route_admin       = 'admin';

var _cover_transaksi   = '#isi';

function getPageLoket(str){
  var routes = _route_loket + '/' + str;
  toLoadSecondPage(routes, _cover_transaksi, loketTable);
}

function getPageLaporan(str){
  var routes = _route_laporan + '/' + str;
  toLoadSecondPage(routes, _cover_transaksi, flatpickrActivation);
}

function getPageSaldo(str){
  var routes = _route_saldo + '/' + str;
  toLoadSecondPage(routes, _cover_transaksi, saldo_table);
}

function getPageAdmin(str){
  var routes = _route_admin + '/' + str;
  toLoadSecondPage(routes, _cover_transaksi, admin_page);
}

var saldo_table = function()
{
  loketSaldo();
  historyDeposit();
}

var admin_page = function()
{
  loadJenisAdmin();
  adminTable();
}

var ignore = function ()
{
  console.log('Page Changing');
}

var flatpickrActivation = function()
{
  $('.fromT').flatpickr();
  $('.toT').flatpickr();
  $('.tgl_isi').flatpickr();
}

var hideErrMsg = function()
{
    $('#alert_err').hide();
    $('#alert_scs').hide()
    $('#prov_err').hide();
    $('#kab_err').hide();
    $('#kodepos_err').hide();
    $('#saldo_err').hide();
    $('#group_err').hide();
    $('#group_scs').hide();
    $('#telp_err').hide();
    $('#pass_err').hide();
    $('#user_err').hide();
    $('#email_err').hide();
    $('#user_scs').hide();
    $('#nama_err').hide();
    $('#bukti_err').hide();
    $('#user_saldo_err').hide();
    $('#user_saldo_scs').hide();
    $('#user_admin_err').hide();
    $('#user_admin_scs').hide();
}

var resetFormLoketValue = function()
{
    $('#prov').val('');
    $('#kab').val('');
    $('#kodepos').val('');
    $('#saldo').val('');
    $('#group').val('');
    $('#telp').val('');
    $('#password').val('');
    $('#username').val('');
    $('#nama').val('');
    $('#alamat').val('');
    $('#email').val('');
}

var coomingSoon = function()
{
  $.alert('Coming Soon');
}

hideErrMsg();
//loadJenisAdmin();
flatpickrActivation();

// Active/Inactive menu
var ulContainer = document.getElementById("ulCon");

var aHref = ulContainer.getElementsByClassName("nav-link");

for (var i = 0; i < aHref.length; i++) {
  aHref[i].addEventListener("click", function() {
    var current = document.getElementsByClassName("active");
    current[0].className = current[0].className.replace(" active", "");
    this.className += " active";
  });
}

// var colModelData = function() {
//   $.ajax({
//      url: 'laporan/setColumn',
//      method:'GET',
//      success: function(data){
//         alert(data);
//      }
//   });
// }
