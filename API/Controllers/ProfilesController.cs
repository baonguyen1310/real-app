using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController : BaseController
    {
        [HttpGet("{username}")]
        public async Task<ActionResult<Profile>> GetTask(string userName)
        {
            return await Mediator.Send(new Details.Query { Username = userName });
        }

        [HttpGet("{username}/activities")]
        public async Task<ActionResult<List<UserActivityDto>>> GetUserActivity(string userName, string predicate)
        {
            return await Mediator.Send(new ListActivities.Query { Username = userName, Predicate = predicate });
        }
    }
}