using Microsoft.EntityFrameworkCore.Migrations;

namespace web_music_library.Migrations
{
    public partial class v8 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Artists_MusicLibraries_MusicLibraryId",
                table: "Artists");

            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_MusicLibraries_MusicLibraryId",
                table: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Artists_MusicLibraryId",
                table: "Artists");

            migrationBuilder.DropColumn(
                name: "MusicLibraryId",
                table: "Artists");

            migrationBuilder.AlterColumn<int>(
                name: "MusicLibraryId",
                table: "Playlists",
                type: "int",
                nullable: false,
                defaultValue: 0,
                oldClrType: typeof(int),
                oldType: "int",
                oldNullable: true);

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_MusicLibraries_MusicLibraryId",
                table: "Playlists",
                column: "MusicLibraryId",
                principalTable: "MusicLibraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_MusicLibraries_MusicLibraryId",
                table: "Playlists");

            migrationBuilder.AlterColumn<int>(
                name: "MusicLibraryId",
                table: "Playlists",
                type: "int",
                nullable: true,
                oldClrType: typeof(int),
                oldType: "int");

            migrationBuilder.AddColumn<int>(
                name: "MusicLibraryId",
                table: "Artists",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Artists_MusicLibraryId",
                table: "Artists",
                column: "MusicLibraryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Artists_MusicLibraries_MusicLibraryId",
                table: "Artists",
                column: "MusicLibraryId",
                principalTable: "MusicLibraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_MusicLibraries_MusicLibraryId",
                table: "Playlists",
                column: "MusicLibraryId",
                principalTable: "MusicLibraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }
    }
}
