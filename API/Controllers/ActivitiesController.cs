using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ActivitiesController : ControllerBase
    {
        private readonly IMediator _mediator;
        public ActivitiesController(IMediator mediator)
        {
            this._mediator = mediator;
        }
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List()
        {
            return await _mediator.Send(new List.Query());
        }
        [HttpGet("{Id}")]
        public async Task<ActionResult<Activity>> GetActivity(Guid Id)
        {
            return await _mediator.Send(new Details.Query{Id =Id});
        }
        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command dataCommand)
        {
            return await _mediator.Send(dataCommand);
        }
        [HttpPut]
        public async Task<ActionResult<Unit>> Edit (Edit.Command commandData)
        {
            return await _mediator.Send(commandData);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await _mediator.Send(new Delete.Command{ Id = Id});
        }
    }
}