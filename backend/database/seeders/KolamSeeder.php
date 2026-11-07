<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class KolamSeeder extends Seeder
{
    public function run(): void
    {
        $dataKolam = [
            [
                'nama_kolam' => 'Kolam A1',
                'gambar' => null,
                'luas_kolam' => 25.50,
                'jumlah_ikan_tebar' => 1000,
                'tanggal_tebar' => '2026-11-01',
                'status' => 'aktif',
            ],
            [
                'nama_kolam' => 'Kolam A2',
                'gambar' => null,
                'luas_kolam' => 30.00,
                'jumlah_ikan_tebar' => 1200,
                'tanggal_tebar' => '2026-11-02',
                'status' => 'aktif',
            ],
            [
                'nama_kolam' => 'Kolam B1',
                'gambar' => null,
                'luas_kolam' => 20.00,
                'jumlah_ikan_tebar' => 800,
                'tanggal_tebar' => '2026-11-03',
                'status' => 'aktif',
            ],
        ];

        foreach ($dataKolam as $kolam) {
            DB::table('kolam')->updateOrInsert(
                ['nama_kolam' => $kolam['nama_kolam']],
                $kolam
            );
        }
    }
}