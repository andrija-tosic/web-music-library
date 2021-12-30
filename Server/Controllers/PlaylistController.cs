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
                    return BadRequest("No playlists were found.");
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
                return BadRequest(e.Message);
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
                        Duration = pt.Track.Duration,
                        Rating = pt.Track.Rating,
                    }).ToListAsync();

                return Ok(objects);
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

        [Route("AddPlaylist/{name}")]
        [HttpPost]
        public async Task<ActionResult> AddPlaylist(string name)
        {
            try
            {
                if (string.IsNullOrEmpty(name) || string.IsNullOrWhiteSpace(name))
                {
                    return BadRequest("Can't add empty named playlist.");
                }

                Context.Playlists.Add(
                    new Playlist
                    {
                        Name = name,
                        NumberOfTracks = 0,
                        Length = 0
                    }
                );

                await Context.SaveChangesAsync();

                return Ok($"Playlist {name} added.");
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
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
                    return BadRequest($"No playlist with id {id} found.");
                }

                Context.Playlists.Remove(playlist);

                await Context.SaveChangesAsync();

                return Ok($"Playlist with id {id} removed.");
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }

    }
}