using Microsoft.EntityFrameworkCore.Migrations;

namespace web_music_library.Migrations
{
    public partial class v4 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "PlaylistTrackId",
                table: "Tracks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "PlaylistTrackId",
                table: "Playlists",
                type: "int",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "PlaylistTracks",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    TrackNumber = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PlaylistTracks", x => x.Id);
                });

            migrationBuilder.CreateIndex(
                name: "IX_Tracks_PlaylistTrackId",
                table: "Tracks",
                column: "PlaylistTrackId");

            migrationBuilder.CreateIndex(
                name: "IX_Playlists_PlaylistTrackId",
                table: "Playlists",
                column: "PlaylistTrackId");

            migrationBuilder.AddForeignKey(
                name: "FK_Playlists_PlaylistTracks_PlaylistTrackId",
                table: "Playlists",
                column: "PlaylistTrackId",
                principalTable: "PlaylistTracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_Tracks_PlaylistTracks_PlaylistTrackId",
                table: "Tracks",
                column: "PlaylistTrackId",
                principalTable: "PlaylistTracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_PlaylistTracks_PlaylistTrackId",
                table: "Playlists");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_PlaylistTracks_PlaylistTrackId",
                table: "Tracks");

            migrationBuilder.DropTable(
                name: "PlaylistTracks");

            migrationBuilder.DropIndex(
                name: "IX_Tracks_PlaylistTrackId",
                table: "Tracks");

            migrationBuilder.DropIndex(
                name: "IX_Playlists_PlaylistTrackId",
                table: "Playlists");

            migrationBuilder.DropColumn(
                name: "PlaylistTrackId",
                table: "Tracks");

            migrationBuilder.DropColumn(
                name: "PlaylistTrackId",
                table: "Playlists");
        }
    }
}
