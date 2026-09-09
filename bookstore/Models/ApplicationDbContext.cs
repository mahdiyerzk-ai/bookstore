using Microsoft.AspNetCore.Http.HttpResults;
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
        public DbSet<Category> Categories { get; set; }
        public DbSet<Product> Products { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Product>()
                .Property(p => p.Price)
                .HasPrecision(10, 2);

            modelBuilder.Entity<Product>()
                .HasOne(p => p.Category)
                .WithMany(c => c.Products)
                .HasForeignKey(p => p.CategoryId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
//CREATE TABLE Categories (
//    Id INT IDENTITY(1,1) PRIMARY KEY,
//    Name NVARCHAR(100) NOT NULL,
//    Description NVARCHAR(500) NULL
//);

//CREATE TABLE Products (
//    Id INT IDENTITY(1,1) PRIMARY KEY,
//    Name NVARCHAR(200) NOT NULL,
//    Description NVARCHAR(MAX) NULL,
//    Author NVARCHAR(150) NULL,
//    ISBN NVARCHAR(20) NULL,
//    Price DECIMAL(10,2) NOT NULL,
//    StockQuantity INT NOT NULL DEFAULT 0,
//    ImageUrl NVARCHAR(500) NULL,

//    CategoryId INT NOT NULL,

//    CONSTRAINT FK_Products_Categories
//        FOREIGN KEY (CategoryId)
//        REFERENCES Categories(Id)
//);