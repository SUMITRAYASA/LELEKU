<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Illuminate\Support\Facades\Storage;

class KolamResource extends JsonResource
{
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'nama_kolam' => $this->nama_kolam,
            'gambar' => $this->gambar
                ? url(Storage::url($this->gambar))
                : null,
            'luas_kolam' => (float) $this->luas_kolam,
            'jumlah_ikan_tebar' => (int) $this->jumlah_ikan_tebar,
            'tanggal_tebar' => $this->tanggal_tebar?->format('Y-m-d'),
            'status' => $this->status,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}