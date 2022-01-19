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

        [Route("GetTracksFromPlaylist/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetTracksFromPlaylist(int id)
        {
            try
            {
                if (id < 1)
                {
                    return BadRequest("ID out of range");
                }

                var query = Context.PlaylistTracks
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

        [Route("EditPlaylist")]
        [HttpPut]
        public async Task<ActionResult> EditPlaylist([FromForm] Playlist playlist)
        {
            try
            {
                if (playlist.Id < 1)
                {
                    return BadRequest("ID out of range");
                }

                if (string.IsNullOrEmpty(playlist.Name) || string.IsNullOrWhiteSpace(playlist.Name))
                {
                    return BadRequest("Invalid and empty name.");
                }

                var p = await Context.Playlists.FindAsync(playlist.Id);
                if (p.Name != playlist.Name || p.Description != playlist.Description || p.ImagePath != playlist.ImagePath)
                {
                    p.Name = playlist.Name;
                    p.Description = playlist.Description;
                    p.ImagePath = playlist.ImagePath;
                    await Context.SaveChangesAsync();
                    return Ok($"Playlist with id {p.Id} attributes changed.");
                }
                else
                {
                    return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status304NotModified, "Playlist attributes are the same.");
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

        [Route("AddTracksToPlaylist/{playlistId}")]
        [HttpPost]
        public async Task<ActionResult> AddTracksToPlaylist([FromBody] int[] trackIds, int playlistId)
        {
            try
            {
                foreach (int id in trackIds)
                {
                    if (id < 1)
                    {
                        return BadRequest("Track ID out of range");
                    }
                }

                if (playlistId < 1)
                {
                    return BadRequest("Playlist ID out of range");
                }

                var tracks = await Context.Tracks.Where(t => trackIds.Contains(t.Id)).ToListAsync();
                Playlist playlist = await Context.Playlists.FindAsync(playlistId);

                if (tracks == null || playlist == null)
                {
                    return NotFound("Track or playlist invalid and not found.");
                }

                int prevNumberOfTracks = playlist.NumberOfTracks ?? 0;

                int trackNumber;

                if (playlist.NumberOfTracks != null)
                    trackNumber = (int)playlist.NumberOfTracks + 1;
                else
                    trackNumber = 0;

                foreach (Track track in tracks)
                {
                    Context.PlaylistTracks.Add(new PlaylistTrack
                    {
                        Track = track,
                        Playlist = playlist,
                        TrackNumber = trackNumber
                    });

                    trackNumber++;
                }

                playlist.Length += tracks.Sum(t => t.Duration) ?? 0;
                playlist.NumberOfTracks += tracks.ToList().Count;

                await Context.SaveChangesAsync();

                var trackReleaseAndArtists = await Context.Tracks
                .Include(t => t.Release)
                .ThenInclude(r => r.Artists)
                .Where(t => trackIds.Contains(t.Id))
                .ToListAsync();

                var retVal = trackReleaseAndArtists.Select((track, index) => new
                {
                    track.Id,
                    TrackNumber = (index + prevNumberOfTracks + 1),
                    track.Name,
                    Artists = track.Release.Artists.Select(a => a.ArtistName).ToList(),
                    Release = track.Release.Name,
                    track.Rating,
                    track.Duration
                });

                return Ok(retVal);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("GetPlaylists/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetPlaylists(int id)
        {
            try
            {
                if (id < 1)
                {
                    return BadRequest("ID out of range");
                }

                var playlists = await Context.Playlists.Where(p => p.MusicLibraryId == id).ToListAsync();

                if (playlists.Count() == 0)
                {
                    return NotFound("No playlists were found.");
                }

                var retVal = Context.Playlists
                    .Where(p => p.MusicLibraryId == id)
                    .Select(p =>
                    new
                    {
                        p.Id,
                        p.Name,
                        p.ImagePath,
                        p.NumberOfTracks,
                        p.Length
                    });

                return Ok(retVal);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("GetFullPlaylistInfo/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetFullPlaylistInfo(int id)
        {
            try
            {
                if (id < 1)
                {
                    return BadRequest("ID out of range");
                }

                Playlist playlist = await Context.Playlists.Where(p => p.Id == id).SingleAsync();

                if (playlist == null)
                {
                    return NotFound("No playlist was found.");
                }

                return Ok(playlist);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

        [Route("AddPlaylist")]
        [HttpPost]
        public async Task<ActionResult> AddPlaylist([FromForm] Playlist playlist)
        {
            try
            {
                if (playlist.MusicLibraryId < 1)
                {
                    return BadRequest("ID out of range");
                }
               
                if (string.IsNullOrEmpty(playlist.Name) || string.IsNullOrWhiteSpace(playlist.Name))
                {
                    return BadRequest("Can't add empty named playlist.");
                }

                MusicLibrary musicLibrary = Context.MusicLibraries.Find(playlist.MusicLibraryId);

                Playlist newPlaylist = new Playlist
                {
                    Name = playlist.Name,
                    NumberOfTracks = 0,
                    Length = 0,
                    ImagePath = playlist.ImagePath,
                    MusicLibraryId = musicLibrary.Id
                };

                Context.Playlists.Add(newPlaylist);

                await Context.SaveChangesAsync();

                return Ok(newPlaylist);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.StackTrace);
            }
        }

        [Route("DeletePlaylist/{musicLibraryId}/{playlistId}")]
        [HttpDelete]
        public async Task<ActionResult> DeletePlaylist(int musicLibraryId, int playlistId)
        {
            try
            {
                if (musicLibraryId < 1)
                {
                    return BadRequest("MusicLibrary ID out of range");
                }

                if (playlistId < 1)
                {
                    return BadRequest("Playlist ID out of range");
                }

                var playlist = Context.Playlists.Find(playlistId);

                if (playlist == null)
                {
                    return NotFound($"No playlist or music library found.");
                }

                var playlistReferences = await Context.PlaylistTracks.Where(pt => pt.Playlist.Id == playlistId).ToListAsync();

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
    }
}