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
                var artists = Context.Artists
                .Where(a => a.Id == id)
                .Include(a => a.Releases);


                var releases = await artists.Select(a =>
                    a.Releases.Select(r =>
                    new
                    {
                        r.Id,
                        r.Name
                    })
                ).FirstAsync();

            return Ok(releases);
        }
            catch (System.Exception e)
            {
                return BadRequest(e.Message);
    }
}
    }
}