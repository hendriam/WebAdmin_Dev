<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Mutasi extends CI_Controller{

  public $ca_id = "101inm";

  public function __construct()
  {
    parent::__construct();
    $this->load->library('form_validation');
    $this->load->model('mutasi_model');
    //$this->output->enable_profiler(TRUE);
    if($this->session->userdata('isLog') == FALSE)
    {
        $this->session->set_flashdata('need_login','Anda harus login terlebih dahulu.');
        redirect('login','refresh');
    }
  }

  public function index()
  {
      $data = $this->nodepath->getNodepath();
      $data['title']='Mutasi';
      $this->load->view('admin/layouts/header', $data);
      $this->load->view('admin/mutasi/csv_upload');
      $this->load->view('admin/layouts/footer');
  }

  public function do_upload()
  {

      $this->form_validation->set_rules('userfile', 'CSV file', 'callback_file_selected_test');
      $this->form_validation->set_rules('bank', 'Nama Bank', 'required');
      if($this->form_validation->run() == FALSE)
      {
          $data = $this->nodepath->getNodepath();
          $data['title']='Mutasi';
          $this->load->view('admin/layouts/header', $data);
          $this->load->view('admin/mutasi/csv_upload');
          $this->load->view('admin/layouts/footer');
      }
      else
      {
          $config['upload_path']          = './uploads/';
          $config['allowed_types']        = 'csv';
          $config['max_size']             = 100;
          $new_name                       = time().$_FILES["userfile"]['name'];
          $config['file_name']            = $new_name;

          $this->load->library('upload', $config);


          if (!$this->upload->do_upload('userfile'))
          {
              $error = $this->upload->display_errors();

              $this->session->set_flashdata('upload_failed', $error);
              redirect('mutasi', 'refresh');

          }
          else
          {
              $upload_data = $this->upload->data();
              $file_name = $upload_data['file_name'];
              $path = './uploads/';
              $file = $path.''.$file_name;

              // insert data
              if($dataArr = $this->getCsvMandiri($file) == 'failed')
              {
                  $this->session->set_flashdata('upload_failed', 'Gagal upload file');
                  redirect('mutasi', 'refresh');
              }
              else
              {
                  $this->session->set_flashdata('upload_success', 'Berhasil upload file');
                  redirect('mutasi', 'refresh');
              }

              // $_SESSION['read'] = $this->getCsvMandiri($file);
              // $this->session->mark_as_flash('read');
              //
              // $this->session->set_flashdata('upload_success', 'Berhasil diupload');
              // redirect('mutasi', 'refresh');
          }
      }
  }

  public function file_selected_test()
  {

      $this->form_validation->set_message('file_selected_test', 'File belum diinput..');
      if (empty($_FILES['userfile']['name'])) {
          return false;
      } else {
          return true;
      }
  }

  public function getCsvMandiri($file)
  {
      $this->load->library('CSVReader');
      $keys = array();
      $newArray = array();
      // Do it
      $data = $this->csvreader->csvToArray($file, ',');

      // Set number of elements (minus 1 because we shift off the first row)
      $count = count($data) - 1;

      // Use first row for names
      // Check and rename duplicate label
      $labels = array_shift($data);
      foreach ($labels as $k => $value) {
          if(in_array($value, $keys))
          {
              $keys[] = $value.'2';
          }
          else
          {
              $keys[] = $value;
          }

      }

      // Add Ids, just in case we want them later
      $keys[] = 'id';
      for ($i = 0; $i < $count; $i++) {
          $data[$i][] = $i;
      }

      // Bring it all together
      for ($j = 0; $j < $count; $j++) {
          $d = array_combine($keys, $data[$j]);
          $newArray[$j] = $d;
      }

      $dataArr =  $newArray;

      date_default_timezone_set('Asia/Jakarta');
      $now = date('Y-m-d H:i:s');

      $insert = array();
      $i = 0;
      foreach ($dataArr as $key) {
          $insert[$i]['raw'] = json_encode($dataArr[$i]);
          $insert[$i]['nama_bank'] = $this->input->post('bank', TRUE);
          $insert[$i]['no_rekening'] = $key['Account No'];
          $insert[$i]['tgl_create'] = $now;
          if($this->validateDate($key['Date'], "j/n/Y")) // format mandiri csv baru
          {
              $dateFormat = DateTime::createFromFormat("j/n/Y",$key['Date']);
              $insert[$i]['tgl_transfer'] = $dateFormat->format('Y-m-d');
          }
          else if($this->validateDate($key['Date'], 'd/m/y')) // format csv mandiri lama
          {
              $dateFormat = DateTime::createFromFormat("d/m/y",$key['Date']);
              $insert[$i]['tgl_transfer'] = $dateFormat->format('Y-m-d');
          }
          else
          {
              $this->session->set_flashdata('upload_failed', 'Format tanggal tidak diketahui');
              redirect('mutasi', 'refresh');
          }

          $insert[$i]['waktu_transfer'] = 'NULL';
          $insert[$i]['keterangan'] = $key['Description'].' '.$key['Description2'].' '.$key['Reference No.'];
          $insert[$i]['debit'] = str_replace(',','',$key['Debit']);
          $insert[$i]['kredit'] = str_replace(',','',$key['Credit']);
          $insert[$i]['status_id'] = '1'; // default -> proses
          $insert[$i]['ca_id'] = $this->ca_id;
          $insert[$i]['admin_id'] = $this->session->userdata('adminId');

          $i++;
      }

      $this->db->trans_start();
      foreach ($insert as $dataIns)
      {
          $this->mutasi_model->insertMutasi($dataIns);
      }
      $this->db->trans_complete();

      if ($this->db->trans_status() === FALSE)
      {
          $msg = 'failed';
          return $msg;
      }

  }

  function validateDate($date, $format)
  {
      $d = DateTime::createFromFormat($format, $date);
      return $d && $d->format($format) == $date;
  }

}
