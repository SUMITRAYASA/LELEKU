<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Resources\KolamResource;
use App\Models\Kolam;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\Storage;

class KolamController extends Controller
{
    /**
     * Menampilkan seluruh data kolam.
     */


    public function index(Request $request)
    {
        $validated = $request->validate([
            'page' => 'sometimes|integer|min:1',
            'limit' => 'sometimes|integer|min:1|max:100',
            'keyword' => 'sometimes|nullable|string|max:100',
            'sort' => 'sometimes|in:terbaru,terlama,nama,luas',
        ]);

        $query = Kolam::query();

        // Pencarian berdasarkan nama kolam
        if (!empty($validated['keyword'])) {
            $query->where(
                'nama_kolam',
                'like',
                '%' . $validated['keyword'] . '%'
            );
        }

        // Sorting berdasarkan parameter frontend
        $sort = $validated['sort'] ?? 'terbaru';

        switch ($sort) {
            case 'terlama':
                $query->orderBy('tanggal_tebar', 'asc');
                break;

            case 'nama':
                $query->orderBy('nama_kolam', 'asc');
                break;

            case 'luas':
                $query->orderBy('luas_kolam', 'desc');
                break;

            default:
                $query->orderBy('tanggal_tebar', 'desc');
                break;
        }

        // Pengurutan sekunder agar hasil konsisten
        $query->orderBy('id', 'desc');

        // Pagination
        $limit = $validated['limit'] ?? 5;
        $page = $validated['page'] ?? 1;

        $kolam = $query->paginate(
            $limit,
            ['*'],
            'page',
            $page
        );

        $summary = Kolam::query()
        ->selectRaw('
            COUNT(*) as total_kolam,
            COALESCE(SUM(jumlah_ikan_tebar), 0) as total_ikan,
            COALESCE(SUM(luas_kolam), 0) as total_luas
        ')
        ->first();

        return KolamResource::collection($kolam)
            ->additional([
                'summary' => $summary,
            ]);
    }

    /**
     * Menambahkan data kolam baru.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nama_kolam' => 'required|string|max:100',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'luas_kolam' => 'required|numeric|min:0.01',
            'jumlah_ikan_tebar' => 'required|integer|min:0',
            'tanggal_tebar' => 'required|date',
            'status' => [
                'sometimes',
                'required',
                Rule::in(['aktif', 'panen', 'nonaktif']),
            ],
        ]);

        if ($request->hasFile('gambar')) {
            $validated['gambar'] = $request->file('gambar')
                ->store('kolam', 'public');
        }

        $kolam = Kolam::create($validated);

        return (new KolamResource($kolam))
            ->response()
            ->setStatusCode(201);
    }

    /**
     * Menampilkan detail satu kolam.
     */
    public function show(Kolam $kolam)
    {
        return new KolamResource($kolam);
    }

    /**
     * Memperbarui data kolam.
     */
    public function update(Request $request, Kolam $kolam)
    {
        $validated = $request->validate([
            'nama_kolam' => 'sometimes|required|string|max:100',
            'gambar' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'luas_kolam' => 'sometimes|required|numeric|min:0.01',
            'jumlah_ikan_tebar' => 'sometimes|required|integer|min:0',
            'status' => [
                'sometimes',
                'required',
                Rule::in(['aktif', 'panen', 'nonaktif']),
            ],
        ]);

        if ($request->hasFile('gambar')) {
            // Hapus gambar lama jika tersedia
            if ($kolam->gambar) {
                Storage::disk('public')->delete($kolam->gambar);
            }

            // Simpan gambar baru
            $validated['gambar'] = $request->file('gambar')
                ->store('kolam', 'public');
        }

        $kolam->update($validated);

        return new KolamResource($kolam->fresh());
    }

    /**
     * Menghapus data kolam.
     */
    public function destroy(Kolam $kolam)
    {
        if ($kolam->gambar) {
            Storage::disk('public')->delete($kolam->gambar);
        }

        $kolam->delete();

        return response()->json([
            'message' => 'Data kolam berhasil dihapus.',
        ]);
    }
}