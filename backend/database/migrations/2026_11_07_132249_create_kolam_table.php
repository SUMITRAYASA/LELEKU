<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        if (!Schema::hasTable('kolam')) {
            Schema::create('kolam', function (Blueprint $table) {
                $table->id();
                $table->string('nama_kolam', 100);
                $table->string('gambar', 255)->nullable();
                $table->decimal('luas_kolam', 10, 2);
                $table->unsignedInteger('jumlah_ikan_tebar');
                $table->date('tanggal_tebar');

                $table->enum('status', [
                    'aktif',
                    'panen',
                    'nonaktif'
                ])->nullable()->default('aktif');

                $table->timestamp('created_at')
                    ->nullable()
                    ->useCurrent();

                $table->timestamp('updated_at')
                    ->nullable()
                    ->useCurrent()
                    ->useCurrentOnUpdate();
            });
        }
    }

    public function down(): void
    {
        Schema::dropIfExists('kolam');
    }
};