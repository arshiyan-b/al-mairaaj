<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Support\Facades\DB;

return new class extends Migration
{
    public function up(): void
    {
        $tables = DB::select('SHOW TABLES');

        foreach ($tables as $table) {
            $tableName = array_values((array) $table)[0];

            // Skip Laravel migrations table
            if ($tableName === 'migrations') {
                continue;
            }

            // Check if id column exists
            $hasId = DB::select("
                SELECT COUNT(*) as count
                FROM information_schema.columns
                WHERE table_schema = DATABASE()
                AND table_name = ?
                AND column_name = 'id'
            ", [$tableName]);

            if ($hasId[0]->count == 0) {
                continue;
            }

            // Check whether id is already a primary key
            $primary = DB::select("
                SELECT COUNT(*) as count
                FROM information_schema.key_column_usage
                WHERE table_schema = DATABASE()
                AND table_name = ?
                AND constraint_name = 'PRIMARY'
                AND column_name = 'id'
            ", [$tableName]);

            if ($primary[0]->count > 0) {
                continue;
            }

            // Make id AUTO_INCREMENT and PRIMARY KEY
            DB::statement("
                ALTER TABLE `{$tableName}`
                MODIFY `id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
                ADD PRIMARY KEY (`id`)
            ");
        }
    }

    public function down(): void
    {
        // Do not automatically remove primary keys from every table.
    }
};