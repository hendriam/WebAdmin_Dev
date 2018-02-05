'use strict'
var format = function (d) {
    // `d` is the original data object for the row
    return '<table cellpadding="5" class="table-striped" cellspacing="0" border="0" style="padding-left:50px;">'+
        '<tr>'+
            '<td>Nama Loket:</td>'+
            '<td>'+d.nama+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>No Telp:</td>'+
            '<td>'+d.no_telp+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Alamat:</td>'+
            '<td>'+d.alamat+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Kabupaten:</td>'+
            '<td>'+d.kab+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Provinsi:</td>'+
            '<td>'+d.prov+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>IP Adrress:</td>'+
            '<td>'+d.ip_address+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Mac Adress:</td>'+
            '<td>'+d.mac_address+'</td>'+
        '</tr>'+
        '<tr>'+
            '<td>Tanggal Daftar:</td>'+
            '<td>'+d.tgl_create+'</td>'+
        '</tr>'+
    '</table>';
}

var loketTable = function () {
  maskMoney();
  $(document).ready(function(){
        // Setup datatables
        $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
      {
          return {
              "iStart": oSettings._iDisplayStart,
              "iEnd": oSettings.fnDisplayEnd(),
              "iLength": oSettings._iDisplayLength,
              "iTotal": oSettings.fnRecordsTotal(),
              "iFilteredTotal": oSettings.fnRecordsDisplay(),
              "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
              "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
          };
      };

      var table = $("#tabelLoket").DataTable({
          "dom": 'Zlfrtip',
          initComplete: function() {
              var api = this.api();
              $('#tabelLoket_filter input')
                  .off('.DT')
                  .on('input.DT', function() {
                      api.search(this.value).draw();
              });
          },
              oLanguage: {
                "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Indonesian.json",
              sProcessing: "loading..."
          },
              processing: true,
              serverSide: true,
              ajax: {"url": base_url+"loket/getUserJson", "type": "POST"},
                columns: [
                      {
                        "data": "icon",
                        "className":"details-control"
                      },
                      {"data": "nama_user"},
                      {"data": "username"},
                      {"data": "group_id"},
                      {"data": "level"},
                      {"data": "no_telp"},
                      // {"data": "jumlah_saldo", render: $.fn.dataTable.render.number(',', '.', '')},
                      {"data": "nama_status"},
                      {"data": "view"}
                ],
                order: [[1, 'asc']],
                rowCallback: function(row, data, iDisplayIndex) {
                    var info = this.fnPagingInfo();
                    var page = info.iPage;
                    var length = info.iLength;
                    $('td:eq(0)', row).html();
                }

      });

        $('#tabelLoket tbody').on('click', 'td.details-control', function () {
            var tr = $(this).closest('tr');
            var tdi = tr.find("i.fa");
            var row = table.row(tr);

            if (row.child.isShown()) {
                // This row is already open - close it
                row.child.hide();
                tr.removeClass('shown');
                tdi.first().removeClass('fa-minus-square');
                tdi.first().addClass('fa-plus-square');
            }
            else {
                var username = row.data().username;
                if(username){
                    $.ajax({
                        type:'POST',
                        url:base_url+'loket/infoExtra',
                        data:'username='+username,
                        dataType:'json',
                        success:function(res){
                          row.child(format(res)).show();
                          //console.log(res.nama);
                          tr.addClass('shown');
                          tdi.first().removeClass('fa-plus-square');
                          tdi.first().addClass('fa-minus-square');
                        }
                    });
                }
            }
        });

        // end setup datatables

        // reset mac
        $('#tabelLoket').on('click','.resetMac',function(){
            var username=$(this).data('username');
            $.confirm({
                title: 'Confirm!, Reset Mac Address',
                content: username,
                buttons: {
                    confirm: {
                        text: 'Confirm',
                        btnClass: 'btn-blue',
                        keys: ['enter', 'shift'],
                        action: function(){
                            if(username){
                              $.ajax({
                                  type:'POST',
                                  url:base_url+'loket/reset_mac',
                                  data:'username='+username,
                                  success:function(res){
                                    $.alert('Mac Adrress <b>'+username+'</b> telah dikosongkan');
                                    $('#tabelLoket').DataTable().ajax.reload();
                                  }
                              });
                            }
                        }
                    },
                    cancel: function () {
                    },
                }
            });
        });


        // block loket
        $('#tabelLoket').on('click','.block',function(){
          var username=$(this).data('username');
          $.confirm({
              title: 'Confirm!, Block Loket',
              content: username,
              buttons: {
                  confirm: {
                      text: 'Confirm',
                      btnClass: 'btn-blue',
                      keys: ['enter', 'shift'],
                      action: function(){
                          if(username){
                            $.ajax({
                                type:'POST',
                                url:base_url+'loket/block',
                                data:'username='+username,
                                success:function(res){
                                  $.alert('Akun <b>'+username+'</b> telah diblock');
                                  $('#tabelLoket').DataTable().ajax.reload();
                                }
                            });
                          }
                      }
                  },
                  cancel: function () {
                  },
              }
          });
        });


        // unblock Loket
        $('#tabelLoket').on('click','.unblock',function(){
          var username=$(this).data('username');
          $.confirm({
              title: 'Confirm!, Aktifkan Loket',
              content: username,
              buttons: {
                  confirm: {
                      text: 'Confirm',
                      btnClass: 'btn-blue',
                      keys: ['enter', 'shift'],
                      action: function(){
                          if(username){
                            $.ajax({
                                type:'POST',
                                url:base_url+'loket/unblock',
                                data:'username='+username,
                                success:function(res){
                                  $.alert('Akun <b>'+username+'</b> telah diaktifkan');
                                  $('#tabelLoket').DataTable().ajax.reload();
                                }
                            });
                          }
                      }
                  },
                  cancel: function () {
                  },
              }
          });
        });


        // reset password
        $('#tabelLoket').on('click','.resetPass',function(){
          var username=$(this).data('username');
          $.confirm({
              title: 'Confirm!, Reset Password',
              content: username,
              buttons: {
                  confirm: {
                      text: 'Confirm',
                      btnClass: 'btn-blue',
                      keys: ['enter', 'shift'],
                      action: function(){
                          if(username){
                            $.ajax({
                                type:'POST',
                                url:base_url+'loket/reset_pass',
                                data:'username='+username,
                                success:function(res){
                                  $.alert('Password <b>'+username+'</b> telah direset menjadi 123456');
                                  $('#tabelLoket').DataTable().ajax.reload();
                                }
                            });
                          }
                      }
                  },
                  cancel: function () {
                  },
              }
          });
        });

    });
}

