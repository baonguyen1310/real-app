using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using Application.Activities;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ActivitiesController : BaseController
    {
      
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> List()
        {
            return await Mediator.Send(new List.Query());
        }
        
        [HttpGet("{Id}")]
        [Authorize]
        public async Task<ActionResult<Activity>> GetActivity(Guid Id)
        {
            return await Mediator.Send(new Details.Query{Id =Id});
        }
        [HttpPost]
        public async Task<ActionResult<Unit>> Create(Create.Command dataCommand)
        {
            return await Mediator.Send(dataCommand);
        }
        [HttpPut]
        public async Task<ActionResult<Unit>> Edit (Edit.Command commandData)
        {
            return await Mediator.Send(commandData);
        }
        [HttpDelete("{id}")]
        public async Task<ActionResult<Unit>> Delete(Guid Id)
        {
            return await Mediator.Send(new Delete.Command{ Id = Id});
        }
    }
}