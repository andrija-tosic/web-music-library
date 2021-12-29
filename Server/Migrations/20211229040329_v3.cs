using Microsoft.EntityFrameworkCore.Migrations;

namespace web_music_library.Migrations
{
    public partial class v3 : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistTrack_Tracks_TracksId",
                table: "PlaylistTrack");

            migrationBuilder.RenameColumn(
                name: "TracksId",
                table: "PlaylistTrack",
                newName: "TracklistId");

            migrationBuilder.RenameIndex(
                name: "IX_PlaylistTrack_TracksId",
                table: "PlaylistTrack",
                newName: "IX_PlaylistTrack_TracklistId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistTrack_Tracks_TracklistId",
                table: "PlaylistTrack",
                column: "TracklistId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_PlaylistTrack_Tracks_TracklistId",
                table: "PlaylistTrack");

            migrationBuilder.RenameColumn(
                name: "TracklistId",
                table: "PlaylistTrack",
                newName: "TracksId");

            migrationBuilder.RenameIndex(
                name: "IX_PlaylistTrack_TracklistId",
                table: "PlaylistTrack",
                newName: "IX_PlaylistTrack_TracksId");

            migrationBuilder.AddForeignKey(
                name: "FK_PlaylistTrack_Tracks_TracksId",
                table: "PlaylistTrack",
                column: "TracksId",
                principalTable: "Tracks",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
