using bookstore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Rendering;
using Microsoft.EntityFrameworkCore;

namespace bookstore.Areas.Admin.Controllers
{
    [Area("Admin")]
    public class ProductsController : Controller
    {
        private readonly ApplicationDbContext _context;

        public ProductsController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: /Admin/Products
        public async Task<IActionResult> Index(string? search, int? categoryId)
        {
            var query = _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .AsQueryable();

            if (!string.IsNullOrWhiteSpace(search))
            {
                search = search.Trim();
                query = query.Where(p =>
                    p.Name.Contains(search) ||
                    (p.Author != null && p.Author.Contains(search)) ||
                    (p.ISBN != null && p.ISBN.Contains(search)));
            }

            if (categoryId.HasValue)
                query = query.Where(p => p.CategoryId == categoryId.Value);

            var products = await query
                .OrderBy(p => p.Name)
                .ToListAsync();

            await LoadCategoriesAsync(categoryId);

            ViewData["Search"] = search;
            ViewData["CategoryId"] = categoryId;

            return View(products);
        }

        // GET: /Admin/Products/Details/5
        public async Task<IActionResult> Details(int? id)
        {
            if (id == null)
                return NotFound();

            var product = await _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return View(product);
        }

        // GET: /Admin/Products/Create
        public async Task<IActionResult> Create()
        {
            await LoadCategoriesAsync();
            //await LoadProductsAsync();
            return View();
        }

        // POST: /Admin/Products/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Product product)
        {
            if (!await CategoryExistsAsync(product.CategoryId))
                ModelState.AddModelError(nameof(product.CategoryId), "Please select a valid category.");

            //if (!ModelState.IsValid)
            //{
            //    await LoadCategoriesAsync(product.CategoryId);
            //    return View(product);
            //}

            _context.Products.Add(product);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Product created successfully.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /Admin/Products/Edit/5
        public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
                return NotFound();

            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            await LoadCategoriesAsync(product.CategoryId);
            return View(product);
        }

        // POST: /Admin/Products/Edit/5
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Edit(int id, Product product)
        {
            if (id != product.Id)
                return NotFound();

            if (!await CategoryExistsAsync(product.CategoryId))
                ModelState.AddModelError(nameof(product.CategoryId), "Please select a valid category.");

            if (!ModelState.IsValid)
            {
                await LoadCategoriesAsync(product.CategoryId);
                return View(product);
            }

            var existingProduct = await _context.Products.FindAsync(id);

            if (existingProduct == null)
                return NotFound();

            existingProduct.Name = product.Name;
            existingProduct.Description = product.Description;
            existingProduct.Author = product.Author;
            existingProduct.ISBN = product.ISBN;
            existingProduct.Price = product.Price;
            existingProduct.StockQuantity = product.StockQuantity;
            existingProduct.ImageUrl = product.ImageUrl;
            existingProduct.CategoryId = product.CategoryId;

            await _context.SaveChangesAsync();

            TempData["Success"] = "Product updated successfully.";
            return RedirectToAction(nameof(Index));
        }

        // GET: /Admin/Products/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
                return NotFound();

            var product = await _context.Products
                .Include(p => p.Category)
                .AsNoTracking()
                .FirstOrDefaultAsync(p => p.Id == id);

            if (product == null)
                return NotFound();

            return View(product);
        }

        // POST: /Admin/Products/Delete/5
        [HttpPost, ActionName("Delete")]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> DeleteConfirmed(int id)
        {
            var product = await _context.Products.FindAsync(id);

            if (product == null)
                return NotFound();

            _context.Products.Remove(product);
            await _context.SaveChangesAsync();

            TempData["Success"] = "Product deleted successfully.";
            return RedirectToAction(nameof(Index));
        }

        private async Task<bool> CategoryExistsAsync(int categoryId)
        {
            return await _context.Categories.AnyAsync(c => c.Id == categoryId);
        }

        private async Task LoadCategoriesAsync(int? selectedCategoryId = null)
        {
            var categories = await _context.Categories
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .ToListAsync();

            ViewBag.Categories = new SelectList(
                categories,
                "Id",
                "Name",
                selectedCategoryId);
        }

        private async Task LoadProductsAsync(int? selectedProductId = null)
        {
            var products = await _context.Products
                .AsNoTracking()
                .OrderBy(c => c.Name)
                .ToListAsync();

            ViewBag.Products = new SelectList(
                products,
                "Id",
                "Name",
                selectedProductId);
        }
    }
}