var loketSaldo = function () {
  maskMoney(); // load maskMoney Format
  $(document).ready(function(){
        // Setup datatables
        $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
      {
          return {
              "iStart": oSettings._iDisplayStart,
              "iEnd": oSettings.fnDisplayEnd(),
              "iLength": oSettings._iDisplayLength,
              "iTotal": oSettings.fnRecordsTotal(),
              "iFilteredTotal": oSettings.fnRecordsDisplay(),
              "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
              "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
          };
      };

      var table = $("#tabelSaldo").DataTable({
          "dom": 'Zlfrtip',
          initComplete: function() {
              var api = this.api();
              $('#tabelSaldo_filter input')
                  .off('.DT')
                  .on('input.DT', function() {
                      api.search(this.value).draw();
              });
          },
              oLanguage: {
                "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Indonesian.json",
              sProcessing: "loading..."
          },
              processing: true,
              serverSide: true,
              ajax: {"url": base_url+"saldo/getSaldoJson", "type": "POST"},
                columns: [
                      {"data": "nama_user"},
                      {"data": "username"},
                      {"data": "group_id"},
                      {"data": "jumlah_saldo", render: $.fn.dataTable.render.number(',', '.', '')}
                ],
                order: [[1, 'asc']],
                rowCallback: function(row, data, iDisplayIndex) {
                    var info = this.fnPagingInfo();
                    var page = info.iPage;
                    var length = info.iLength;
                    $('td:eq(0)', row).html();
                }

      });
    });
}

var historyDeposit = function() {
  $(document).ready(function(){
        // Setup datatables
        $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
      {
          return {
              "iStart": oSettings._iDisplayStart,
              "iEnd": oSettings.fnDisplayEnd(),
              "iLength": oSettings._iDisplayLength,
              "iTotal": oSettings.fnRecordsTotal(),
              "iFilteredTotal": oSettings.fnRecordsDisplay(),
              "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
              "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
          };
      };

      var table = $("#tabelHistoryDeposit").DataTable({
          "dom": 'Zlfrtip',
          initComplete: function() {
              var api = this.api();
              $('#tabelHistoryDeposit_filter input')
                  .off('.DT')
                  .on('input.DT', function() {
                      api.search(this.value).draw();
              });
          },
              oLanguage: {
                "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Indonesian.json",
              sProcessing: "loading..."
          },
              processing: true,
              serverSide: true,
              ajax: {"url": base_url+"saldo/getHistoryJson", "type": "POST"},
                columns: [
                      {"data": "no_kwitansi"},
                      {"data": "nama_user"},
                      {"data": "username"},
                      {"data": "nominal", render: $.fn.dataTable.render.number(',', '.', '')},
                      {"data": "tgl"},
                      {"data": "view"},
                ],
                order: [[4, 'desc']],
                rowCallback: function(row, data, iDisplayIndex) {
                    var info = this.fnPagingInfo();
                    var page = info.iPage;
                    var length = info.iLength;
                    $('td:eq(0)', row).html();
                }

      });

      $('#tabelHistoryDeposit').on('click','.print',function(){
        var id = $(this).data('id');
        var no_kwitansi = $(this).data('no_kwitansi');
        $.confirm({
            title: 'Print Ulang',
            content: 'No Kwitansi : '+no_kwitansi,
            buttons: {
                confirm: function () {
                  qz.websocket.disconnect();
                  if(no_kwitansi){
                    $.ajax({
                        url:base_url+'saldo/getDeposit',
                        method:'POST',
                        data:'no_kwitansi='+no_kwitansi,
                        dataType:"json",
                        success:function(datas){
                          if(datas !== '')
                          {
                            qz.websocket.connect().then(function() {
                              print(datas);
                            });
                          }
                        }
                    });
                  }
                },
                cancel: function () {
                },
            }
        });
      });
    });
}

