using System;
using System.Threading.Tasks;
using Application.Activities;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {

        [HttpGet]
        public async Task<ActionResult<List.ActivitiesEnvelope>> List(int? limit, int? offset,
        bool isGoing, bool isHost, DateTime? startDate)
        {
            return await Mediator.Send(new List.Query(limit, 
            offset, isGoing, isHost, startDate));
        }

        [HttpGet("{Id}")]
        [Authorize]
        public async Task<ActionResult<ActivityDto>> GetActivity(Guid Id)
        {
            return await Mediator.Send(new Details.Query { Id = Id });
        }
        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command dataCommand)
        {
            return await Mediator.Send(dataCommand);
        }
        [HttpPut]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Edit(Edit.Command commandData)
        {
            return await Mediator.Send(commandData);
        }
        [HttpDelete("{id}")]
        [Authorize(Policy = "IsActivityHost")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new Delete.Command { Id = Id });
        }

        [HttpPost("{id}/attend")]
        public async Task<ActionResult<Unit>> Attend(Guid id)
        {
            return await Mediator.Send(new Attend.Command { Id = id });
        }

        [HttpDelete("{id}/attend")]
        public async Task<ActionResult<Unit>> UnAttend(Guid id)
        {
            return await Mediator.Send(new Unattend.Command { Id = id });
        }
    }
}