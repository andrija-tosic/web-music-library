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
    public class PlaylistController : ControllerBase
    {
        private MusicLibraryContext Context { get; set; }

        public PlaylistController(MusicLibraryContext context)
        {
            Context = context;
        }

        [Route("GetPlaylists")]
        [HttpGet]
        public async Task<ActionResult> GetPlaylists()
        {
            try
            {
                if (Context.Playlists.Count() == 0)
                {
                    return NotFound("No playlists were found.");
                }

                var playlists = await Context.Playlists.Select(p =>
                    new
                    {
                        p.Id,
                        p.Name,
                        p.NumberOfTracks,
                        p.Length
                    }).ToListAsync();

                return Ok(playlists);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("GetTracksFromPlaylist/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetTracksFromPlaylist(int id)
        {
            try
            {
                var query = Context.PlaylistTracks
                .Include(pt => pt.Playlist)
                .Include(pt => pt.Track)
                .ThenInclude(t => t.Release)
                .ThenInclude(r => r.Artists)
                .Where(pt => pt.Playlist.Id == id);

                var objects = await query.Select(pt =>
                    new
                    {
                        Id = pt.Track.Id,
                        Number = pt.TrackNumber,
                        Name = pt.Track.Name,
                        Artists = pt.Track.Release.Artists.Select(a => a.ArtistName),
                        Release = pt.Track.Release.Name,
                        Rating = pt.Track.Rating,
                        Duration = pt.Track.Duration,
                    }).ToListAsync();

                objects.Sort((o1, o2) => o1.Number - o2.Number);

                return Ok(objects);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("AddPlaylist")]
        [HttpPost]
        public async Task<ActionResult> AddPlaylist(Playlist playlist)
        {
            try
            {
                if (string.IsNullOrEmpty(playlist.Name) || string.IsNullOrWhiteSpace(playlist.Name))
                {
                    return BadRequest("Can't add empty named playlist.");
                }

                Playlist newPlaylist = new Playlist
                {
                    Name = playlist.Name,
                    NumberOfTracks = 0,
                    Length = 0
                };

                Context.Playlists.Add(newPlaylist);

                await Context.SaveChangesAsync();

                return Ok(newPlaylist);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("DeletePlaylist/{id}")]
        [HttpDelete]
        public async Task<ActionResult> DeletePlaylist(int id)
        {
            try
            {
                var playlist = Context.Playlists.Find(id);
                if (playlist == null)
                {
                    return NotFound($"No playlist with id {id} found.");
                }

                var playlistReferences = await Context.PlaylistTracks.Where(pt => pt.Playlist.Id == id).ToListAsync();

                Context.PlaylistTracks.RemoveRange(playlistReferences);

                Context.Playlists.Remove(playlist);

                await Context.SaveChangesAsync();

                return Ok($"Playlist {playlist} and references {playlistReferences.ToString()} removed.");
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("RenamePlaylist/{id}/{name}")]
        [HttpPatch]
        public async Task<ActionResult> RenamePlaylist(int id, string name)
        {
            try
            {
                if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                {
                    return BadRequest("Invalid and empty string.");
                }

                var playlist = await Context.Playlists.FindAsync(id);
                if (playlist.Name != name)
                {
                    playlist.Name = name;
                    await Context.SaveChangesAsync();
                    return Ok($"Playlist name with id {id} changed to {name}.");
                }
                else
                {
                    return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status304NotModified, "Playlist name is the same.");
                }
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        private async Task RecalculatePlaylistLength(Playlist playlist)
        {
            var tracks = playlist.PlaylistTracks.Select(pt => pt.Track.Duration);

            int newLength = tracks.Sum(duration => duration ?? 0);

            playlist.Length = newLength;

            await Context.SaveChangesAsync();
        }

        [Route("AddTrackToPlaylist/{trackId}/{playlistId}")]
        [HttpPut]
        public async Task<ActionResult> AddTrackToPlaylist(int trackId, int playlistId)
        {
            try
            {
                var track = await Context.Tracks.FindAsync(trackId);
                var playlist = await Context.Playlists.FindAsync(playlistId);

                if (track == null || playlist == null)
                {
                    return NotFound("Track or playlist invalid and not found.");
                }

                Context.PlaylistTracks.Add(new PlaylistTrack
                {
                    Track = track,
                    Playlist = playlist,
                    TrackNumber = (++playlist.NumberOfTracks) ?? 1
                });

                playlist.Length += track.Duration ?? 0;

                await Context.SaveChangesAsync();

                var trackReleaseAndArtists = Context.Tracks
                .Include(t => t.Release)
                .ThenInclude(r => r.Artists)
                .Where(t => t.Id == trackId);


                var retVal = new
                {
                    track.Id,
                    TrackNumber = playlist.NumberOfTracks,
                    track.Name,
                    Artists = trackReleaseAndArtists.Select(a => a.Release.Artists.Select(a => a.ArtistName)).ToList(),
                    Release = trackReleaseAndArtists.Select(a => a.Release.Name).FirstOrDefault(),
                    track.Rating,
                    track.Duration
                };

                return Ok(retVal);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("RemoveTrackFromPlaylist/{trackNumber}/{playlistId}")]
        [HttpPatch]
        public async Task<ActionResult> RemoveTrackFromPlaylist(int trackNumber, int playlistId)
        {
            try
            {
                var playlist = Context.Playlists.Find(playlistId);
                var playlistTrack = Context.PlaylistTracks.Where(pt => pt.TrackNumber == trackNumber).FirstOrDefault();

                var track = Context.PlaylistTracks.Where(pt => pt.TrackNumber == trackNumber)
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

                return Ok($"Track removed from playlist {playlistId}.");
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}