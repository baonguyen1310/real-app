using System;
using System.Threading;
using System.Threading.Tasks;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
            public string Title { get; set; }
            public string Description { get; set; }
            public string Category { get; set; }
            public DateTime? Date { get; set; }
            public string City { get; set; }
            public string Venue { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext _context;
            public Handler(DataContext context)
            {
                _context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                // handler logic                
                var entity = await _context.Activities.FindAsync(request.Id);
                if(entity == null)
                    throw new Exception("Could not find Activity");
                
                entity.Title = request.Title ?? entity.Title;
                entity.Description = request.Description ?? entity.Description;
                entity.Category = request.Category ?? entity.Category;
                entity.Date = request.Date ?? entity.Date;
                entity.City = request.City ?? entity.City;
                entity.Venue = request.Venue ?? entity.Venue;

                var success = await _context.SaveChangesAsync() > 0;

                if (success) return Unit.Value;

                throw new Exception("Problem saving changes");
            }
        }
    }
}