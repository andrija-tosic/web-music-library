using System;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Models;

namespace Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class PlaylistTrackController : ControllerBase
    {
        private MusicLibraryContext Context { get; set; }

        public PlaylistTrackController(MusicLibraryContext context)
        {
            Context = context;
        }

        [Route("RemoveTrackFromPlaylist/{trackNumber}/{playlistId}")]
        [HttpDelete]
        public async Task<ActionResult> RemoveTrackFromPlaylist(int trackNumber, int playlistId)
        {
            try
            {
                if (trackNumber < 1)
                {
                    return BadRequest("Track number out of range");
                }

                if (playlistId < 1)
                {
                    return BadRequest("ID out of range");
                }

                Playlist playlist = Context.Playlists.Find(playlistId);
                PlaylistTrack playlistTrack = Context.PlaylistTracks
                .Where(pt => pt.TrackNumber == trackNumber && pt.Playlist.Id == playlistId)
                .FirstOrDefault();

                Track track = Context.PlaylistTracks
                .Where(pt => pt.TrackNumber == trackNumber && pt.Playlist.Id == playlistId)
                .Include(pt => pt.Track)
                .Select(pt => pt.Track)
                .FirstOrDefault();

                if (playlistTrack == null || track == null || playlist == null)
                {
                    return NotFound($"Such entry with track and playlist {playlistId} not found.");
                }

                Context.PlaylistTracks.Remove(playlistTrack);

                playlist.Length -= track.Duration;
                playlist.NumberOfTracks--;

                var playlistEntries = Context.PlaylistTracks.Where(pt => pt.Playlist.Id == playlistId);

                foreach (PlaylistTrack entry in playlistEntries)
                {
                    if (entry.TrackNumber > trackNumber)
                    {
                        entry.TrackNumber--;
                    }
                }

                await Context.SaveChangesAsync();

                return Ok($"Track number {trackNumber} removed from playlist {playlistId}.");
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}