// table admin
var adminTable = function () {
  maskMoney(); // load maskMoney Format
  $(document).ready(function(){
        // Setup datatables
        $.fn.dataTableExt.oApi.fnPagingInfo = function(oSettings)
      {
          return {
              "iStart": oSettings._iDisplayStart,
              "iEnd": oSettings.fnDisplayEnd(),
              "iLength": oSettings._iDisplayLength,
              "iTotal": oSettings.fnRecordsTotal(),
              "iFilteredTotal": oSettings.fnRecordsDisplay(),
              "iPage": Math.ceil(oSettings._iDisplayStart / oSettings._iDisplayLength),
              "iTotalPages": Math.ceil(oSettings.fnRecordsDisplay() / oSettings._iDisplayLength)
          };
      };

      var table = $("#tabelAdmin").DataTable({
          "dom": 'Zlfrtip',
          initComplete: function() {
              var api = this.api();
              $('#tabelAdmin_filter input')
                  .off('.DT')
                  .on('input.DT', function() {
                      api.search(this.value).draw();
              });
          },
              oLanguage: {
                "sUrl": "//cdn.datatables.net/plug-ins/9dcbecd42ad/i18n/Indonesian.json",
              sProcessing: "loading..."
          },
              processing: true,
              serverSide: true,
              ajax: {"url": base_url+"admin/getAdminJson", "type": "POST"},
                columns: [
                      {"data": "username"},
                      {"data": "nama_admin"},
                      {"data": "nama_jenis"},
                      {"data": "mac_address"},
                      {"data": "nama_status"},
                      {"data": "view"},
                ],
                order: [[0, 'asc']],
                rowCallback: function(row, data, iDisplayIndex) {
                    var info = this.fnPagingInfo();
                    var page = info.iPage;
                    var length = info.iLength;
                    $('td:eq(0)', row).html();
                }

      });

      // reset mac
      $('#tabelAdmin').on('click','.resetAdminMac',function(){
          var username=$(this).data('username');
          $.confirm({
              title: 'Confirm!, Reset Mac Address',
              content: username,
              buttons: {
                  confirm: {
                      text: 'Confirm',
                      btnClass: 'btn-blue',
                      keys: ['enter', 'shift'],
                      action: function(){
                          if(username){
                            $.ajax({
                                type:'POST',
                                url:base_url+'admin/reset_mac',
                                data:'username='+username,
                                success:function(res){
                                  $.alert('Mac Adrress <b>'+username+'</b> telah direset');
                                  $('#tabelAdmin').DataTable().ajax.reload();
                                }
                            });
                          }
                      }
                  },
                  cancel: function () {
                  },
              }
          });
      });


      // block loket
      $('#tabelAdmin').on('click','.blockAdmin',function(){
        var username=$(this).data('username');
        $.confirm({
            title: 'Confirm!, Block Admin',
            content: username,
            buttons: {
                confirm: {
                    text: 'Confirm',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function(){
                        if(username){
                          $.ajax({
                              type:'POST',
                              url:base_url+'admin/block',
                              data:'username='+username,
                              success:function(res){
                                $.alert('Akun <b>'+username+'</b> telah diblock');
                                $('#tabelAdmin').DataTable().ajax.reload();
                              }
                          });
                        }
                    }
                },
                cancel: function () {
                },
            }
        });
      });


      // unblock Loket
      $('#tabelAdmin').on('click','.unblockAdmin',function(){
        var username=$(this).data('username');
        $.confirm({
            title: 'Confirm!, Aktifkan Loket',
            content: username,
            buttons: {
                confirm: {
                    text: 'Confirm',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function(){
                        if(username){
                          $.ajax({
                              type:'POST',
                              url:base_url+'admin/unblock',
                              data:'username='+username,
                              success:function(res){
                                $.alert('Akun <b>'+username+'</b> telah diaktifkan');
                                $('#tabelAdmin').DataTable().ajax.reload();
                              }
                          });
                        }
                    }
                },
                cancel: function () {
                },
            }
        });
      });


      // reset password
      $('#tabelAdmin').on('click','.resetAdminPass',function(){
        var username=$(this).data('username');
        $.confirm({
            title: 'Confirm!, Reset Password',
            content: username,
            buttons: {
                confirm: {
                    text: 'Confirm',
                    btnClass: 'btn-blue',
                    keys: ['enter', 'shift'],
                    action: function(){
                        if(username){
                          $.ajax({
                              type:'POST',
                              url:base_url+'admin/reset_pass',
                              data:'username='+username,
                              success:function(res){
                                $.alert('Password <b>'+username+'</b> telah direset menjadi 12345');
                                $('#tabelAdmin').DataTable().ajax.reload();
                              }
                          });
                        }
                    }
                },
                cancel: function () {
                },
            }
        });
      });

    });
}
