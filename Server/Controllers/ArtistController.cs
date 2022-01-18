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
    public class ArtistController : ControllerBase
    {
        private MusicLibraryContext Context { get; set; }

        public ArtistController(MusicLibraryContext context)
        {
            Context = context;
        }

        [Route("GetArtists")]
        [HttpGet]
        public async Task<ActionResult> GetArtists()
        {
            try
            {
                var artists = await Context.Artists
                .Select(a => 
                new
                {
                    a.Id,
                    a.ArtistName
                })
                .ToListAsync();

                if (artists.Count == 0)
                    return NotFound("No artists in database");

                artists.Sort((a1, a2) => a1.ArtistName.CompareTo(a2.ArtistName));
                
                return Ok(artists);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}