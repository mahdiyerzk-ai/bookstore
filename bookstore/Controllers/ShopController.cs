using bookstore.Models;
using bookstore.Models.ViewModels;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bookstore.Controllers
{
    public class ShopController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ShopController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Shop
        // Search, category filter and sorting are handled client-side by Shop.js,
        // so the action only needs to load the catalog.
        public async Task<IActionResult> Index()
        {
            var categories = await _context.Categories
                .AsNoTracking()
                .Where(c => c.Products.Any())
                .OrderBy(c => c.Name)
                .Select(c => new ShopCategoryItem
                {
                    Id = c.Id,
                    Name = c.Name,
                    ProductCount = c.Products.Count
                })
                .ToListAsync();

            var products = await _context.Products
                .AsNoTracking()
                .OrderByDescending(p => p.Id)
                .Select(p => new ShopProductItem
                {
                    Id = p.Id,
                    Name = p.Name,
                    Author = p.Author,
                    ISBN = p.ISBN,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .ToListAsync();

            return View(new ShopIndexViewModel
            {
                Categories = categories,
                Products = products
            });
        }

        // GET: /Shop/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            var product = await _context.Products
                .AsNoTracking()
                .Where(p => p.Id == id)
                .Select(p => new ShopProductItem
                {
                    Id = p.Id,
                    Name = p.Name,
                    Description = p.Description,
                    Author = p.Author,
                    ISBN = p.ISBN,
                    Price = p.Price,
                    StockQuantity = p.StockQuantity,
                    ImageUrl = p.ImageUrl,
                    CategoryId = p.CategoryId,
                    CategoryName = p.Category.Name
                })
                .FirstOrDefaultAsync();

            if (product == null)
                return NotFound();

            return View(product);
        }
    }
}
