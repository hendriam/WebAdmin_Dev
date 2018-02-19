<?php if (!defined('BASEPATH')) exit('No direct script access allowed');

class CSVReader {

    var $fields;/** columns names retrieved after parsing */
    var $separator = ';';/** separator used to explode each line */
    var $enclosure = '"';/** enclosure used to decorate each field */
    var $max_row_size = 4096;/** maximum row size to be used for decoding */

    function parse_file($p_Filepath) {

        $file = fopen($p_Filepath, 'r');
        $this->fields = fgetcsv($file, $this->max_row_size, $this->separator, $this->enclosure);
        $keys = str_getcsv($this->fields[0]);

        $i = 1;
        while (($row = fgetcsv($file, $this->max_row_size, $this->separator, $this->enclosure)) != false) {
            if ($row != null) { // skip empty lines
                $values = str_getcsv($row[0]);
                if (count($keys) == count($values)) {
                    $arr = array();
                    for ($j = 0; $j < count($keys); $j++) {
                        if ($keys[$j] != "") {
                            $arr[$keys[$j]] = $values[$j];
                        }
                    }

                    $content[$i] = $arr;
                    $i++;
                }
            }
        }
        fclose($file);
        return $content;
    }

    function csvToArray($file, $delimiter)
    {
        if (($handle = fopen($file, 'r')) !== FALSE) {
          $i = 0;
          while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
            for ($j = 0; $j < count($lineArray); $j++) {
              $arr[$i][$j] = $lineArray[$j];
            }
            $i++;
          }
          fclose($handle);
          }
        return $arr;
    }

    function csvToArrayBNI($file, $delimiter)
    {
        if (($handle = fopen($file, 'r')) !== FALSE) {
          $i = 0;
          while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
            for ($j = 0; $j < count($lineArray); $j++) {
              $arr[$i][$j] = $lineArray[$j];
            }
            $i++;
          }
          fclose($handle);
          }
        return $arr;
    }

    function csvToArrayBRI($file, $delimiter)
    {
      //$fp = file($file);
      //$numCount = count($fp);
      if (($handle = fopen($file, 'r')) !== FALSE) {
        $i = 0;
        while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
          $i++;
          for ($j = 0; $j < count($lineArray); $j++) {
            //if($i == $numCount-13) break;
            if (in_array('textbox102', $lineArray)) break;
            if (in_array('OPENING BALANCE', $lineArray)) break;
            if($i < 10) continue;
            $arr[$i][$j] = $lineArray[$j];
          }

        }
        fclose($handle);
        }
      return $arr;
    }

    // function csvToArrayBNI($file, $delimiter)
    // {
    //     $row = 0;
    //     if (($handle = fopen($file, 'r')) !== FALSE) {
    //         while (($data = fgetcsv($handle, 1000, $delimiter, '"')) !== FALSE) {
    //         $num = count($data);
    //         $row++;
    //         $datas = array();
    //         for ($c=0; $c < $num; $c++) {
    //             if ($row == 1) continue;
    //             $datas[$row][$c] = $data[$c];
    //             //$datas['time'] = $data[1];
    //             // $datas['remark'] = $data[2];
    //             // $datas['debet'] = $data[3];
    //             // $datas['credit'] = $data[4];
    //             // $datas['teller_id'] = $data[5];
    //             // $datas['tanggal'] = $data[6];
    //             // $datas['jam'] = $data[7];
    //             // $datas['keterangan'] = $data[8];
    //             // $datas['debet2'] = $data[9];
    //             // $datas['credit2'] = $data[10];
    //             //$datas['teller_id2'] = $data[11];
    //         }
    //     }
    //     fclose($handle);
    //     }
    //     return $datas;
    // }

    function toArrayMandiri($file, $delimiter)
    {
        if (($handle = fopen($file, 'r')) !== FALSE) {
            $i = 0;
            while (($lineArray = fgetcsv($handle, 4000, $delimiter, '"')) !== FALSE) {
              for ($j = 0; $j < count($lineArray); $j++) {
                $arr[$i][$j] = $lineArray[$j];
              }
              $i++;
            }
            fclose($handle);
        }
        return $arr;
    }

    // function extractMandiri($p_Filepath)
    // {
    //     // buka file
    //     $file = fopen($p_Filepath, 'r') or die("can't open file");
    //
    //     // baca file, jadikan array
    //     $fileArr = file($p_Filepath);
    //
    //     // hitung total
    //     $total = count($fileArr)+1;
    //     $no = 0;
    //     $count = 0;
    //     while($line = fgetcsv($fp,1024))
    //     {
    //         $count ++;
    //
    //         if($count == 1)
    //         {
    //             continue; // skip baris pertama
    //         }
    //
    //         for($i = 0, $i < count($line); $i++)
    //         {
    //             $insertCsv = array();
    //             $insertCsv['raw'] = $line[2].''.$line[3].''.$line[4].''.$line[5].''.$line[6].''.$line[7].''.$line[8];
    //
    //         }
    //         $no = $total - $count;
    //         $data = array(
    //             'raw' => $insertCsv['raw'],
    //         );
    //     }
    // }

}
?>
