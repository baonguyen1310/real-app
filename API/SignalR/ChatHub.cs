using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Comments;
using MediatR;
using Microsoft.AspNetCore.SignalR;

namespace API.SignalR
{
    public class ChatHub : Hub
    {
        public IMediator _mediator { get; }
        public ChatHub(IMediator mediator)
        {
            _mediator = mediator;
        }
        public async Task SendComment(Create.Command command)
        {
            string userName = GetUserName();

            command.Username = userName;
            var comment = await _mediator.Send(command);

            await Clients.Group(command.ActivityId.ToString()).SendAsync("ReceiveComment", comment);
        }

        private string GetUserName()
        {
            return Context.User?.Claims?.FirstOrDefault(x => x.Type ==
                            ClaimTypes.NameIdentifier).Value;
        }

        public async Task AddToGroup(string groupName)
        {
            var userName = GetUserName();
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);
            
            await Clients.Groups(groupName).SendAsync("Send", $"{ userName } has joined the group");
        }

        public async Task RemoveFromGroup(string groupName)
        {
            var userName = GetUserName();
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, groupName);
            
            await Clients.Groups(groupName).SendAsync("Send", $"{ userName } has left the group");
        }
    }
}