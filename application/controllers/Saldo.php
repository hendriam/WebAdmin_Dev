<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Saldo extends CI_Controller{

  public function __construct()
  {
    parent::__construct();
    $this->load->model('saldo_model');
    $this->load->helper('date_helper');
    $this->load->helper('global_helper');
    $this->load->library('datatables');
  }

  public function index()
  {
      $data['title']      = 'Menu Saldo';
      $data['submenu']    = 'saldo/menu_saldo';
      $data['contents']   = 'saldo/isi_saldo';
      $this->load->view('templates/app', $data);
  }

  public function isiSaldoPage()
  {
      $this->load->view('saldo/isi_saldo');
  }

  public function listSaldoPage()
  {
      $this->load->view('saldo/list_saldo');
  }

  public function listHistoryPage()
  {
      $this->load->view('saldo/list_history');
  }

  public function getSaldoJson()
  {
      //data user by JSON object
      header('Content-Type: application/json');
      echo $this->saldo_model->getTabelSaldo();
  }

  public function getHistoryJson()
  {
      //data user by JSON object
      header('Content-Type: application/json');
      echo $this->saldo_model->getHistoryDeposit();
  }

  public function setSaldoLoket()
  {

      $this->load->library('moneyFormat');
      $username = $this->input->post('user_saldo', TRUE);
      $nominal = $this->input->post('saldo', TRUE);

      //$username = 'juliojulio';
      //$nominal = '19000';

      $this->db->trans_start();
      $user_id = $this->saldo_model->getUserByUsername($username)->row()->id;
      $nama_loket = $this->saldo_model->getUserByUsername($username)->row()->nama_user;
      $this->saldo_model->updateSaldo($user_id, $nominal);

      // cek no kwintansi terakir
      if($this->saldo_model->getLastKwitansiNo() !== '')
      {
          $lastKwitansi = $this->saldo_model->getLastKwitansiNo(); // last full kwitansi number
          $datePart = substr($lastKwitansi,0,8); // get date part
          $idPart = substr($lastKwitansi, 8); // last id kwitansi number
          $nowIntDate = nowInt();
          // cek no kwitansi bulan ini
          if($datePart !== $nowIntDate) {
            $nextID = $nowIntDate.'00001';
          }
          else {
            $nextID = $nowIntDate.''.FormatNoTrans($idPart); // print 00002
          }
      }
      else
      {
          $nextID = $nowIntDate.'00001';
      }

      
      $print['no_kwitansi'] = $nextID;
      $print['username'] = $username;
      $print['nama_loket'] = $nama_loket;
      $print['nominal'] = $nominal;
      $print['terbilang'] = $this->moneyformat->terbilang($nominal);
      $print['tanggal'] = nowDate();

      $print_out = json_encode($print);

      $insertData = array(
        'user_id' => $user_id,
        'no_kwitansi' => $nextID,
        'nominal' => $nominal,
        'print_out' => $print_out,
        'admin_id' => $this->session->userdata('adminId'),
        'tgl_create' => now()
      );

      // insert to deposit langsung
      $this->saldo_model->insertDepositLangsung($insertData);

      $this->db->trans_complete();
      if ($this->db->trans_status() === FALSE)
      {
          $output['msg'] = 'failed';
          $output['print'] = '';

          echo json_encode($output);
      }
      else
      {
          $output['msg'] = 'success';
          $output['no_kwitansi'] = $nextID;
          $output['username'] = $username;
          $output['nama_loket'] = $nama_loket;
          $output['nominal'] = $nominal;
          $output['terbilang'] = $this->moneyformat->terbilang($nominal);
          $output['tanggal'] = nowDate();

          echo json_encode($output);
      }

  }

  public function getDeposit()
  {
      $no_kwitansi = $this->input->post('no_kwitansi', TRUE);
      if($this->saldo_model->getDepositByNoKwitansi($no_kwitansi) !== '')
      {
          echo $this->saldo_model->getDepositByNoKwitansi($no_kwitansi);
      }
  }

  // public function pdf()
	// {
  // 		$this->load->library('pdfgenerator');
  //
  // 		$data['users']=array(
  // 			array('firstname'=>'Agung','lastname'=>'Setiawan','email'=>'ag@setiawan.com'),
  // 			array('firstname'=>'Hauril','lastname'=>'Maulida Nisfar','email'=>'hm@setiawan.com'),
  // 			array('firstname'=>'Akhtar','lastname'=>'Setiawan','email'=>'akh@setiawan.com'),
  // 			array('firstname'=>'Gitarja','lastname'=>'Setiawan','email'=>'git@setiawan.com')
  // 		);
  //
	//     $html = $this->load->view('table_report', $data, true);
  //
	//     $this->pdfgenerator->generate($html,'contoh');
	// }

}
