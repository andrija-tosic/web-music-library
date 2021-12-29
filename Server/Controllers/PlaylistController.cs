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
                        Id = p.Id,
                        Name = p.Name
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
                var query = Context.Playlists.Where(p => p.Id == id)
                .Include(p => p.PlaylistTracks)
                .ThenInclude(pt => pt.Track)
                .ThenInclude(t => t.Release)
                .ThenInclude(r => r.Artists);

                var objects = await query.Select(p =>
                    p.PlaylistTracks.Select(pt =>
                    new
                    {
                        Id = pt.Track.Id,
                        Number = pt.TrackNumber,
                        Name = pt.Track.Name,
                        Artists = pt.Track.Release.Artists.Select(a => a.ArtistName),
                        Release = pt.Track.Release.Name,
                        Duration = pt.Track.Duration,
                        Rating = pt.Track.Rating,
                    })
                ).FirstAsync();

                return Ok(objects);
            }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
            }
        }
    }
}