using Microsoft.EntityFrameworkCore.Migrations;

namespace web_music_library.Migrations
{
    public partial class v6 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Playlists_PlaylistTracks_PlaylistTrackId",
                table: "Playlists");

            migrationBuilder.DropForeignKey(
                name: "FK_Tracks_PlaylistTracks_PlaylistTrackId",
                table: "Tracks");

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

            migrationBuilder.AddColumn<int>(
                name: "PlaylistId",
                table: "PlaylistTracks",
                type: "int",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "TrackId",
                table: "PlaylistTracks",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistTracks_PlaylistId",
                table: "PlaylistTracks",
                column: "PlaylistId");

            migrationBuilder.CreateIndex(
                name: "IX_PlaylistTracks_TrackId",
                table: "PlaylistTracks",
                column: "TrackId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistTracks_Playlists_PlaylistId",
                table: "PlaylistTracks",
                column: "PlaylistId",
                principalTable: "Playlists",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistTracks_Tracks_TrackId",
                table: "PlaylistTracks",
                column: "TrackId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Restrict);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistTracks_Playlists_PlaylistId",
                table: "PlaylistTracks");

            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistTracks_Tracks_TrackId",
                table: "PlaylistTracks");

            migrationBuilder.DropIndex(
                name: "IX_PlaylistTracks_PlaylistId",
                table: "PlaylistTracks");

            migrationBuilder.DropIndex(
                name: "IX_PlaylistTracks_TrackId",
                table: "PlaylistTracks");

            migrationBuilder.DropColumn(
                name: "PlaylistId",
                table: "PlaylistTracks");

            migrationBuilder.DropColumn(
                name: "TrackId",
                table: "PlaylistTracks");

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
    }
}
