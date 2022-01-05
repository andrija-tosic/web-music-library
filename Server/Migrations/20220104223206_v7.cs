using Microsoft.EntityFrameworkCore.Migrations;

namespace web_music_library.Migrations
{
    public partial class v7 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "MusicLibraryId",
                table: "Playlists",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_MusicLibraryId",
                table: "Playlists",
                column: "MusicLibraryId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_MusicLibraries_MusicLibraryId",
                table: "Playlists",
                column: "MusicLibraryId",
                principalTable: "MusicLibraries",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_MusicLibraries_MusicLibraryId",
                table: "Playlists");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_MusicLibraryId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "MusicLibraryId",
                table: "Playlists");
        }
    }
}
