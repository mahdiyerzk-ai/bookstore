using bookstore.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace bookstore.Areas.Admin.Controllers
{
    [Area("Admin")]
    [Route("Categories")]
    public class CategoriesController : Controller
    {
        private readonly ApplicationDbContext _context;
        public CategoriesController(ApplicationDbContext context)
        {
            _context = context;
        }

        // GET: Categories
        public IActionResult Index()
        {
            var categories = _context.Categories.OrderBy(c => c.Name).ToList();
            return View(categories);
        }

        // GET: Categories/Details/5
        public IActionResult Details(int? id)
        {
            if (id == null) return NotFound();

            var category = _context.Categories.Include(c => c.Products).FirstOrDefault(c => c.Id == id);

            if (category == null)
                return NotFound();

            return View(category);
        }


        // GET: Categories/Create
        [Route("Create")]
        public IActionResult Create()
        {
            return View();
        }

        // POST: Categories/Create
        [HttpPost]
        [ValidateAntiForgeryToken]
        public async Task<IActionResult> Create(Category category)
        {
            if (ModelState.IsValid)
            {
                _context.Categories.Add(category);
                await _context.SaveChangesAsync();
                return RedirectToAction(nameof(Index));
            }
            return View(category);
        }

        // GET: Categories/Edit/5 public async Task<IActionResult> Edit(int? id) { if (id == null) return NotFound(); var category = await _context.Categories.FindAsync(id); if (category == null) return NotFound(); return View(category); } // POST: Categories/Edit/5 [HttpPost] [ValidateAntiForgeryToken] public async Task<IActionResult> Edit(int id, Category category) { if (id != category.Id) return NotFound(); if (ModelState.IsValid) { try { _context.Categories.Update(category); await _context.SaveChangesAsync(); } catch (DbUpdateConcurrencyException) { if (!CategoryExists(category.Id)) return NotFound(); throw; } return RedirectToAction(nameof(Index)); } return View(category); } // GET: Categories/Delete/5 public async Task<IActionResult> Delete(int? id) { if (id == null) return NotFound(); var category = await _context.Categories .Include(c => c.Products) .FirstOrDefaultAsync(c => c.Id == id); if (category == null) return NotFound(); return View(category); } // POST: Categories/Delete/5 [HttpPost, ActionName("Delete")] [ValidateAntiForgeryToken] public async Task<IActionResult> DeleteConfirmed(int id) { var category = await _context.Categories .Include(c => c.Products) .FirstOrDefaultAsync(c => c.Id == id); if (category == null) return NotFound(); // Don't allow deleting a category that still has products if (category.Products.Any()) { ModelState.AddModelError( "", "This category cannot be deleted because it contains products." ); return View(category); } _context.Categories.Remove(category); await _context.SaveChangesAsync(); return RedirectToAction(nameof(Index)); } private bool CategoryExists(int id) { return _context.Categories.Any(c => c.Id == id); } }
    }
}