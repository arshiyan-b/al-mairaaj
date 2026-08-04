<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Str;

return new class extends Migration
{
    public function up(): void
    {
        $tables = DB::select("
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
        ");

        foreach ($tables as $table) {
            $tableName = $table->table_name;

            // Skip Laravel migration table
            if ($tableName === 'migrations') {
                continue;
            }

            // Skip tables without an id column
            if (!Schema::hasColumn($tableName, 'id')) {
                continue;
            }

            // Skip if uuid already exists
            if (Schema::hasColumn($tableName, 'uuid')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) {
                $table->uuid('uuid')->nullable()->after('id');
            });

            // Give every existing row its own UUID
            $rows = DB::table($tableName)->select('id')->get();

            foreach ($rows as $row) {
                DB::table($tableName)
                    ->where('id', $row->id)
                    ->update([
                        'uuid' => (string) Str::uuid(),
                    ]);
            }

            // Make it unique
            Schema::table($tableName, function (Blueprint $table) {
                $table->unique('uuid');
            });
        }
    }

    public function down(): void
    {
        $tables = DB::select("
            SELECT table_name
            FROM information_schema.tables
            WHERE table_schema = DATABASE()
        ");

        foreach ($tables as $table) {
            $tableName = $table->table_name;

            if ($tableName === 'migrations') {
                continue;
            }

            if (!Schema::hasColumn($tableName, 'uuid')) {
                continue;
            }

            Schema::table($tableName, function (Blueprint $table) use ($tableName) {
                $table->dropUnique($tableName . '_uuid_unique');
                $table->dropColumn('uuid');
            });
        }
    }
};