using Microsoft.EntityFrameworkCore;

namespace bookstore.Models
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }
        public DbSet<User> Users { get; set; }
        public DbSet<About> AboutUs { get; set; }
        public DbSet<Contact> ContactUs { get; set; }

    }
}
