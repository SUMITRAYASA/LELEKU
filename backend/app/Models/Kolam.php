<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Kolam extends Model
{
    protected $table = 'kolam';

    protected $primaryKey = 'id';

    protected $fillable = [
        'nama_kolam',
        'gambar',
        'luas_kolam',
        'jumlah_ikan_tebar',
        'tanggal_tebar',
        'status',
    ];

    protected $casts = [
        'luas_kolam' => 'decimal:2',
        'jumlah_ikan_tebar' => 'integer',
        'tanggal_tebar' => 'date',
    ];
}