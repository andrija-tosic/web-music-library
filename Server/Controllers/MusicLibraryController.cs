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
    public class MusicLibraryController : ControllerBase
    {
        private MusicLibraryContext Context { get; set; }

        public MusicLibraryController(MusicLibraryContext context)
        {
            Context = context;
        }

        [Route("GetMusicLibraries")]
        [HttpGet]
        public async Task<ActionResult> GetMusicLibraries()
        {
            try
            {
                var libraries = await Context.MusicLibraries.ToListAsync();

                if (libraries.Count == 0)
                    return NotFound("No libraries in database");

                libraries.Sort((a1, a2) => a1.Owner.CompareTo(a2.Owner));

                return Ok(libraries);
            }
            catch (System.Exception e)
            {
                return StatusCode(Microsoft.AspNetCore.Http.StatusCodes.Status500InternalServerError, e.Message);
            }
        }

    }
}