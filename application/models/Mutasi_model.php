<?php
defined('BASEPATH') OR exit('No direct script access allowed');

class Mutasi_model extends CI_Model{

  public function __construct()
  {
    parent::__construct();
    $this->load->database();
  }

  // show all mutasi
  // status mutasi
  // proses = 1
  // sukses = 2
  public function getAllMutasiProses()
  {
      return $this->db->get_where('temp_mutasi_bank', array('status_id' => '1'));
  }

  // insert mutasi
  // isi array $data (raw, nama_bank, no_rekening, tgl_create, tgl_transfer, waktu_transfer, keterangan, debit, kredit, status_id = 1, ca_id, admin_id)
  public function insertMutasi($data)
  {
      // $this->db->insert_batch('temp_mutasi_bank', $data);
      $insert_query = $this->db->insert_string('temp_mutasi_bank', $data);
	  $insert_query = str_replace('INSERT INTO','INSERT IGNORE INTO', $insert_query);
	  $this->db->query($insert_query);
      return true;
  }

  // update mutasi
  // ubah status mutasi menjadi sukses = 2
  public function updateStatusMutasi($id)
  {
      $this->db->set('status_id', '2');
      $this->db->where('id', $id);
      $this->db->update('temp_mutasi_bank');
      return true;
  }

}
