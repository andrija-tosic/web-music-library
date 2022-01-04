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
    public class ReleaseController : ControllerBase
    {
        private MusicLibraryContext Context { get; set; }

        public ReleaseController(MusicLibraryContext context)
        {
            Context = context;
        }

        [Route("GetReleasesFromArtist/{id}")]
        [HttpGet]
        public async Task<ActionResult> GetReleasesFromArtist(int id)
        {
            try
            {
                var query = Context.Releases
                .Where(r => r.Artists.Select(a => a.Id).Contains(id));

                var releases = await query.Select(r =>
                    new
                    {
                        r.Id,
                        r.Name
                    }
                ).ToListAsync();

                releases.Sort((r1, r2) => r1.Name.CompareTo(r2.Name));
            
                return Ok(releases);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }
    }
}